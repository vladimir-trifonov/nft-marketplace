//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./IToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract Market is ERC1155Receiver, ReentrancyGuard, Ownable, Utils {
    using Counters for Counters.Counter;

    address token;
    uint256 lockedAmount = 0;
    uint256 TOKEN_PRICE = 0.005 ether;

    mapping(uint256 => Collection) private collectionIdToCollection;
    mapping(address => uint256[]) private collectionsIdsByOwner;
    mapping(uint256 => uint256) private collectionIndexToId;
    mapping(address => bool) private ownerHasCollections;
    mapping(address => Counters.Counter) private ownedTokensCountByOwner;
    mapping(uint256 => Token) private tokenIdToToken;
    mapping(uint256 => Offer[]) private tokenIdToOffers;
    Counters.Counter private tokensCount;
    Counters.Counter private collectionsCount;
    uint256[] ownedTokensIds;

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

    function fetchMarketCollections()
        public
        view
        returns (
            Collection[] memory,
            Token[][] memory,
            Token[] memory
        )
    {
        uint256 allCollectionsCount = collectionsCount.current();
        uint256 marketCollectionsCount = collectionsCount.current();
        if (ownerHasCollections[msg.sender] == true) {
            marketCollectionsCount -= collectionsIdsByOwner[msg.sender].length;
        }
        Collection[] memory collections = new Collection[](
            marketCollectionsCount
        );
        Token[][] memory collectionsTokens = new Token[][](
            marketCollectionsCount
        );

        uint256 currentCollectionIndex = 0;
        for (uint256 i = 0; i < allCollectionsCount; i++) {
            uint256 collectionId = collectionIndexToId[i + 1];
            if (collectionIdToCollection[collectionId].owner != msg.sender) {
                collections[currentCollectionIndex] = collectionIdToCollection[
                    collectionId
                ];

                collectionsTokens[currentCollectionIndex] = new Token[](
                    collectionIdToCollection[collectionId]
                        .tokensCount
                        .current() -
                        collectionIdToCollection[collectionId]
                            .tokensSold
                            .current()
                );
                uint256 currentTokenIndex = 0;
                uint256 collectionTokensCount = collections[i].tokensIds.length;

                for (uint256 k = 0; k < collectionTokensCount; k++) {
                    uint256 tokenId = collections[i].tokensIds[k];
                    if (
                        tokenIdToToken[tokenId].seller ==
                        collections[i].owner &&
                        tokenIdToToken[tokenId].owner == address(0)
                    ) {
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
        Token[] memory ownedTokens = new Token[](
            ownedTokensIds.length -
                ownedTokensCountByOwner[msg.sender].current()
        );
        for (uint256 i = 0; i < ownedTokensIds.length; i++) {
            if (
                tokenIdToToken[ownedTokensIds[i]].owner != msg.sender &&
                tokenIdToToken[ownedTokensIds[i]].seller != msg.sender
            ) {
                ownedTokens[currentTokenOwned] = tokenIdToToken[
                    ownedTokensIds[i]
                ];
                currentTokenOwned++;
            }
        }
        return (collections, collectionsTokens, ownedTokens);
    }

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
                if (tokenIdToToken[tokenId].seller == collections[i].owner) {
                    tokens[i][currentIndex] = tokenIdToToken[tokenId];
                    currentIndex++;
                }
            }
        }
        uint256 currentTokenOwned = 0;
        Token[] memory ownedTokens = new Token[](
            ownedTokensCountByOwner[msg.sender].current()
        );
        for (uint256 i = 0; i < ownedTokensIds.length; i++) {
            if (
                tokenIdToToken[ownedTokensIds[i]].owner == msg.sender ||
                tokenIdToToken[ownedTokensIds[i]].seller == msg.sender
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
        return tokenIdToOffers[_tokenId];
    }

    function createCollection(uint256 _collectionId) public payable {
        require(
            collectionIdToCollection[_collectionId].exists == false,
            "Existing collection"
        );

        uint256[] memory emptyTokensIndexes;
        collectionsCount.increment();
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

        emit CollectionCreated(_collectionId, msg.sender);
    }

    function mintToken(uint256 _tokenId, uint256 _collectionId)
        public
        payable
        nonReentrant
    {
        require(
            collectionIdToCollection[_collectionId].exists == true,
            "Not existing collection"
        );

        IToken(token).mint(_tokenId, msg.sender);

        tokensCount.increment();
        tokenIdToToken[_tokenId] = Token(
            tokensCount.current(),
            _tokenId,
            TOKEN_PRICE,
            payable(msg.sender),
            address(0),
            Counters.Counter(0),
            true
        );
        collectionIdToCollection[_collectionId].tokensCount.increment();
        collectionIdToCollection[_collectionId].tokensIds.push(_tokenId);

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
        collectionIdToCollection[_collectionId].tokensSold.increment();
        ownedTokensIds.push(_tokenId);
        tokenIdToToken[_tokenId].owner = msg.sender;
        tokenIdToToken[_tokenId].price = 0;
        tokenIdToToken[_tokenId].seller = payable(address(0));
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

        IToken(token).lock(_tokenId);

        emit TokenListedForSale(msg.sender, _tokenId);
    }

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
            Offer(payable(msg.sender), msg.value, true)
        );
        tokenIdToToken[_tokenId].offersCount.increment();

        lockedAmount += msg.value;

        emit OfferCreated(
            msg.sender,
            tokenIdToToken[_tokenId].seller,
            _tokenId,
            msg.value
        );
    }

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

        IToken(token).unlock(_tokenId);

        IToken(token).transferFrom(msg.sender, oferror, _tokenId);

        lockedAmount -= tokenIdToOffers[_tokenId][_offerId].price;
        payable(msg.sender).transfer(tokenIdToOffers[_tokenId][_offerId].price);
        tokenIdToToken[_tokenId].owner = oferror;
        tokenIdToToken[_tokenId].seller = payable(address(0));

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

    function withdraw() external onlyOwner {
        require(
            address(this).balance - lockedAmount > 0,
            "Market: nothing to withdraw"
        );
        payable(owner()).transfer(address(this).balance - lockedAmount);
    }

    function uri(uint256 _Id) public pure returns (string memory) {
        string memory hexstringId = uint2hexstr(_Id);
        return
            string(
                abi.encodePacked("https://ipfs.io/ipfs/f01551220", hexstringId)
            );
    }
}
