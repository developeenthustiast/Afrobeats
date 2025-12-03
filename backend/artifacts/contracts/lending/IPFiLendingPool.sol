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
