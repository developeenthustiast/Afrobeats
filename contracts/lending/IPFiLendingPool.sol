// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title IPFiLendingPool
 * @author AfroBeats Royalty Protocol Team
 * @notice Liquidity pool for IP-backed loans with utilization-based interest rates
 * @dev Implements ERC-20 LP tokens for liquidity providers
 */
contract IPFiLendingPool is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @notice Deposit token (USDT/USDC)
    IERC20 public immutable depositToken;

    /// @notice Loan manager contract
    address public loanManager;

    /// @notice Total amount borrowed
    uint256 public totalBorrowed;

    /// @notice Total deposited
    uint256 public totalDeposited;

    /// @notice Protocol fee (basis points)
    uint256 public protocolFee = 500; // 5%

    /// @notice Interest rate model
    struct InterestRateModel {
        uint256 baseRate;           // Base rate in basis points
        uint256 optimalUtilization; // Optimal utilization in basis points
        uint256 rateAtOptimal;      // Rate at optimal utilization
        uint256 maxRate;            // Maximum rate
    }

    InterestRateModel public rateModel;

    /// @notice Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event LoanFunded(uint256 indexed loanId, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, uint256 principal, uint256 interest);
    event InterestRateUpdated(uint256 baseRate, uint256 optimalUtilization, uint256 rateAtOptimal, uint256 maxRate);
    event ProtocolFeeUpdated(uint256 newFee);

    /**
     * @notice Constructor
     * @param _depositToken Deposit token address (USDT/USDC)
     * @param _name LP token name
     * @param _symbol LP token symbol
     */
    constructor(
        address _depositToken,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        require(_depositToken != address(0), "Invalid token");
        depositToken = IERC20(_depositToken);

        // Initialize interest rate model
        rateModel = InterestRateModel({
            baseRate: 200,              // 2% base
            optimalUtilization: 8000,   // 80% optimal
            rateAtOptimal: 1000,        // 10% at optimal
            maxRate: 5000               // 50% max
        });
    }

    /**
     * @notice Deposit assets to earn yield
     * @param amount Amount to deposit
     * @return shares LP tokens minted
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused returns (uint256 shares) {
        require(amount > 0, "Invalid amount");

        // Calculate shares to mint
        uint256 totalAssets = totalDeposited + totalBorrowed;
        shares = (totalSupply() == 0 || totalAssets == 0) 
            ? amount 
            : (amount * totalSupply()) / totalAssets;

        // Transfer tokens
        depositToken.safeTransferFrom(msg.sender, address(this), amount);

        // Mint LP tokens
        _mint(msg.sender, shares);
        totalDeposited += amount;

        emit Deposited(msg.sender, amount, shares);
    }

    /**
     * @notice Withdraw assets
     * @param shares LP tokens to burn
     * @return amount Assets withdrawn
     */
    function withdraw(uint256 shares) external nonReentrant returns (uint256 amount) {
        require(shares > 0, "Invalid shares");
        require(balanceOf(msg.sender) >= shares, "Insufficient balance");

        // Calculate assets to return
        uint256 totalAssets = totalDeposited + totalBorrowed;
        amount = (shares * totalAssets) / totalSupply();

        require(amount <= depositToken.balanceOf(address(this)), "Insufficient liquidity");

        // Burn LP tokens
        _burn(msg.sender, shares);
        totalDeposited -= amount;

        // Transfer assets
        depositToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, shares);
    }

    /**
     * @notice Fund a loan (called by loan manager)
     * @param recipient Loan recipient
     * @param amount Loan amount
     * @param loanId Loan ID
     */
    function fundLoan(address recipient, uint256 amount, uint256 loanId) external nonReentrant {
        require(msg.sender == loanManager, "Only loan manager");
        require(amount <= depositToken.balanceOf(address(this)), "Insufficient liquidity");

        totalBorrowed += amount;
        depositToken.safeTransfer(recipient, amount);

        emit LoanFunded(loanId, amount);
    }

    /**
     * @notice Receive loan repayment (called by loan manager)
     * @param principal Principal amount
     * @param interest Interest amount
     * @param loanId Loan ID
     */
    function receiveLoanRepayment(uint256 principal, uint256 interest, uint256 loanId) external nonReentrant {
        require(msg.sender == loanManager, "Only loan manager");

        uint256 totalRepayment = principal + interest;
        depositToken.safeTransferFrom(msg.sender, address(this), totalRepayment);

        totalBorrowed -= principal;
        totalDeposited += interest;

        emit LoanRepaid(loanId, principal, interest);
    }

    /**
     * @notice Get current borrow rate
     * @return Borrow APR in basis points
     */
    function getBorrowRate() public view returns (uint256) {
        uint256 utilization = getUtilizationRate();

        if (utilization <= rateModel.optimalUtilization) {
            // Linear from base to optimal
            return rateModel.baseRate + 
                ((rateModel.rateAtOptimal - rateModel.baseRate) * utilization) / rateModel.optimalUtilization;
        } else {
            // Linear from optimal to max
            uint256 excessUtilization = utilization - rateModel.optimalUtilization;
            uint256 excessRange = 10000 - rateModel.optimalUtilization;
            return rateModel.rateAtOptimal + 
                ((rateModel.maxRate - rateModel.rateAtOptimal) * excessUtilization) / excessRange;
        }
    }

    /**
     * @notice Get utilization rate
     * @return Utilization in basis points
     */
    function getUtilizationRate() public view returns (uint256) {
        uint256 totalAssets = totalDeposited + totalBorrowed;
        if (totalAssets == 0) return 0;
        return (totalBorrowed * 10000) / totalAssets;
    }

    /**
     * @notice Get current supply rate
     * @return Supply APR in basis points
     */
    function getSupplyRate() public view returns (uint256) {
        uint256 utilization = getUtilizationRate();
        uint256 borrowRate = getBorrowRate();

        // Supply rate = borrow rate × utilization × (1 - protocol fee)
        uint256 supplyRate = (borrowRate * utilization * (10000 - protocolFee)) / (10000 * 10000);
        return supplyRate;
    }

    /**
     * @notice Update interest rate model
     * @param baseRate New base rate
     * @param optimalUtilization New optimal utilization
     * @param rateAtOptimal New rate at optimal
     * @param maxRate New max rate
     */
    function updateInterestRateModel(
        uint256 baseRate,
        uint256 optimalUtilization,
        uint256 rateAtOptimal,
        uint256 maxRate
    ) external onlyOwner {
        require(baseRate <= rateAtOptimal, "Invalid base rate");
        require(rateAtOptimal <= maxRate, "Invalid optimal rate");
        require(optimalUtilization <= 10000, "Invalid utilization");

        rateModel = InterestRateModel({
            baseRate: baseRate,
            optimalUtilization: optimalUtilization,
            rateAtOptimal: rateAtOptimal,
            maxRate: maxRate
        });

        emit InterestRateUpdated(baseRate, optimalUtilization, rateAtOptimal, maxRate);
    }

    /**
     * @notice Update protocol fee
     * @param newFee New fee in basis points
     */
    function updateProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        protocolFee = newFee;
        emit ProtocolFeeUpdated(newFee);
    }

    /**
     * @notice Set loan manager address
     * @param _loanManager Loan manager contract address
     */
    function setLoanManager(address _loanManager) external onlyOwner {
        require(_loanManager != address(0), "Invalid address");
        loanManager = _loanManager;
    }

    /**
     * @notice Pause pool
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause pool
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = depositToken.balanceOf(address(this));
        depositToken.safeTransfer(owner(), balance);
    }
}
