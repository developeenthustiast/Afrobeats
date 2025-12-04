// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AfroBeatsRoyalty
 * @dev Manages music IP assets and royalty distribution.
 * Integrates with Camp Network for identity verification.
 */
contract AfroBeatsRoyalty is ERC1155, Ownable {
    using Strings for uint256;

    struct Track {
        string isrc;
        string metadataURI;
        address artist;
        uint256 totalRevenue;
        bool isVerified;
    }

    mapping(uint256 => Track) public tracks;
    mapping(address => string) public artistSpotifyIds; // Linked via Camp SDK
    uint256 public nextTrackId;

    event TrackRegistered(uint256 indexed trackId, address indexed artist, string isrc);
    event RoyaltyDistributed(uint256 indexed trackId, uint256 amount);
    event ArtistVerified(address indexed artist, string spotifyId);

    constructor() ERC1155("") Ownable(msg.sender) {}

    /**
     * @dev Registers a new track as an IP asset.
     * @param isrc International Standard Recording Code
     * @param metadataURI IPFS URI for track metadata
     */
    function registerTrack(string memory isrc, string memory metadataURI) external {
        uint256 trackId = nextTrackId++;
        
        tracks[trackId] = Track({
            isrc: isrc,
            metadataURI: metadataURI,
            artist: msg.sender,
            totalRevenue: 0,
            isVerified: bytes(artistSpotifyIds[msg.sender]).length > 0
        });

        _mint(msg.sender, trackId, 1, ""); // Mint the IP NFT
        emit TrackRegistered(trackId, msg.sender, isrc);
    }

    /**
     * @dev Links a Spotify ID to an address.
     * In production, this would be called by the Camp Oracle or signed via Auth Hub.
     */
    function verifyArtist(address artist, string memory spotifyId) external onlyOwner {
        artistSpotifyIds[artist] = spotifyId;
        emit ArtistVerified(artist, spotifyId);
    }

    /**
     * @dev Distributes royalties to the track owner.
     */
    function distributeRoyalty(uint256 trackId) external payable {
        require(msg.value > 0, "No royalty to distribute");
        address owner = tracks[trackId].artist; // Simplified: In ERC1155, check balance
        
        // In a real scenario, we'd split between token holders
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");

        tracks[trackId].totalRevenue += msg.value;
        emit RoyaltyDistributed(trackId, msg.value);
    }

    function uri(uint256 trackId) public view override returns (string memory) {
        return tracks[trackId].metadataURI;
    }
}
