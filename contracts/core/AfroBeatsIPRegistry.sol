// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/**
 * @title AfroBeatsIPRegistry
 * @author AfroBeats Royalty Protocol Team
 * @notice Core IP registration and NFT minting for songs
 * @dev ERC-721 compliant with UUPS upgradeability
 */
contract AfroBeatsIPRegistry is 
    ERC721Upgradeable,
    OwnableUpgradeable, 
    PausableUpgradeable,
    UUPSUpgradeable 
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @notice Token ID counter
    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @notice Song metadata structure
    struct SongMetadata {
        string title;
        string[] artists;
        string isrc;  // International Standard Recording Code
        string[] genres;
        bytes32 audioFingerprintHash;  // Hash of audio fingerprint from AI agent
        string ipfsURI;  // IPFS URI for full metadata and audio
        uint256 registrationTimestamp;
        bool isDisputed;
    }

    /// @notice Royalty beneficiary structure
    struct RoyaltyBeneficiary {
        address payee;
        uint16 percentage;  // Basis points (100 = 1%)
    }

    /// @notice Mapping from token ID to song metadata
    mapping(uint256 => SongMetadata) public songMetadata;

    /// @notice Mapping from token ID to royalty beneficiaries
    mapping(uint256 => RoyaltyBeneficiary[]) public royaltyBeneficiaries;

    /// @notice Mapping from audio fingerprint hash to token ID (plagiarism detection)
    mapping(bytes32 => uint256) public fingerprintToTokenId;

    /// @notice Mapping from token ID to Token Bound Account address
    mapping(uint256 => address) public tokenBoundAccounts;

    /// @notice Origin SDK provenance certificate registry
    mapping(uint256 => bytes32) public provenanceCertificates;

    /// @notice Events
    event SongRegistered(
        uint256 indexed tokenId,
        address indexed owner,
        string title,
        bytes32 audioFingerprintHash,
        string ipfsURI
    );

    event RoyaltySplitConfigured(
        uint256 indexed tokenId,
        RoyaltyBeneficiary[] beneficiaries
    );

    event DisputeFlagged(
        uint256 indexed tokenId,
        bytes32 audioFingerprintHash,
        string reason
    );

    event TokenBoundAccountLinked(
        uint256 indexed tokenId,
        address tbaAddress
    );

    event ProvenanceCertificateIssued(
        uint256 indexed tokenId,
        bytes32 certificateHash
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the contract
     * @param _name Token name
     * @param _symbol Token symbol
     */
    function initialize(
        string memory _name,
        string memory _symbol
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __Ownable_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @notice Register a new song and mint IP-NFT
     * @param to Recipient address
     * @param metadata Song metadata
     * @param beneficiaries Royalty split configuration
     * @return tokenId The minted token ID
     */
    function registerSong(
        address to,
        SongMetadata calldata metadata,
        RoyaltyBeneficiary[] calldata beneficiaries
    ) external whenNotPaused returns (uint256) {
        require(bytes(metadata.title).length > 0, "Title required");
        require(metadata.artists.length > 0, "At least one artist required");
        require(bytes(metadata.ipfsURI).length > 0, "IPFS URI required");
        require(metadata.audioFingerprintHash != bytes32(0), "Fingerprint required");
        
        // Check for duplicate fingerprint (plagiarism)
        require(
            fingerprintToTokenId[metadata.audioFingerprintHash] == 0,
            "Duplicate audio fingerprint detected"
        );

        // Validate royalty split totals 100%
        _validateRoyaltySplit(beneficiaries);

        // Mint NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        // Store metadata
        songMetadata[tokenId] = SongMetadata({
            title: metadata.title,
            artists: metadata.artists,
            isrc: metadata.isrc,
            genres: metadata.genres,
            audioFingerprintHash: metadata.audioFingerprintHash,
            ipfsURI: metadata.ipfsURI,
            registrationTimestamp: block.timestamp,
            isDisputed: false
        });

        // Store royalty beneficiaries
        for (uint i = 0; i < beneficiaries.length; i++) {
            royaltyBeneficiaries[tokenId].push(beneficiaries[i]);
        }

        // Map fingerprint to token ID
        fingerprintToTokenId[metadata.audioFingerprintHash] = tokenId;

        emit SongRegistered(
            tokenId,
            to,
            metadata.title,
            metadata.audioFingerprintHash,
            metadata.ipfsURI
        );

        emit RoyaltySplitConfigured(tokenId, beneficiaries);

        return tokenId;
    }

    /**
     * @notice Link Token Bound Account to NFT
     * @param tokenId Token ID
     * @param tbaAddress Token Bound Account address
     */
    function linkTokenBoundAccount(
        uint256 tokenId,
        address tbaAddress
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(tbaAddress != address(0), "Invalid TBA address");

        tokenBoundAccounts[tokenId] = tbaAddress;

        emit TokenBoundAccountLinked(tokenId, tbaAddress);
    }

    /**
     * @notice Issue Origin SDK provenance certificate
     * @param tokenId Token ID
     * @param certificateHash Hash of provenance certificate
     */
    function issueProvenanceCertificate(
        uint256 tokenId,
        bytes32 certificateHash
    ) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(certificateHash != bytes32(0), "Invalid certificate hash");

        provenanceCertificates[tokenId] = certificateHash;

        emit ProvenanceCertificateIssued(tokenId, certificateHash);
    }

    /**
     * @notice Flag song as disputed
     * @param tokenId Token ID
     * @param reason Dispute reason
     */
    function flagDispute(
        uint256 tokenId,
        string calldata reason
    ) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");

        songMetadata[tokenId].isDisputed = true;

        emit DisputeFlagged(
            tokenId,
            songMetadata[tokenId].audioFingerprintHash,
            reason
        );
    }

    /**
     * @notice Get royalty beneficiaries for a token
     * @param tokenId Token ID
     * @return Array of beneficiaries
     */
    function getRoyaltyBeneficiaries(
        uint256 tokenId
    ) external view returns (RoyaltyBeneficiary[] memory) {
        return royaltyBeneficiaries[tokenId];
    }

    /**
     * @notice Get song metadata
     * @param tokenId Token ID
     * @return Song metadata struct
     */
    function getSongMetadata(
        uint256 tokenId
    ) external view returns (SongMetadata memory) {
        return songMetadata[tokenId];
    }

    /**
     * @notice Check if fingerprint exists (plagiarism check)
     * @param fingerprintHash Audio fingerprint hash
     * @return tokenId Token ID if exists, 0 otherwise
     */
    function checkFingerprint(
        bytes32 fingerprintHash
    ) external view returns (uint256) {
        return fingerprintToTokenId[fingerprintHash];
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

    /**
     * @dev Validate royalty split totals 100%
     */
    function _validateRoyaltySplit(
        RoyaltyBeneficiary[] calldata beneficiaries
    ) internal pure {
        require(beneficiaries.length > 0, "At least one beneficiary required");
        
        uint256 totalPercentage = 0;
        for (uint i = 0; i < beneficiaries.length; i++) {
            require(beneficiaries[i].payee != address(0), "Invalid beneficiary address");
            require(beneficiaries[i].percentage > 0, "Percentage must be > 0");
            totalPercentage += beneficiaries[i].percentage;
        }

        require(totalPercentage == 10000, "Total must equal 100% (10000 basis points)");
    }

    /**
     * @dev Required override for UUPS
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
