//SPDX-License-Identifier: Unlicense

import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

interface IMarket {
    event CollectionCreated(address indexed owner, uint256 collectionId);

    struct Token {
        uint256 tokenId;
        uint256 collectionId;
        address owner;
        bool forSale;
        uint256 price;
        Counters.Counter offersCount;
    }

    struct Offer {
        uint256 id;
        address payable offeror;
        uint256 price;
    }

    event TokenMinted(
        address indexed owner,
        uint256 indexed collectionId,
        uint256 tokenId,
        uint256 price
    );

    event TokenSold(
        address indexed seller,
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 collectionId,
        uint256 price
    );

    event OfferCreated(
        address indexed seller,
        address indexed offeror,
        uint256 indexed tokenId,
        uint256 offerId,
        uint256 price
    );

    event OfferAccepted(
        address indexed seller,
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 offerId,
        uint256 price
    );

    event TokenListedForSale(address indexed seller, uint256 indexed tokenId);

    struct Collection {
        uint256 id;
    }

    function fetchTokensBatch(uint256[] memory _tokenIds)
        external
        view
        returns (Token[] memory);

    function fetchTokenOffers(uint256 _tokenId)
        external
        view
        returns (Offer[] memory);

    function createCollection(uint256 _collectionId) external payable;

    function mintToken(uint256 _tokenId, uint256 _collectionId)
        external
        payable;

    function buyToken(uint256 _tokenId, uint256 _collectionId) external payable;

    function listTokenForSale(uint256 _tokenId) external;

    function makeOffer(uint256 _tokenId) external payable;

    function acceptOffer(uint256 _tokenId, uint256 _offerId) external;

    function withdraw() external;
}
