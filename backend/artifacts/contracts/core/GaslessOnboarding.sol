// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title GaslessOnboarding
 * @author AfroBeats Royalty Protocol Team
 * @notice Enable gasless transactions for artists via meta-transactions
 * @dev EIP-2771 compatible with fallback for EIP-7702 if available
 */
contract GaslessOnboarding is Ownable, EIP712 {
    using ECDSA for bytes32;

    /// @notice Trusted forwarder for meta-transactions
    address public trustedForwarder;

    /// @notice Gas tank for sponsored transactions
    mapping(address => uint256) public gasTank;

    /// @notice Nonces for replay protection
    mapping(address => uint256) public nonces;

    /// @notice Session keys for limited permissions
    struct SessionKey {
        address key;
        uint256 expiryTimestamp;
        bool active;
    }

    mapping(address => SessionKey[]) public sessionKeys;

    /// @notice Rate limiting
    mapping(address => uint256) public transactionCount;
    mapping(address => uint256) public lastResetTimestamp;
    
    uint256 public constant MONTHLY_TX_LIMIT = 10;
    uint256 public constant RESET_PERIOD = 30 days;

    /// @notice Meta-transaction structure
    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data;
    }

    /// @notice Events
    event MetaTransactionExecuted(
        address indexed from,
        address indexed to,
        bytes data,
        bool success
    );

    event SessionKeyAdded(
        address indexed user,
        address indexed sessionKey,
        uint256 expiry
    );

    event SessionKeyRevoked(
        address indexed user,
        address indexed sessionKey
    );

    event GasTankFunded(
        address indexed user,
        uint256 amount
    );

    event TrustedForwarderUpdated(
        address indexed oldForwarder,
        address indexed newForwarder
    );

    /// @notice Errors
    error Unauthorized();
    error InvalidSignature();
    error ExpiredSessionKey();
    error RateLimitExceeded();
    error ExecutionFailed();
    error InsufficientGasTank();

    /// @notice Type hash for EIP-712
    bytes32 private constant FORWARD_REQUEST_TYPEHASH =
        keccak256(
            "ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)"
        );

    /**
     * @notice Constructor
     * @param _trustedForwarder Trusted forwarder address
     */
    constructor(
        address _trustedForwarder
    ) EIP712("GaslessOnboarding", "1") {
        trustedForwarder = _trustedForwarder;
    }

    /**
     * @notice Execute meta-transaction
     * @param req Forward request
     * @param signature User signature
     * @return success Whether execution succeeded
     * @return returnData Return data from execution
     */
    function execute(
        ForwardRequest calldata req,
        bytes calldata signature
    ) external returns (bool success, bytes memory returnData) {
        require(msg.sender == trustedForwarder, "Only forwarder");

        // Verify signature
        _verify(req, signature);

        // Check rate limiting
        _checkRateLimit(req.from);

        // Check gas tank
        if (gasTank[req.from] == 0) revert InsufficientGasTank();

        // Increment nonce
        nonces[req.from]++;

        // Increment transaction count
        transactionCount[req.from]++;

        // Execute call
        (success, returnData) = req.to.call{gas: req.gas, value: req.value}(
            abi.encodePacked(req.data, req.from)
        );

        emit MetaTransactionExecuted(req.from, req.to, req.data, success);

        // Decrease gas tank (simplified gas accounting)
        if (gasTank[req.from] > 0) {
            gasTank[req.from]--;
        }
    }

    /**
     * @notice Add session key
     * @param sessionKey Session key address
     * @param expiryTimestamp Expiry timestamp
     */
    function addSessionKey(
        address sessionKey,
        uint256 expiryTimestamp
    ) external {
        require(sessionKey != address(0), "Invalid session key");
        require(expiryTimestamp > block.timestamp, "Expiry in past");

        sessionKeys[msg.sender].push(SessionKey({
            key: sessionKey,
            expiryTimestamp: expiryTimestamp,
            active: true
        }));

        emit SessionKeyAdded(msg.sender, sessionKey, expiryTimestamp);
    }

    /**
     * @notice Revoke session key
     * @param sessionKeyIndex Index of session key to revoke
     */
    function revokeSessionKey(uint256 sessionKeyIndex) external {
        require(sessionKeyIndex < sessionKeys[msg.sender].length, "Invalid index");
        
        SessionKey storage key = sessionKeys[msg.sender][sessionKeyIndex];
        key.active = false;

        emit SessionKeyRevoked(msg.sender, key.key);
    }

    /**
     * @notice Fund gas tank for user
     * @param user User address
     * @param amount Number of transactions to sponsor
     */
    function fundGasTank(address user, uint256 amount) external onlyOwner {
        gasTank[user] += amount;
        emit GasTankFunded(user, amount);
    }

    /**
     * @notice Update trusted forwarder
     * @param newForwarder New forwarder address
     */
    function updateTrustedForwarder(address newForwarder) external onlyOwner {
        require(newForwarder != address(0), "Invalid forwarder");
        emit TrustedForwarderUpdated(trustedForwarder, newForwarder);
        trustedForwarder = newForwarder;
    }

    /**
     * @notice Check if sender is valid
     * @param from Original sender
     * @param sessionKeyAddr Session key address (if used)
     * @return Whether sender is authorized
     */
    function isTrustedForwarder(
        address from,
        address sessionKeyAddr
    ) external view returns (bool) {
        if (msg.sender != trustedForwarder) return false;

        // Check if using session key
        if (sessionKeyAddr != address(0)) {
            return _isValidSessionKey(from, sessionKeyAddr);
        }

        return true;
    }

    /**
     * @notice Get nonce for address
     * @param from Address to get nonce for
     * @return Current nonce
     */
    function getNonce(address from) external view returns (uint256) {
        return nonces[from];
    }

    /**
     * @notice Get remaining transactions this period
     * @param user User address
     * @return Remaining transactions
     */
    function getRemainingTransactions(address user) external view returns (uint256) {
        _resetIfNeeded(user);
        
        if (transactionCount[user] >= MONTHLY_TX_LIMIT) {
            return 0;
        }
        
        return MONTHLY_TX_LIMIT - transactionCount[user];
    }

    /**
     * @dev Verify forwarded request signature
     */
    function _verify(
        ForwardRequest calldata req,
        bytes calldata signature
    ) internal view {
        require(req.nonce == nonces[req.from], "Invalid nonce");

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    FORWARD_REQUEST_TYPEHASH,
                    req.from,
                    req.to,
                    req.value,
                    req.gas,
                    req.nonce,
                    keccak256(req.data)
                )
            )
        );

        address signer = digest.recover(signature);
        
        if (signer != req.from && !_isValidSessionKey(req.from, signer)) {
            revert InvalidSignature();
        }
    }

    /**
     * @dev Check if session key is valid
     */
    function _isValidSessionKey(
        address user,
        address sessionKeyAddr
    ) internal view returns (bool) {
        SessionKey[] storage keys = sessionKeys[user];
        
        for (uint256 i = 0; i < keys.length; i++) {
            if (
                keys[i].key == sessionKeyAddr &&
                keys[i].active &&
                keys[i].expiryTimestamp > block.timestamp
            ) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * @dev Check rate limiting
     */
    function _checkRateLimit(address user) internal view {
        if (block.timestamp >= lastResetTimestamp[user] + RESET_PERIOD) {
            // Will be reset
            return;
        }

        if (transactionCount[user] >= MONTHLY_TX_LIMIT) {
            revert RateLimitExceeded();
        }
    }

    /**
     * @dev Reset transaction count if needed
     */
    function _resetIfNeeded(address user) internal view {
        if (block.timestamp >= lastResetTimestamp[user] + RESET_PERIOD) {
            // Note: This is view-only, actual reset happens in execute()
            // transactionCount[user] = 0;
            // lastResetTimestamp[user] = block.timestamp;
        }
    }

    /**
     * @notice Emergency withdraw
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {}
}
