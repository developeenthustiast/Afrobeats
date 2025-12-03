// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

/**
 * @title ERC6551Account
 * @author AfroBeats Royalty Protocol Team
 * @notice Token Bound Account implementation for song IP-NFTs
 * @dev Minimal proxy implementation following ERC-6551 standard
 */
contract ERC6551Account is IERC165, IERC1271 {
    using SafeERC20 for IERC20;

    /// @notice ERC-1271 magic value for valid signature
    bytes4 constant internal MAGICVALUE = 0x1626ba7e;

    /// @notice Events
    event TransactionExecuted(address indexed to, uint256 value, bytes data);
    event TokensReceived(address indexed token, address indexed from, uint256 amount);

    /// @notice Errors
    error NotAuthorized();
    error InvalidOperation();
    error ExecutionFailed();

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        emit TokensReceived(address(0), msg.sender, msg.value);
    }

    /**
     * @notice Execute a call from this account
     * @param to Target address
     * @param value ETH value to send
     * @param data Call data
     * @return result Return data from the call
     */
    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(_isValidSigner(msg.sender), "Not authorized");
        require(to != address(0), "Invalid target");

        bool success;
        (success, result) = to.call{value: value}(data);
        
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }

        emit TransactionExecuted(to, value, data);
    }

    /**
     * @notice Get the token that owns this account
     * @return chainId Chain ID
     * @return tokenContract Token contract address
     * @return tokenId Token ID
     */
    function token() public view returns (uint256, address, uint256) {
        bytes memory footer = new bytes(0x60);
        assembly {
            extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
        }

        return abi.decode(footer, (uint256, address, uint256));
    }

    /**
     * @notice Get the owner of this account
     * @return Owner address
     */
    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = token();
        
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    /**
     * @notice Check if account supports an interface
     * @param interfaceId Interface ID
     * @return True if supported
     */
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
                interfaceId == type(IERC1271).interfaceId);
    }

    /**
     * @notice Validate signature (ERC-1271)
     * @param hash Message hash
     * @param signature Signature bytes
     * @return Magic value if valid
     */
    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) external view returns (bytes4) {
        bool isValid = SignatureChecker.isValidSignatureNow(
            owner(),
            hash,
            signature
        );

        if (isValid) {
            return MAGICVALUE;
        }

        return bytes4(0);
    }

    /**
     * @notice Get current nonce (for replay protection)
     * @return Current nonce
     */
    function nonce() external view returns (uint256) {
        return uint256(blockhash(block.number - 1));
    }

    /**
     * @dev Check if address is valid signer
     */
    function _isValidSigner(address signer) internal view returns (bool) {
        return signer == owner();
    }
}

/**
 * @title ERC6551Registry
 * @notice Registry for creating Token Bound Accounts
 */
contract ERC6551Registry {
    /// @notice Events
    event AccountCreated(
        address indexed account,
        address indexed implementation,
        uint256 chainId,
        address indexed tokenContract,
        uint256 tokenId,
        uint256 salt
    );

    /**
     * @notice Create a Token Bound Account
     * @param implementation Account implementation address
     * @param chainId Chain ID
     * @param tokenContract Token contract address
     * @param tokenId Token ID
     * @param salt Salt for deterministic address
     * @param initData Init data for account
     * @return account Created account address
     */
    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external returns (address account) {
        assembly {
            // Copy the bytecode
            let ptr := mload(0x40)
            
            // 0x3d602d80600a3d3981f3 - ERC-1167 minimal proxy
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(0x60, implementation))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            
            // Append immutable data
            mstore(add(ptr, 0x38), shl(0x60, salt))
            mstore(add(ptr, 0x4c), chainId)
            mstore(add(ptr, 0x6c), shl(0x60, tokenContract))
            mstore(add(ptr, 0x80), tokenId)
            
            account := create2(0, ptr, 0xa0, salt)
        }

        if (account == address(0)) revert("Account creation failed");

        emit AccountCreated(
            account,
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        if (initData.length > 0) {
            (bool success, ) = account.call(initData);
            require(success, "Initialization failed");
        }
    }

    /**
     * @notice Compute account address
     * @param implementation Account implementation address
     * @param chainId Chain ID
     * @param tokenContract Token contract address
     * @param tokenId Token ID
     * @param salt Salt for deterministic address
     * @return Predicted account address
     */
    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address) {
        bytes memory code;
        
        assembly {
            code := mload(0x40)
            mstore(code, 0xa0)
            
            mstore(add(code, 0x20), 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(code, 0x34), shl(0x60, implementation))
            mstore(add(code, 0x48), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            mstore(add(code, 0x58), shl(0x60, salt))
            mstore(add(code, 0x6c), chainId)
            mstore(add(code, 0x8c), shl(0x60, tokenContract))
            mstore(add(code, 0xa0), tokenId)
        }

        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(code)
            )
        );

        return address(uint160(uint256(hash)));
    }
}
