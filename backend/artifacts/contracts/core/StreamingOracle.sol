// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StreamingOracle
 * @author AfroBeats Royalty Protocol Team
 * @notice Oracle for fetching off-chain streaming data
 * @dev For hackathon: Mock oracle. Post-hackathon: Chainlink Functions integration
 */
contract StreamingOracle is Ownable {
    /// @notice Authorized data providers
    mapping(address => bool) public authorizedProviders;

    /// @notice Streaming data submissions
    struct StreamingSubmission {
        uint256 spotifyStreams;
        uint256 appleMusicStreams;
        uint256 timestamp;
        address submitter;
    }

    /// @notice Mapping from song ID (ISRC) to submissions
    mapping(string => StreamingSubmission[]) public submissions;

    /// @notice Mapping from song ID to aggregated streams
    mapping(string => uint256) public aggregatedStreams;

    /// @notice Rate limiting
    mapping(address => uint256) public lastSubmissionTime;
    uint256 public constant RATE_LIMIT_PERIOD = 1 hours;

    /// @notice Events
    event DataSubmitted(
        string indexed isrc,
        uint256 spotifyStreams,
        uint256 appleMusicStreams,
        address indexed submitter
    );

    event ProviderAuthorized(address indexed provider);
    event ProviderRevoked(address indexed provider);

    event StreamsAggregated(
        string indexed isrc,
        uint256 totalStreams
    );

    /// @notice Errors
    error Unauthorized();
    error RateLimited();
    error InvalidData();

    /// @notice Modifiers
    modifier onlyAuthorized() {
        if (!authorizedProviders[msg.sender]) revert Unauthorized();
        _;
    }

    modifier rateLimited() {
        if (block.timestamp < lastSubmissionTime[msg.sender] + RATE_LIMIT_PERIOD) {
            revert RateLimited();
        }
        _;
    }

    /**
     * @notice Constructor
     */
    constructor() {
        // Owner is automatically authorized
        authorizedProviders[msg.sender] = true;
    }

    /**
     * @notice Submit streaming data
     * @param isrc International Standard Recording Code
     * @param spotifyStreams Spotify play count
     * @param appleMusicStreams Apple Music play count
     */
    function submitStreamingData(
        string calldata isrc,
        uint256 spotifyStreams,
        uint256 appleMusicStreams
    ) external onlyAuthorized rateLimited {
        require(bytes(isrc).length > 0, "Invalid ISRC");
        require(spotifyStreams > 0 || appleMusicStreams > 0, "No stream data");

        submissions[isrc].push(StreamingSubmission({
            spotifyStreams: spotifyStreams,
            appleMusicStreams: appleMusicStreams,
            timestamp: block.timestamp,
            submitter: msg.sender
        }));

        lastSubmissionTime[msg.sender] = block.timestamp;

        emit DataSubmitted(
            isrc,
            spotifyStreams,
            appleMusicStreams,
            msg.sender
        );

        // Auto-aggregate if single source
        _aggregateStreams(isrc);
    }

    /**
     * @notice Batch submit streaming data
     * @param isrcs Array of ISRCs
     * @param spotifyStreams Array of Spotify streams
     * @param appleMusicStreams Array of Apple Music streams
     */
    function batchSubmitStreamingData(
        string[] calldata isrcs,
        uint256[] calldata spotifyStreams,
        uint256[] calldata appleMusicStreams
    ) external onlyAuthorized rateLimited {
        require(
            isrcs.length == spotifyStreams.length &&
            isrcs.length == appleMusicStreams.length,
            "Length mismatch"
        );
        require(isrcs.length <= 100, "Batch too large");

        for (uint256 i = 0; i < isrcs.length; i++) {
            if (bytes(isrcs[i]).length == 0) continue;
            if (spotifyStreams[i] == 0 && appleMusicStreams[i] == 0) continue;

            submissions[isrcs[i]].push(StreamingSubmission({
                spotifyStreams: spotifyStreams[i],
                appleMusicStreams: appleMusicStreams[i],
                timestamp: block.timestamp,
                submitter: msg.sender
            }));

            emit DataSubmitted(
                isrcs[i],
                spotifyStreams[i],
                appleMusicStreams[i],
                msg.sender
            );

            _aggregateStreams(isrcs[i]);
        }

        lastSubmissionTime[msg.sender] = block.timestamp;
    }

    /**
     * @notice Get aggregated streams for a song
     * @param isrc Song ISRC
     * @return Total aggregated streams
     */
    function getAggregatedStreams(
        string calldata isrc
    ) external view returns (uint256) {
        return aggregatedStreams[isrc];
    }

    /**
     * @notice Get submission history for a song
     * @param isrc Song ISRC
     * @return Array of submissions
     */
    function getSubmissionHistory(
        string calldata isrc
    ) external view returns (StreamingSubmission[] memory) {
        return submissions[isrc];
    }

    /**
     * @notice Authorize data provider
     * @param provider Provider address
     */
    function authorizeProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider");
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    /**
     * @notice Revoke data provider
     * @param provider Provider address
     */
    function revokeProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider);
    }

    /**
     * @dev Aggregate streams from multiple sources
     * For hackathon: Simple summation
     * Post-hackathon: Median or weighted average for multi-source validation
     */
    function _aggregateStreams(string calldata isrc) internal {
        StreamingSubmission[] storage subs = submissions[isrc];
        
        if (subs.length == 0) return;

        // Get most recent submission
        StreamingSubmission storage latest = subs[subs.length - 1];
        
        uint256 total = latest.spotifyStreams + latest.appleMusicStreams;
        aggregatedStreams[isrc] = total;

        emit StreamsAggregated(isrc, total);
    }

    /**
     * @notice Manual aggregation for multi-source validation
     * @param isrc Song ISRC
     * @param useMedian Whether to use median (true) or average (false)
     */
    function manualAggregation(
        string calldata isrc,
        bool useMedian
    ) external onlyOwner {
        StreamingSubmission[] storage subs = submissions[isrc];
        require(subs.length > 0, "No submissions");

        if (useMedian && subs.length >= 3) {
            // Calculate median from last 3 submissions
            uint256[] memory values = new uint256[](3);
            uint256 offset = subs.length >= 3 ? subs.length - 3 : 0;
            
            for (uint256 i = 0; i < 3 && offset + i < subs.length; i++) {
                values[i] = subs[offset + i].spotifyStreams + 
                           subs[offset + i].appleMusicStreams;
            }

            // Simple bubble sort
            for (uint256 i = 0; i < values.length; i++) {
                for (uint256 j = i + 1; j < values.length; j++) {
                    if (values[i] > values[j]) {
                        uint256 temp = values[i];
                        values[i] = values[j];
                        values[j] = temp;
                    }
                }
            }

            aggregatedStreams[isrc] = values[1];  // Median
        } else {
            // Use latest submission
            _aggregateStreams(isrc);
        }

        emit StreamsAggregated(isrc, aggregatedStreams[isrc]);
    }
}
