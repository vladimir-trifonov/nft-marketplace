/* eslint-disable camelcase */
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer, utils } from "ethers";
import {
  NFTEnumerable,
  Collection,
  Market,
  Market__factory,
} from "../typechain-types";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";

describe("Market", function () {
  let collection: FakeContract<Collection>;
  let token: FakeContract<NFTEnumerable>;
  let accounts: Signer[];
  let market: MockContract<Market>;
  let sender: string;
  let buyer: string;
  let tokenPrice: BigNumber;
  const _collectionId = BigNumber.from(1);
  const _tokenId = BigNumber.from(2);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  before(async function () {
    accounts = await ethers.getSigners();
    sender = await accounts[0].getAddress();
    buyer = await accounts[1].getAddress();
  });

  beforeEach(async () => {
    collection = await smock.fake<Collection>("Collection");
    token = await smock.fake<NFTEnumerable>("NFTEnumerable");
    const marketFactory = await smock.mock<Market__factory>("Market");
    market = await marketFactory.deploy(collection.address, token.address);
    tokenPrice = await market.TOKEN_PRICE();
  });

  context("createCollection", () => {
    it("Should create collection", async function () {
      await market.connect(accounts[0]).createCollection(_collectionId);

      expect(
        collection["mint(address,uint256)"].atCall(0).getCallCount()
      ).to.be.equals(1);
      expect(
        collection["mint(address,uint256)"].getCall(0).args[0]
      ).to.be.equals(sender);
      expect(
        collection["mint(address,uint256)"].getCall(0).args[1]
      ).to.be.equals(_collectionId);
    });

    it("Should be reverted on wrong collection id", async function () {
      await expect(
        market.connect(accounts[0]).createCollection(BigNumber.from(0))
      ).to.be.revertedWith("Marketplace: wrong collection id");
    });

    it("Should emit CollectionCreated", async function () {
      await market.connect(accounts[0]).createCollection(_collectionId);

      await expect(market.connect(accounts[0]).createCollection(_collectionId))
        .to.emit(market, "CollectionCreated")
        .withArgs(sender, _collectionId);
    });
  });

  context("mintToken", () => {
    it("Should mint token", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(true);

      await market.connect(accounts[0]).mintToken(_tokenId, _collectionId);

      expect(token.mint.atCall(0).getCallCount()).to.be.equals(1);
      expect(token.mint.getCall(0).args[0]).to.be.equals(sender);
      expect(token.mint.getCall(0).args[1]).to.be.equals(_tokenId);

      const tokens = await market.fetchTokensBatch([_tokenId]);
      expect(tokens[0].tokenId).to.be.equals(_tokenId);
      expect(tokens[0].collectionId).to.be.equals(_collectionId);
      expect(tokens[0].owner).to.be.equals(sender);
      expect(tokens[0].forSale).to.be.equals(true);
      expect(tokens[0].price).to.be.equals(tokenPrice);
      expect(tokens[0].offersCount.toString()).to.be.equals("0");
    });

    it("Should be reverted when not a collection owner", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(false);

      await expect(
        market.connect(accounts[0]).mintToken(_tokenId, _collectionId)
      ).to.be.revertedWith("Marketplace: not a collection owner");
    });

    it("Should emit TokenMinted", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(true);

      await expect(
        market.connect(accounts[0]).mintToken(_tokenId, _collectionId)
      )
        .to.emit(market, "TokenMinted")
        .withArgs(sender, _collectionId, _tokenId, tokenPrice);
    });
  });

  context("buyToken", () => {
    it("Should transfer token", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(true);
      token.ownerOf.whenCalledWith(_tokenId).returns(sender);

      await market.connect(accounts[0]).mintToken(_tokenId, _collectionId);

      await market.connect(accounts[1]).buyToken(_tokenId, _collectionId, {
        value: tokenPrice,
      });

      expect(token.transferFrom.atCall(0).getCallCount()).to.be.equals(1);
      expect(token.transferFrom.getCall(0).args[0]).to.be.equals(sender);
      expect(token.transferFrom.getCall(0).args[1]).to.be.equals(buyer);
      expect(token.transferFrom.getCall(0).args[2]).to.be.equals(_tokenId);

      const tokens = await market.fetchTokensBatch([_tokenId]);
      expect(tokens[0].tokenId).to.be.equals(_tokenId);
      expect(tokens[0].collectionId.toString()).to.be.equals("0");
      expect(tokens[0].owner).to.be.equals(buyer);
      expect(tokens[0].forSale).to.be.equals(false);
      expect(tokens[0].price.toString()).to.be.equals("0");
      expect(tokens[0].offersCount.toString()).to.be.equals("0");
    });

    it("Should be reverted on insufficient price", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(true);
      await market.connect(accounts[0]).mintToken(_tokenId, _collectionId);

      await expect(
        market.connect(accounts[1]).buyToken(_tokenId, _collectionId)
      ).to.be.revertedWith("Marketplace: amount not correct");
    });

    it("Should be reverted on not existing token", async function () {
      await expect(
        market.connect(accounts[1]).buyToken(_tokenId, _collectionId)
      ).to.be.revertedWith(
        "Marketplace: not existing token or token not for sale"
      );
    });

    it("Should be reverted on token not for sale", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(true);
      token.ownerOf.whenCalledWith(_tokenId).returns(sender);

      await market.connect(accounts[0]).mintToken(_tokenId, _collectionId);

      await market.connect(accounts[1]).buyToken(_tokenId, _collectionId, {
        value: tokenPrice,
      });

      await expect(
        market.connect(accounts[2]).buyToken(_tokenId, _collectionId, {
          value: tokenPrice,
        })
      ).to.be.revertedWith(
        "Marketplace: not existing token or token not for sale"
      );
    });

    it("Should emit TokenSold", async function () {
      collection.isCreator.whenCalledWith(_collectionId, sender).returns(true);
      token.ownerOf.whenCalledWith(_tokenId).returns(sender);

      await market.connect(accounts[0]).mintToken(_tokenId, _collectionId);

      await expect(
        market.connect(accounts[1]).buyToken(_tokenId, _collectionId, {
          value: tokenPrice,
        })
      )
        .to.emit(market, "TokenSold")
        .withArgs(sender, buyer, _tokenId, _collectionId, tokenPrice);
    });
  });
});
