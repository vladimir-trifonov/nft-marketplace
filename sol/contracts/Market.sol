//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./INFT.sol";
import "./ICollecion.sol";
import "./IMarket.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Market is ReentrancyGuard, Ownable, Utils, IMarket, ERC1155Holder {
    using Counters for Counters.Counter;

    address collection;
    address token;
    uint256 lockedAmount = 0;
    uint256 TOKEN_PRICE = 0.005 ether;

    mapping(uint256 => Token) private tokenIdToToken;
    mapping(uint256 => Offer[]) private tokenIdToOffers;

    constructor(address _collection, address _token) {
        collection = _collection;
        token = _token;
    }

    function fetchTokensBatch(uint256[] memory _tokenIds) public view virtual override returns (Token[] memory) {
        uint256 tokensCount = _tokenIds.length;

        if (tokensCount == 0) return new Token[](0);

        Token[] memory tokens = new Token[](tokensCount);

        for (uint256 i = 0; i < tokensCount; i++) {
            tokens[i] = tokenIdToToken[_tokenIds[i]];
        }

        return tokens;
    }

    function fetchTokenOffers(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (Offer[] memory)
    {
        return tokenIdToOffers[_tokenId];
    }

    function createCollection(uint256 _collectionId)
        public
        payable
        virtual
        override
        nonReentrant
    {
        ICollecion(collection).mint(msg.sender, _collectionId);

        emit CollectionCreated(msg.sender, _collectionId);
    }

    function mintToken(uint256 _tokenId, uint256 _collectionId)
        public
        payable
        virtual
        override
        nonReentrant
    {
        require(
            ICollecion(collection).isCreator(_collectionId, msg.sender),
            "Marketplace: not a collection owner"
        );

        INFT(token).mint(msg.sender, _tokenId);

        tokenIdToToken[_tokenId] = Token(
            _tokenId,
            _collectionId,
            msg.sender,
            true,
            TOKEN_PRICE,
            Counters.Counter(0)
        );

        emit TokenMinted(msg.sender, _collectionId, _tokenId, TOKEN_PRICE);
    }

    function buyToken(uint256 _tokenId, uint256 _collectionId)
        public
        payable
        virtual
        override
        nonReentrant
    {
        require(
            tokenIdToToken[_tokenId].collectionId == _collectionId &&
                tokenIdToToken[_tokenId].forSale == true,
            "Marketplace: not existing token or token not for sale"
        );
        require(msg.value == TOKEN_PRICE, "Marketplace: amount not correct");

        tokenIdToToken[_tokenId].collectionId = 0;
        tokenIdToToken[_tokenId].owner = msg.sender;
        tokenIdToToken[_tokenId].forSale = false;
        tokenIdToToken[_tokenId].price = 0;

        address owner = INFT(token).ownerOf(_tokenId);
        INFT(token).transferFrom(owner, msg.sender, _tokenId);

        emit TokenSold(owner, msg.sender, _tokenId, _collectionId, msg.value);
    }

    function listTokenForSale(uint256 _tokenId)
        public
        virtual
        override
        nonReentrant
    {
        require(
            tokenIdToToken[_tokenId].collectionId == 0 &&
                tokenIdToToken[_tokenId].owner == msg.sender &&
                tokenIdToToken[_tokenId].forSale == false,
            "Marketplace: cannot sale"
        );

        _lockToken(_tokenId);
        tokenIdToToken[_tokenId].forSale = true;

        emit TokenListedForSale(msg.sender, _tokenId);
    }

    function makeOffer(uint256 _tokenId) public payable virtual override {
        address seller = INFT(token).ownerOf(_tokenId);
        require(tokenIdToToken[_tokenId].collectionId == 0 &&
            tokenIdToToken[_tokenId].forSale, "Marketplace: not for sale");
        require(seller != msg.sender, "Marketplace: you are the owner");
        require(
            msg.value > 0,
            "Marketplace: offer price must be at least one wei"
        );

        uint256 offerId = tokenIdToOffers[_tokenId].length;

        tokenIdToOffers[_tokenId].push(
            Offer(offerId, payable(msg.sender), msg.value)
        );

        tokenIdToToken[_tokenId].offersCount.increment();

        // Locks an ether so it can't be withdrawn from
        // the contract during the token sale
        lockedAmount += msg.value;

        emit OfferCreated(seller, msg.sender, _tokenId, offerId, msg.value);
    }

    function acceptOffer(uint256 _tokenId, uint256 _offerId)
        public
        virtual
        override
        nonReentrant
    {
        require(
            INFT(token).ownerOf(_tokenId) == msg.sender,
            "Marketplace: you are not the owner"
        );
        require(tokenIdToToken[_tokenId].collectionId == 0 &&
            tokenIdToToken[_tokenId].forSale, "Marketplace: not for sale");
        require(
            tokenIdToOffers[_tokenId][_offerId].id == _offerId,
            "Marketplace: not existing offer"
        );

        address oferror = tokenIdToOffers[_tokenId][_offerId].offeror;
        uint256 price = tokenIdToOffers[_tokenId][_offerId].price;

        _unlockToken(_tokenId);
        INFT(token).transferFrom(msg.sender, oferror, _tokenId);

        lockedAmount -= price;

        payable(msg.sender).transfer(
            tokenIdToOffers[_tokenId][_offerId].price
        );

        // Returns the eth amount to the other users who had
        // a locked amount by making an offer but didn't get the token
        for (uint256 i = 0; i < tokenIdToOffers[_tokenId].length; i++) {
            if (i != _offerId) {
                lockedAmount -= tokenIdToOffers[_tokenId][i].price;
                tokenIdToOffers[_tokenId][i].offeror.transfer(
                    tokenIdToOffers[_tokenId][i].price
                );
            }
        }

        tokenIdToToken[_tokenId].owner = oferror;
        tokenIdToToken[_tokenId].forSale = false;
        tokenIdToToken[_tokenId].offersCount.reset();
        delete tokenIdToOffers[_tokenId];

        emit OfferAccepted(msg.sender, oferror, _tokenId, _offerId, price);
    }

    function _lockToken(uint256 _tokenId) internal virtual {
        INFT(token).lock(_tokenId);
    }

    function _unlockToken(uint256 _tokenId) internal virtual {
        INFT(token).unlock(_tokenId);
    }

    // Could be used if there is some market listing tokens price, i.e. the fee for the market
    function withdraw() external virtual override onlyOwner {
        require(
            address(this).balance - lockedAmount > 0,
            "Marketplace: nothing to withdraw"
        );

        payable(owner()).transfer(address(this).balance - lockedAmount);
    }
}
