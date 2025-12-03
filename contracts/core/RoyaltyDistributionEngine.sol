// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IAfroBeatsIPRegistry {
    struct RoyaltyBeneficiary {
        address payee;
        uint16 percentage;
    }
    
    function getRoyaltyBeneficiaries(uint256 tokenId) external view returns (RoyaltyBeneficiary[] memory);
    function tokenBoundAccounts(uint256 tokenId) external view returns (address);
}

/**
 * @title RoyaltyDistributionEngine
 * @author AfroBeats Royalty Protocol Team
 * @notice Automated royalty calculation and distribution based on streaming data
 * @dev Integrates with streaming oracle for play count data
 */
contract RoyaltyDistributionEngine is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice IP Registry contract
    IAfroBeatsIPRegistry public ipRegistry;

    /// @notice Payment token (USDT/USDC)
    IERC20 public paymentToken;

    /// @notice Rate per stream in smallest token unit (e.g., $0.003 per stream)
    uint256 public ratePerStream;

    /// @notice Oracle address authorized to submit streaming data
    address public oracle;

    /// @notice Streaming data for each token
    struct StreamingData {
        uint256 totalStreams;
        uint256 lastUpdateTimestamp;
        uint256 totalEarned;
        uint256 totalDistributed;
    }

    /// @notice Failed payment queue
    struct FailedPayment {
        address payee;
        uint256 amount;
        uint256 timestamp;
        uint8 retryCount;
    }

    /// @notice Mapping from token ID to streaming data
    mapping(uint256 => StreamingData) public streamingData;

    /// @notice Mapping from token ID to failed payments
    mapping(uint256 => FailedPayment[]) public failedPayments;

    /// @notice Beneficiary balances
    mapping(address => uint256) public beneficiaryBalances;

    /// @notice Events
    event StreamingDataUpdated(
        uint256 indexed tokenId,
        uint256 newStreams,
        uint256 totalStreams,
        uint256 earningsCalculated
    );

    event RoyaltyDistributed(
        uint256 indexed tokenId,
        address indexed beneficiary,
        uint256 amount
    );

    event PaymentFailed(
        uint256 indexed tokenId,
        address indexed beneficiary,
        uint256 amount,
        uint8 retryCount
    );

    event PaymentRetried(
        uint256 indexed tokenId,
        address indexed beneficiary,
        uint256 amount,
        bool success
    );

    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event RatePerStreamUpdated(uint256 oldRate, uint256 newRate);

    /// @notice Errors
    error Unauthorized();
    error InvalidAmount();
    error InsufficientBalance();

    /// @notice Modifiers
    modifier onlyOracle() {
        if (msg.sender != oracle) revert Unauthorized();
        _;
    }

    /**
     * @notice Constructor
     * @param _ipRegistry IP Registry contract address
     * @param _paymentToken Payment token address
     * @param _ratePerStream Rate per stream
     * @param _oracle Oracle address
     */
    constructor(
        address _ipRegistry,
        address _paymentToken,
        uint256 _ratePerStream,
        address _oracle
    ) {
        ipRegistry = IAfroBeatsIPRegistry(_ipRegistry);
        paymentToken = IERC20(_paymentToken);
        ratePerStream = _ratePerStream;
        oracle = _oracle;
    }

    /**
     * @notice Update streaming data from oracle
     * @param tokenId Token ID
     * @param newStreamCount New total stream count
     */
    function updateStreamingData(
        uint256 tokenId,
        uint256 newStreamCount
    ) external onlyOracle nonReentrant {
        StreamingData storage data = streamingData[tokenId];
        
        require(newStreamCount >= data.totalStreams, "Invalid stream count");
        
        uint256 newStreams = newStreamCount - data.totalStreams;
        if (newStreams == 0) return;

        // Calculate earnings from new streams
        uint256 earnings = newStreams * ratePerStream;
        
        data.totalStreams = newStreamCount;
        data.lastUpdateTimestamp = block.timestamp;
        data.totalEarned += earnings;

        emit StreamingDataUpdated(
            tokenId,
            newStreams,
            newStreamCount,
            earnings
        );

        // Distribute royalties
        _distributeRoyalties(tokenId, earnings);
    }

    /**
     * @notice Batch updatestreaming data for multiple tokens
     * @param tokenIds Array of token IDs
     * @param streamCounts Array of stream counts
     */
    function batchUpdateStreamingData(
        uint256[] calldata tokenIds,
        uint256[] calldata streamCounts
    ) external onlyOracle {
        require(tokenIds.length == streamCounts.length, "Length mismatch");
        require(tokenIds.length <= 100, "Batch too large");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 newStreamCount = streamCounts[i];

            StreamingData storage data = streamingData[tokenId];
            
            if (newStreamCount >= data.totalStreams) {
                uint256 newStreams = newStreamCount - data.totalStreams;
                if (newStreams > 0) {
                    uint256 earnings = newStreams * ratePerStream;
                    
                    data.totalStreams = newStreamCount;
                    data.lastUpdateTimestamp = block.timestamp;
                    data.totalEarned += earnings;

                    emit StreamingDataUpdated(
                        tokenId,
                        newStreams,
                        newStreamCount,
                        earnings
                    );

                    _distributeRoyalties(tokenId, earnings);
                }
            }
        }
    }

    /**
     * @notice Withdraw beneficiary balance
     */
    function withdrawBeneficiary() external nonReentrant {
        uint256 balance = beneficiaryBalances[msg.sender];
        if (balance == 0) revert InvalidAmount();

        beneficiaryBalances[msg.sender] = 0;
        paymentToken.safeTransfer(msg.sender, balance);
    }

    /**
     * @notice Retry failed payments
     * @param tokenId Token ID
     * @param maxRetries Maximum number of retries
     */
    function retryFailedPayments(
        uint256 tokenId,
        uint256 maxRetries
    ) external nonReentrant {
        FailedPayment[] storage failures = failedPayments[tokenId];
        
        uint256 processed = 0;
        for (uint256 i = 0; i < failures.length && processed < maxRetries; i++) {
            FailedPayment storage payment = failures[i];
            
            if (payment.amount > 0) {
                try this._safeTransfer(payment.payee, payment.amount) {
                    emit PaymentRetried(tokenId, payment.payee, payment.amount, true);
                    payment.amount = 0;  // Mark as processed
                } catch {
                    payment.retryCount++;
                    emit PaymentRetried(tokenId, payment.payee, payment.amount, false);
                }
                processed++;
            }
        }

        // Clean up processed payments
        _cleanupFailedPayments(tokenId);
    }

    /**
     * @notice Update oracle address
     * @param newOracle New oracle address
     */
    function updateOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle");
        emit OracleUpdated(oracle, newOracle);
        oracle = newOracle;
    }

    /**
     * @notice Update rate per stream
     * @param newRate New rate
     */
    function updateRatePerStream(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Invalid rate");
        emit RatePerStreamUpdated(ratePerStream, newRate);
        ratePerStream = newRate;
    }

    /**
     * @notice Get streaming statistics for a token
     * @param tokenId Token ID
     * @return StreamingData struct
     */
    function getStreamingData(
        uint256 tokenId
    ) external view returns (StreamingData memory) {
        return streamingData[tokenId];
    }

    /**
     * @dev Distribute royalties to beneficiaries
     */
    function _distributeRoyalties(
        uint256 tokenId,
        uint256 totalAmount
    ) internal {
        IAfroBeatsIPRegistry.RoyaltyBeneficiary[] memory beneficiaries = 
            ipRegistry.getRoyaltyBeneficiaries(tokenId);

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            uint256 amount = (totalAmount * beneficiaries[i].percentage) / 10000;
            
            if (amount > 0) {
                // Add to beneficiary balance
                beneficiaryBalances[beneficiaries[i].payee] += amount;
                
                streamingData[tokenId].totalDistributed += amount;

                emit RoyaltyDistributed(
                    tokenId,
                    beneficiaries[i].payee,
                    amount
                );
            }
        }
    }

    /**
     * @dev Safe transfer with failure handling
     */
    function _safeTransfer(address to, uint256 amount) external {
        require(msg.sender == address(this), "Internal only");
        paymentToken.safeTransfer(to, amount);
    }

    /**
     * @dev Clean up processed failed payments
     */
    function _cleanupFailedPayments(uint256 tokenId) internal {
        FailedPayment[] storage failures = failedPayments[tokenId];
        
        uint256 writeIndex = 0;
        for (uint256 readIndex = 0; readIndex < failures.length; readIndex++) {
            if (failures[readIndex].amount > 0) {
                if (writeIndex != readIndex) {
                    failures[writeIndex] = failures[readIndex];
                }
                writeIndex++;
            }
        }
        
        // Truncate array
        while (failures.length > writeIndex) {
            failures.pop();
        }
    }

    /**
     * @notice Emergency withdraw (owner only)
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
