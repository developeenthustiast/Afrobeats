// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IRoyaltyDistributionEngine {
    struct StreamingData {
        uint256 totalStreams;
        uint256 lastUpdateTimestamp;
        uint256 totalEarned;
        uint256 totalDistributed;
    }
    
    function getStreamingData(uint256 tokenId) external view returns (StreamingData memory);
}

/**
 * @title RoyaltyStreamOracle
 * @author AfroBeats Royalty Protocol Team
 * @notice Oracle for predicting future royalty earnings based on historical data
 * @dev Integrates with off-chain ML service for advanced predictions
 */
contract RoyaltyStreamOracle is Ownable {
    /// @notice Royalty Distribution Engine
    IRoyaltyDistributionEngine public royaltyEngine;

    /// @notice Authorized prediction providers (ML service addresses)
    mapping(address => bool) public authorizedProviders;

    /// @notice Prediction structure
    struct EarningsPrediction {
        uint256 projectedAmount;   // Projected earnings
        uint256 confidence;        // Confidence score (10000 = 100%)
        uint256 timestamp;
        address provider;
        uint256 duration;          // Prediction duration
    }

    /// @notice Latest predictions per token
    mapping(uint256 => EarningsPrediction) public latestPredictions;

    /// @notice Historical predictions (for accuracy tracking)
    mapping(uint256 => EarningsPrediction[]) public predictionHistory;

    /// @notice Minimum confidence threshold
    uint256 public minConfidence = 6000; // 60%

    /// @notice Rate per stream (fallback for simple calculations)
    uint256 public ratePerStream = 3000; // $0.003 in 6 decimals

    /// @notice Events
    event PredictionSubmitted(
        uint256 indexed tokenId,
        uint256 projectedAmount,
        uint256 confidence,
        uint256 duration,
        address provider
    );

    event ProviderAuthorized(address indexed provider);
    event ProviderRevoked(address indexed provider);
    event MinConfidenceUpdated(uint256 newMinConfidence);

    /// @notice Errors
    error Unauthorized();
    error LowConfidence();
    error InvalidDuration();

    /// @notice Modifiers
    modifier onlyAuthorized() {
        if (!authorizedProviders[msg.sender]) revert Unauthorized();
        _;
    }

    /**
     * @notice Constructor
     * @param _royaltyEngine Royalty distribution engine address
     */
    constructor(address _royaltyEngine) {
        royaltyEngine = IRoyaltyDistributionEngine(_royaltyEngine);
        authorizedProviders[msg.sender] = true;
    }

    /**
     * @notice Predict future earnings for a token
     * @param tokenId Token ID
     * @param duration Prediction duration in seconds
     * @return projected Projected earnings
     * @return confidence Confidence score
     */
    function predictEarnings(
        uint256 tokenId,
        uint256 duration
    ) external view returns (uint256 projected, uint256 confidence) {
        // Check if we have a recent ML prediction
        EarningsPrediction memory latest = latestPredictions[tokenId];

        // 🔒 SECURITY FIX: Validate prediction freshness (max 24 hours old)
        if (latest.timestamp > 0) {
            require(
                block.timestamp - latest.timestamp < 24 hours,
                "Oracle: Prediction stale"
            );
        }

        if (
            latest.timestamp > 0 &&
            block.timestamp - latest.timestamp < 24 hours &&
            latest.duration >= duration
        ) {
            // Use cached ML prediction
            // Scale down if requested duration is shorter
            uint256 scaledProjected = (latest.projectedAmount * duration) / latest.duration;
            return (scaledProjected, latest.confidence);
        }

        // Fallback: Simple linear projection from historical data
        return _simpleProjection(tokenId, duration);
    }

    /**
     * @notice Submit ML-based prediction (called by authorized backend service)
     * @param tokenId Token ID
     * @param projectedAmount Projected earnings over duration
     * @param confidence Confidence score (basis points)
     * @param duration Prediction duration
     */
    function submitPrediction(
        uint256 tokenId,
        uint256 projectedAmount,
        uint256 confidence,
        uint256 duration
    ) external onlyAuthorized {
        if (confidence < minConfidence) revert LowConfidence();
        if (duration == 0) revert InvalidDuration();

        EarningsPrediction memory prediction = EarningsPrediction({
            projectedAmount: projectedAmount,
            confidence: confidence,
            timestamp: block.timestamp,
            provider: msg.sender,
            duration: duration
        });

        latestPredictions[tokenId] = prediction;
        predictionHistory[tokenId].push(prediction);

        emit PredictionSubmitted(tokenId, projectedAmount, confidence, duration, msg.sender);
    }

    /**
     * @notice Batch submit predictions (gas efficient)
     * @param tokenIds Array of token IDs
     * @param projectedAmounts Array of projected amounts
     * @param confidences Array of confidence scores
     * @param durations Array of durations
     */
    function batchSubmitPredictions(
        uint256[] calldata tokenIds,
        uint256[] calldata projectedAmounts,
        uint256[] calldata confidences,
        uint256[] calldata durations
    ) external onlyAuthorized {
        require(
            tokenIds.length == projectedAmounts.length &&
            tokenIds.length == confidences.length &&
            tokenIds.length == durations.length,
            "Length mismatch"
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (confidences[i] < minConfidence) continue;
            if (durations[i] == 0) continue;

            EarningsPrediction memory prediction = EarningsPrediction({
                projectedAmount: projectedAmounts[i],
                confidence: confidences[i],
                timestamp: block.timestamp,
                provider: msg.sender,
                duration: durations[i]
            });

            latestPredictions[tokenIds[i]] = prediction;
            predictionHistory[tokenIds[i]].push(prediction);

            emit PredictionSubmitted(
                tokenIds[i],
                projectedAmounts[i],
                confidences[i],
                durations[i],
                msg.sender
            );
        }
    }

    /**
     * @notice Get prediction history for a token
     * @param tokenId Token ID
     * @return Array of historical predictions
     */
    function getPredictionHistory(
        uint256 tokenId
    ) external view returns (EarningsPrediction[] memory) {
        return predictionHistory[tokenId];
    }

    /**
     * @notice Simple linear projection based on historical streaming data
     * @dev Fallback when ML prediction unavailable
     * @param tokenId Token ID
     * @param duration Prediction duration
     * @return projected Projected earnings
     * @return confidence Confidence score (lower for simple method)
     */
    function _simpleProjection(
        uint256 tokenId,
        uint256 duration
    ) internal view returns (uint256 projected, uint256 confidence) {
        IRoyaltyDistributionEngine.StreamingData memory data = 
            royaltyEngine.getStreamingData(tokenId);

        if (data.totalStreams == 0) {
            return (0, 0);
        }

        // Calculate average daily streams
        uint256 daysSinceRegistration = (block.timestamp - data.lastUpdateTimestamp) / 1 days;
        if (daysSinceRegistration == 0) daysSinceRegistration = 1;

        uint256 avgDailyStreams = data.totalStreams / daysSinceRegistration;

        // Project for requested duration
        uint256 daysToProject = duration / 1 days;
        uint256 projectedStreams = avgDailyStreams * daysToProject;

        // Calculate projected earnings
        projected = projectedStreams * ratePerStream;

        // Conservative confidence for simple projection
        confidence = 5000; // 50%

        return (projected, confidence);
    }

    /**
     * @notice Authorize prediction provider
     * @param provider Provider address
     */
    function authorizeProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider");
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    /**
     * @notice Revoke prediction provider
     * @param provider Provider address
     */
    function revokeProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider);
    }

    /**
     * @notice Update minimum confidence threshold
     * @param newMinConfidence New minimum confidence (basis points)
     */
    function updateMinConfidence(uint256 newMinConfidence) external onlyOwner {
        require(newMinConfidence <= 10000, "Invalid confidence");
        minConfidence = newMinConfidence;
        emit MinConfidenceUpdated(newMinConfidence);
    }

    /**
     * @notice Update rate per stream for fallback calculations
     * @param newRate New rate per stream
     */
    function updateRatePerStream(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Invalid rate");
        ratePerStream = newRate;
    }

    /**
     * @notice Update royalty engine address
     * @param newRoyaltyEngine New engine address
     */
    function updateRoyaltyEngine(address newRoyaltyEngine) external onlyOwner {
        require(newRoyaltyEngine != address(0), "Invalid address");
        royaltyEngine = IRoyaltyDistributionEngine(newRoyaltyEngine);
    }
}
