// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IIPFiLendingPool {
    function fundLoan(address recipient, uint256 amount, uint256 loanId) external;
    function receiveLoanRepayment(uint256 principal, uint256 interest, uint256 loanId) external;
    function getBorrowRate() external view returns (uint256);
}

interface IRoyaltyStreamOracle {
    function predictEarnings(uint256 tokenId, uint256 duration)
        external view returns (uint256 projected, uint256 confidence);
}

interface IAfroBeatsIPRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
    function tokenBoundAccounts(uint256 tokenId) external view returns (address);
}

/**
 * @title IPFiLoanManager
 * @author AfroBeats Royalty Protocol Team
 * @notice Manage loans collateralized by IP-NFTs and future royalty streams
 * @dev Implements health factor monitoring, liquidations, and risk assessment
 */
contract IPFiLoanManager is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /// @notice Loan status enum
    enum Loan Status { Pending, Active, Repaid, Liquidated, Defaulted }

    /// @notice Loan structure
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 tokenId;              // IP-NFT token ID
        uint256 principal;            // Loan amount
        uint256 interestRate;         // APR in basis points
        uint256 duration;             // Loan duration in seconds
        uint256 startTime;
        uint256 totalRepayment;       // Principal + interest
        uint256 repaidAmount;
        LoanStatus status;
        uint256 projectedEarnings;    // At loan creation
        uint256 healthFactor;         // Current health (10000 = 1.0)
    }

    /// @notice Lending pool
    IIPFiLendingPool public lendingPool;

    /// @notice Royalty stream oracle
    IRoyaltyStreamOracle public streamOracle;

    /// @notice IP Registry
    IAfroBeatsIPRegistry public ipRegistry;

    /// @notice Deposit token
    IERC20 public depositToken;

    /// @notice Loan counter
    uint256 public loanIdCounter;

    /// @notice All loans
    mapping(uint256 => Loan) public loans;

    /// @notice Borrower's active loan IDs
    mapping(address => uint256[]) public borrowerLoans;

    /// @notice Token ID to active loan ID
    mapping(uint256 => uint256) public tokenToActiveLoan;

    /// @notice Loan-to-Value ratio (basis points, 7000 = 70%)
    uint256 public ltvRatio = 7000;

    /// @notice Liquidation threshold (basis points, 8000 = 80%)
    uint256 public liquidationThreshold = 8000;

    /// @notice Minimum loan amount
    uint256 public minLoanAmount = 100 * 1e6; // 100 USDT/USDC

    /// @notice Maximum loan amount
    uint256 public maxLoanAmount = 50000 * 1e6; // 50,000 USDT/USDC

    /// @notice Minimum confidence for oracle predictions
    uint256 public minConfidence = 7000; // 70%

    /// @notice Events
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 duration
    );

    event LoanApproved(
        uint256 indexed loanId,
        uint256 interestRate,
        uint256 totalRepayment
    );

    event LoanRepaid(
        uint256 indexed loanId,
        uint256 amount,
        uint256 remainingDebt
    );

    event LoanFullyRepaid(uint256 indexed loanId);

    event LoanLiquidated(
        uint256 indexed loanId,
        uint256 outstandingDebt,
        address indexed liquidator
    );

    event HealthFactorUpdated(
        uint256 indexed loanId,
        uint256 healthFactor
    );

    /// @notice Errors
    error Unauthorized();
    error InvalidAmount();
    error LoanNotActive();
    error InsufficientCollateral();
    error TokenAlreadyCollateralized();
    error LoanNotLiquidatable();

    /**
     * @notice Constructor
     */
    constructor(
        address _lendingPool,
        address _streamOracle,
        address _ipRegistry,
        address _depositToken
    ) {
        lendingPool = IIPFiLendingPool(_lendingPool);
        streamOracle = IRoyaltyStreamOracle(_streamOracle);
        ipRegistry = IAfroBeatsIPRegistry(_ipRegistry);
        depositToken = IERC20(_depositToken);
    }

    /**
     * @notice Request a loan against IP-NFT
     * @param tokenId IP-NFT token ID
     * @param amount Requested loan amount
     * @param duration Loan duration in seconds
     * @return loanId Created loan ID
     */
    function requestLoan(
        uint256 tokenId,
        uint256 amount,
        uint256 duration
    ) external nonReentrant whenNotPaused returns (uint256) {
        // Validate borrower owns the NFT
        address owner = ipRegistry.ownerOf(tokenId);
        require(owner == msg.sender, "Not NFT owner");

        // Check token not already used as collateral
        if (tokenToActiveLoan[tokenId] != 0) revert TokenAlreadyCollateralized();

        // Validate loan amount
        if (amount < minLoanAmount || amount > max LoanAmount) revert InvalidAmount();

        // Get projected earnings
        (uint256 projected, uint256 confidence) = streamOracle.predictEarnings(tokenId, duration * 2); // 2x for safety margin

        // Check confidence threshold
        require(confidence >= minConfidence, "Low confidence prediction");

        // Calculate maximum borrowable (projected * LTV)
        uint256 maxBorrowable = (projected * ltvRatio) / 10000;
        if (amount > maxBorrowable) revert InsufficientCollateral();

        // Create loan
        uint256 loanId = loanIdCounter++;
        
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            tokenId: tokenId,
            principal: amount,
            interestRate: 0, // Set on approval
            duration: duration,
            startTime: 0, // Set on approval
            totalRepayment: 0, // Calculated on approval
            repaidAmount: 0,
            status: LoanStatus.Pending,
            projectedEarnings: projected,
            healthFactor: 10000 // Full health initially
        });

        borrowerLoans[msg.sender].push(loanId);
        tokenToActiveLoan[tokenId] = loanId;

        emit LoanRequested(loanId, msg.sender, tokenId, amount, duration);

        return loanId;
    }

    /**
     * @notice Approve and fund a loan (auto-approved for MVP, can add manual review)
     * @param loanId Loan ID to approve
     */
    function approveLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");

        // Get current interest rate from pool
        uint256 interestRate = lendingPool.getBorrowRate();

        // Calculate total repayment (simple interest)
        uint256 interest = (loan.principal * interestRate * loan.duration) / (10000 * 365 days);
        uint256 totalRepayment = loan.principal + interest;

        // Update loan
        loan.interestRate = interestRate;
        loan.startTime = block.timestamp;
        loan.totalRepayment = totalRepayment;
        loan.status = LoanStatus.Active;

        // Get TBA address for funding
        address tba = ipRegistry.tokenBoundAccounts(loan.tokenId);
        require(tba != address(0), "TBA not created");

        // Fund loan from pool to TBA
        lendingPool.fundLoan(tba, loan.principal, loanId);

        emit LoanApproved(loanId, interestRate, totalRepayment);
    }

    /**
     * @notice Repay loan (partial or full)
     * @param loanId Loan ID
     * @param amount Amount to repay
     */
    function repayLoan(uint256 loanId, uint256 amount) external nonReentrant {
        Loan storage loan = loans[loanId];
        
        if (loan.status != LoanStatus.Active) revert LoanNotActive();
        require(msg.sender == loan.borrower, "Not borrower");
        if (amount == 0) revert InvalidAmount();

        uint256 remainingDebt = loan.totalRepayment - loan.repaidAmount;
        uint256 repayAmount = amount > remainingDebt ? remainingDebt : amount;

        // Transfer repayment from borrower
        depositToken.safeTransferFrom(msg.sender, address(this), repayAmount);

        loan.repaidAmount += repayAmount;

        // Calculate principal and interest portions
        uint256 principalPaid = (repayAmount * loan.principal) / loan.totalRepayment;
        uint256 interestPaid = repayAmount - principalPaid;

        // Send to lending pool
        depositToken.approve(address(lendingPool), repayAmount);
        lendingPool.receiveLoanRepayment(principalPaid, interestPaid, loanId);

        // Update health factor
        _updateHealthFactor(loanId);

        emit LoanRepaid(loanId, repayAmount, loan.totalRepayment - loan.repaidAmount);

        // Check if fully repaid
        if (loan.repaidAmount >= loan.totalRepayment) {
            loan.status = LoanStatus.Repaid;
            delete tokenToActiveLoan[loan.tokenId];
            emit LoanFullyRepaid(loanId);
        }
    }

    /**
     * @notice Liquidate undercollateralized loan
     * @param loanId Loan ID to liquidate
     */
    function liquidateLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        
        if (loan.status != LoanStatus.Active) revert LoanNotActive();

        // Update and check health factor
        _updateHealthFactor(loanId);
        
        if (loan.healthFactor >= liquidationThreshold) revert LoanNotLiquidatable();

        // Mark as liquidated
        loan.status = LoanStatus.Liquidated;
        delete tokenToActiveLoan[loan.tokenId];

        uint256 outstandingDebt = loan.totalRepayment - loan.repaidAmount;

        // In production: Transfer NFT to protocol/marketplace for sale
        // For MVP: Just mark as liquidated

        emit LoanLiquidated(loanId, outstandingDebt, msg.sender);
    }

    /**
     * @notice Calculate and return health factor for a loan
     * @param loanId Loan ID
     * @return healthFactor Health factor (10000 = 1.0 = healthy)
     */
    function getHealthFactor(uint256 loanId) external view returns (uint256 healthFactor) {
        Loan storage loan = loans[loanId];
        
        if (loan.status != LoanStatus.Active) return 0;

        uint256 outstandingDebt = loan.totalRepayment - loan.repaidAmount;
        if (outstandingDebt == 0) return 10000;

        // Get current projected earnings
        uint256 remainingDuration = 0;
        if (block.timestamp < loan.startTime + loan.duration) {
            remainingDuration = (loan.startTime + loan.duration) - block.timestamp;
        }

        (uint256 currentProjected,) = streamOracle.predictEarnings(loan.tokenId, remainingDuration);

        // Health = (currentProjected * LTV) / outstandingDebt
        healthFactor = (currentProjected * ltvRatio) / outstandingDebt;

        // Cap at 10000 (1.0)
        if (healthFactor > 10000) healthFactor = 10000;
    }

    /**
     * @notice Update health factor for a loan
     * @dev Internal function called during repayment or liquidation
     */
    function _updateHealthFactor(uint256 loanId) internal {
        Loan storage loan = loans[loanId];
        
        uint256 outstandingDebt = loan.totalRepayment - loan.repaidAmount;
        if (outstandingDebt == 0) {
            loan.healthFactor = 10000;
            return;
        }

        uint256 remainingDuration = 0;
        if (block.timestamp < loan.startTime + loan.duration) {
            remainingDuration = (loan.startTime + loan.duration) - block.timestamp;
        }

        (uint256 currentProjected,) = streamOracle.predictEarnings(loan.tokenId, remainingDuration);

        loan.healthFactor = (currentProjected * ltvRatio) / outstandingDebt;
        if (loan.healthFactor > 10000) loan.healthFactor = 10000;

        emit HealthFactorUpdated(loanId, loan.healthFactor);
    }

    /**
     * @notice Get all active loans
     * @return Array of active loan IDs
     */
    function getActiveLoans() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < loanIdCounter; i++) {
            if (loans[i].status == LoanStatus.Active) {
                count++;
            }
        }

        uint256[] memory activeLoans = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < loanIdCounter; i++) {
            if (loans[i].status == LoanStatus.Active) {
                activeLoans[index] = i;
                index++;
            }
        }

        return activeLoans;
    }

    /**
     * @notice Get borrower's loans
     * @param borrower Borrower address
     * @return Array of loan IDs
     */
    function getBorrowerLoans(address borrower) external view returns (uint256[] memory) {
        return borrowerLoans[borrower];
    }

    /**
     * @notice Update LTV ratio
     * @param newLTV New LTV in basis points
     */
    function updateLTV(uint256 newLTV) external onlyOwner {
        require(newLTV <= 9000, "LTV too high"); // Max 90%
        ltvRatio = newLTV;
    }

    /**
     * @notice Update liquidation threshold
     * @param newThreshold New threshold in basis points
     */
    function updateLiquidationThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold <= 10000, "Invalid threshold");
        liquidationThreshold = newThreshold;
    }

    /**
     * @notice Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
