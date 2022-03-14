//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./IToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "hardhat/console.sol";

contract Market is ERC1155Receiver, ReentrancyGuard, Ownable, Utils {
    using Counters for Counters.Counter;

    address token;
    uint256 lockedAmount = 0;
    uint256 TOKEN_PRICE = 0.005 ether;

    mapping(uint256 => Collection) private collectionIdToCollection;
    mapping(address => uint256[]) private collectionsIdsByOwner;
    mapping(uint256 => uint256) private collectionIndexToId;
    mapping(address => bool) private ownerHasCollections;
    Counters.Counter private collectionsCount;

    mapping(uint256 => Token) private tokenIdToToken;
    mapping(uint256 => Offer[]) private tokenIdToOffers;
    mapping(address => Counters.Counter) private ownedTokensCountByOwner;
    uint256[] ownedTokensIds;
    Counters.Counter private tokensCount;

    event TokenListedForSale(address indexed seller, uint256 tokenId);

    event CollectionCreated(
        uint256 indexed collectionId,
        address indexed owner
    );

    event TokenMinted(
        uint256 indexed collectionId,
        uint256 indexed tokenId,
        uint256 price,
        address seller
    );

    event TokenSold(
        address indexed buyer,
        address indexed seller,
        uint256 collectionId,
        uint256 tokenId,
        uint256 price
    );

    event OfferCreated(
        address indexed offeror,
        address indexed seller,
        uint256 tokenId,
        uint256 price
    );

    event OfferAccepted(
        address indexed seller,
        address indexed buyer,
        uint256 tokenId,
        uint256 price
    );

    struct Offer {
        uint256 id;
        address payable offeror;
        uint256 price;
        bool exists;
    }

    struct Token {
        uint256 index;
        uint256 id;
        uint256 price;
        address payable seller;
        address owner;
        Counters.Counter offersCount;
        bool sold;
        bool exists;
    }

    struct Collection {
        uint256 index;
        uint256 id;
        address owner;
        Counters.Counter tokensCount;
        Counters.Counter tokensSold;
        uint256[] tokensIds;
        bool exists;
    }

    constructor(address _token) {
        token = _token;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    // Returns the data for the market collections and for the tokens of the other users
    // Sample result: [
    //  [
    //    <collection 1 info>, <collection 2 info>, <collection 3 info>, ...
    //  ],
    //  [
    //    [<collection 1 tokens>], [<collection 2 tokens>], [<collection 3 tokens>], ...
    //  ],
    //  [
    //    [
    //      <user 1 address>, [<user 1 tokens>]
    //    ],
    //    [
    //      <user 2 address>, [<user 2 tokens>]
    //    ],
    //    ...
    //  ]
    // ]
    function fetchMarketCollections()
        public
        view
        returns (
            Collection[] memory,
            Token[][] memory,
            Token[] memory
        )
    {
        // All the collections count
        uint256 allCollectionsCount = collectionsCount.current();

        // The collections count of the requesting user
        uint256 senderCollectionsCount = collectionsIdsByOwner[msg.sender].length;

        // All the collections count minus the requesting user collections count
        uint256 marketCollectionsCount = collectionsCount.current() - (ownerHasCollections[msg.sender] == true ? senderCollectionsCount : 0);

        // Initialize empty array for the collections data
        Collection[] memory collections = new Collection[](
            marketCollectionsCount
        );

        // Initialize empty array for the collections tokens data
        Token[][] memory collectionsTokens = new Token[][](
            marketCollectionsCount
        );

        uint256 currentCollectionIndex = 0;
        for (uint256 i = 0; i < allCollectionsCount; i++) {
            uint256 collectionId = collectionIndexToId[i];

            if (collectionIdToCollection[collectionId].owner != msg.sender) {
                // Adds the collection data to the results
                collections[currentCollectionIndex] = collectionIdToCollection[
                    collectionId
                ];

                // This is the actual tokens count for the current collection, i.e. minted tokens minus sold tokens
                uint256 currentCollectionTokensCount = collectionIdToCollection[collectionId]
                        .tokensCount
                        .current() -
                        collectionIdToCollection[collectionId]
                            .tokensSold
                            .current();

                // Initialize empty nested array for the tokens from the current collection
                collectionsTokens[currentCollectionIndex] = new Token[](
                    currentCollectionTokensCount
                );

                uint256 currentTokenIndex = 0;
                uint256 allTimeCollectionTokensCount = collections[currentCollectionIndex].tokensIds.length;

                // Iterates through all the existing tokens and takes these
                // which are part of the current collection
                for (uint256 k = 0; k < allTimeCollectionTokensCount; k++) {
                    uint256 tokenId = collections[currentCollectionIndex].tokensIds[k];
                    // Check if the token is part of the current collection
                    if (
                        tokenIdToToken[tokenId].seller ==
                        collections[currentCollectionIndex].owner &&
                        tokenIdToToken[tokenId].owner == address(0) &&
                        tokenIdToToken[tokenId].sold == false
                    ) {
                        // Add the token data to the results
                        collectionsTokens[currentCollectionIndex][
                            currentTokenIndex
                        ] = tokenIdToToken[tokenId];

                        currentTokenIndex++;
                    }
                }

                currentCollectionIndex++;
            }
        }

        uint256 currentTokenOwned = 0;
        uint256 ownedTokensCount = ownedTokensIds.length - ownedTokensCountByOwner[msg.sender].current();
        // This array will contain the token which is not part of a collection,
        // and not bought by the requesting user i.e. being bought by another user
        Token[] memory ownedTokens = new Token[](
            ownedTokensCount
        );

        for (uint256 i = 0; i < ownedTokensIds.length; i++) {
            // Check if the token is being sold and the requesting user doesn't own it
            if (
                tokenIdToToken[ownedTokensIds[i]].owner != msg.sender &&
                tokenIdToToken[ownedTokensIds[i]].seller != msg.sender &&
                tokenIdToToken[ownedTokensIds[i]].sold == true
            ) {
                ownedTokens[currentTokenOwned] = tokenIdToToken[
                    ownedTokensIds[i]
                ];

                currentTokenOwned++;
            }
        }

        return (collections, collectionsTokens, ownedTokens);
    }

    // Returns the collections and the collections tokens for the requesting user
    // along with the tokens bought from another user's collections
    function fetchOwnersCollections()
        public
        view
        returns (
            Collection[] memory,
            Token[][] memory,
            Token[] memory
        )
    {
        uint256 ownersCollectionsCount = collectionsIdsByOwner[msg.sender]
            .length;

        Collection[] memory collections = new Collection[](
            ownersCollectionsCount
        );

        Token[][] memory tokens = new Token[][](ownersCollectionsCount);

        for (uint256 i = 0; i < ownersCollectionsCount; i++) {
            uint256 collectionId = collectionsIdsByOwner[msg.sender][i];

            collections[i] = collectionIdToCollection[collectionId];

            tokens[i] = new Token[](
                collectionIdToCollection[collectionId].tokensCount.current() -
                    collectionIdToCollection[collectionId].tokensSold.current()
            );

            uint256 currentIndex = 0;
            uint256 collectionTokensCount = collections[i].tokensIds.length;

            for (uint256 k = 0; k < collectionTokensCount; k++) {
                uint256 tokenId = collections[i].tokensIds[k];
                if (
                    tokenIdToToken[tokenId].seller == collections[i].owner &&
                    tokenIdToToken[tokenId].sold == false
                ) {
                    tokens[i][currentIndex] = tokenIdToToken[tokenId];

                    currentIndex++;
                }
            }
        }

        Token[] memory ownedTokens = new Token[](
            ownedTokensCountByOwner[msg.sender].current()
        );

        uint256 currentTokenOwned = 0;
        for (uint256 i = 0; i < ownedTokensIds.length; i++) {
            if (
                (tokenIdToToken[ownedTokensIds[i]].owner == msg.sender ||
                    tokenIdToToken[ownedTokensIds[i]].seller == msg.sender) &&
                tokenIdToToken[ownedTokensIds[i]].sold == true
            ) {
                ownedTokens[currentTokenOwned] = tokenIdToToken[
                    ownedTokensIds[i]
                ];

                currentTokenOwned++;
            }
        }

        return (collections, tokens, ownedTokens);
    }

    function fetchTokenOffers(uint256 _tokenId)
        public
        view
        returns (Offer[] memory)
    {
        require(
            tokenIdToToken[_tokenId].exists == true,
            "Market: wrong token"
        );
        require(
            msg.sender == tokenIdToToken[_tokenId].seller,
            "Market: not a token owner"
        );
        return tokenIdToOffers[_tokenId];
    }

    function createCollection(uint256 _collectionId) public payable {
        require(
            collectionIdToCollection[_collectionId].exists == false,
            "Market: existing collection"
        );

        uint256[] memory emptyTokensIndexes;
        collectionIdToCollection[_collectionId] = Collection(
            collectionsCount.current(),
            _collectionId,
            msg.sender,
            Counters.Counter(0),
            Counters.Counter(0),
            emptyTokensIndexes,
            true
        );

        collectionsIdsByOwner[msg.sender].push(_collectionId);
        collectionIndexToId[collectionsCount.current()] = _collectionId;
        ownerHasCollections[msg.sender] = true;

        collectionsCount.increment();

        emit CollectionCreated(_collectionId, msg.sender);
    }

    function mintToken(uint256 _tokenId, uint256 _collectionId)
        public
        payable
        nonReentrant
    {
        require(
            collectionIdToCollection[_collectionId].exists == true,
            "Market: not existing collection"
        );

        tokenIdToToken[_tokenId] = Token(
            tokensCount.current(),
            _tokenId,
            TOKEN_PRICE,
            payable(msg.sender),
            address(0),
            Counters.Counter(0),
            false,
            true
        );

        // Mint the token
        IToken(token).mint(_tokenId, msg.sender);

        collectionIdToCollection[_collectionId].tokensCount.increment();
        collectionIdToCollection[_collectionId].tokensIds.push(_tokenId);

        tokensCount.increment();

        emit TokenMinted(_collectionId, _tokenId, TOKEN_PRICE, msg.sender);
    }

    function buyToken(uint256 _tokenId, uint256 _collectionId)
        public
        payable
        nonReentrant
    {
        require(
            tokenIdToToken[_tokenId].exists == true,
            "Market: not existing token"
        );
        require(
            tokenIdToToken[_tokenId].seller != address(0),
            "Market: token sold"
        );
        require(
            tokenIdToToken[_tokenId].owner == address(0),
            "Market: token not for sale"
        );
        require(
            tokenIdToToken[_tokenId].seller != msg.sender,
            "Market: you own the token"
        );
        require(
            msg.value == tokenIdToToken[_tokenId].price,
            "Market: amount not correct"
        );

        IToken(token).transferFrom(
            tokenIdToToken[_tokenId].seller,
            msg.sender,
            _tokenId
        );

        tokenIdToToken[_tokenId].seller.transfer(msg.value);
        tokenIdToToken[_tokenId].owner = msg.sender;
        // The price is set to 0 just once when the token is sold
        tokenIdToToken[_tokenId].price = 0;
        // The sold flag set to true just once when the token is sold
        tokenIdToToken[_tokenId].sold = true;
        tokenIdToToken[_tokenId].seller = payable(address(0));

        // Store the tokens ids being sold, so we can use them when fetch the market data
        ownedTokensIds.push(_tokenId);

        collectionIdToCollection[_collectionId].tokensSold.increment();
        ownedTokensCountByOwner[msg.sender].increment();

        emit TokenSold(
            msg.sender,
            tokenIdToToken[_tokenId].seller,
            _collectionId,
            _tokenId,
            msg.value
        );
    }

    function listTokenForSale(uint256 _tokenId) public nonReentrant {
        require(
            tokenIdToToken[_tokenId].seller == address(0),
            "Market: token already for sale"
        );
        require(
            tokenIdToToken[_tokenId].exists == true,
            "Market: not existing token"
        );
        require(
            tokenIdToToken[_tokenId].owner == msg.sender,
            "Market: you are not the owner"
        );

        tokenIdToToken[_tokenId].seller = payable(msg.sender);
        tokenIdToToken[_tokenId].owner = address(0);

        // Lock the token so it can't be transferred while it is for ongoing sale
        IToken(token).lock(_tokenId);

        emit TokenListedForSale(msg.sender, _tokenId);
    }

    // Makes an offer for a token for sale
    function makeOffer(uint256 _tokenId) public payable {
        require(
            tokenIdToToken[_tokenId].exists == true,
            "Market: not existing token"
        );
        require(
            tokenIdToToken[_tokenId].seller != address(0),
            "Market: token not for sale"
        );
        require(
            tokenIdToToken[_tokenId].owner == address(0),
            "Market: token not for sale"
        );
        require(msg.value > 0, "Market: offer price must be at least one wei");

        tokenIdToOffers[_tokenId].push(
            Offer(tokenIdToToken[_tokenId].offersCount.current(), payable(msg.sender), msg.value, true)
        );

        tokenIdToToken[_tokenId].offersCount.increment();

        // Locks an ether so it can't be withdrawn from
        // the contract during a token sale
        lockedAmount += msg.value;

        emit OfferCreated(
            msg.sender,
            tokenIdToToken[_tokenId].seller,
            _tokenId,
            msg.value
        );
    }

    // The user accepts an another user offer for the token being listed for a sale
    function acceptOffer(uint256 _tokenId, uint256 _offerId)
        public
        nonReentrant
    {
        require(
            tokenIdToToken[_tokenId].exists == true,
            "Market: not existing token"
        );
        require(
            tokenIdToToken[_tokenId].owner == address(0),
            "Market: token sold"
        );
        require(
            tokenIdToToken[_tokenId].seller == msg.sender,
            "Market: not a token owner"
        );
        require(
            tokenIdToOffers[_tokenId][_offerId].exists == true,
            "Market: not existing offer"
        );

        address oferror = tokenIdToOffers[_tokenId][_offerId].offeror;
        uint256 price = tokenIdToOffers[_tokenId][_offerId].price;

        // Unlocks the token before the transfer
        IToken(token).unlock(_tokenId);

        // Transfers the token to the buyer
        IToken(token).transferFrom(msg.sender, oferror, _tokenId);

        lockedAmount -= tokenIdToOffers[_tokenId][_offerId].price;

        // Transfers the offerror's price to the seller
        payable(msg.sender).transfer(tokenIdToOffers[_tokenId][_offerId].price);

        ownedTokensCountByOwner[oferror].increment();
        ownedTokensCountByOwner[msg.sender].decrement();

        tokenIdToToken[_tokenId].owner = oferror;
        tokenIdToToken[_tokenId].seller = payable(address(0));

        // Returns the eth amount to the other users who had
        // a locked amount by making an offer but didn't get the token
        for (
            uint256 i = 0;
            i < tokenIdToToken[_tokenId].offersCount.current();
            i++
        ) {
            if (i != _offerId) {
                lockedAmount -= tokenIdToOffers[_tokenId][i].price;
                tokenIdToOffers[_tokenId][i].offeror.transfer(
                    tokenIdToOffers[_tokenId][i].price
                );
            }
        }

        delete tokenIdToOffers[_tokenId];
        tokenIdToToken[_tokenId].offersCount.reset();

        emit OfferAccepted(msg.sender, oferror, _tokenId, price);
    }

    // Could be used if there is some market listing tokens price, i.e. the fee for the market
    function withdraw() external onlyOwner {
        require(
            address(this).balance - lockedAmount > 0,
            "Market: nothing to withdraw"
        );

        payable(owner()).transfer(address(this).balance - lockedAmount);
    }

    function uri(uint256 _id) public pure returns (string memory) {
        string memory hexstringId = uint2hex64str(_id, 64);
        return
            string(
                abi.encodePacked("https://ipfs.io/ipfs/f01551220", hexstringId)
            );
    }
}
