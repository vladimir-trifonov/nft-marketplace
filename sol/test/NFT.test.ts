/* eslint-disable camelcase */
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer, utils } from "ethers";
import { NFT, NFT__factory } from "../typechain-types";
import { MockContract, smock } from "@defi-wonderland/smock";

describe("NFT", function () {
  let _from: string;
  let _to: string;
  let market: string;
  let accounts: Signer[];
  let nft: MockContract<NFT>;
  const _tokenId = BigNumber.from(1);
  const _data = utils.formatBytes32String("mocked_data");
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  before(async function () {
    accounts = await ethers.getSigners();
    _from = await accounts[1].getAddress();
    _to = await accounts[2].getAddress();
    market = await accounts[3].getAddress();
  });

  beforeEach(async () => {
    const nftFactory = await smock.mock<NFT__factory>("NFT");
    nft = await nftFactory.deploy("mock_uri");
  });

  context("setMarket", () => {
    it("Should set market", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      expect(await nft.market()).to.be.equals(market);
    });

    it("Should be reverted on wrong market", async function () {
      await expect(
        nft.connect(accounts[0]).setMarket(zeroAddress)
      ).to.be.revertedWith("Token: Wrong address");
    });

    it("Should be reverted when not an owner", async function () {
      await expect(
        nft.connect(accounts[4]).setMarket(market)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  context("mint", () => {
    it("Should be reverted on wrong market", async function () {
      await nft.connect(accounts[0]).setMarket(market);

      await expect(
        nft.connect(accounts[0]).mint(_from, _tokenId)
      ).to.be.revertedWith("Token: caller is not the market");
    });

    it("Should be reverted on wrong token receiver", async function () {
      await nft.connect(accounts[0]).setMarket(market);

      await expect(
        nft.connect(accounts[3]).mint(zeroAddress, _tokenId)
      ).to.be.revertedWith("ERC721: mint to the zero address");
    });

    it("Should increase token's receiver balance", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      expect(await nft.balanceOf(_from)).to.be.equals(1);
      expect(await nft.ownerOf(_tokenId)).to.be.equals(_from);
    });

    it("Should be reverted on already minted token", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      await expect(
        nft.connect(accounts[3]).mint(_from, _tokenId)
      ).to.be.revertedWith("ERC721: token already minted");
    });
  });

  context("lock", () => {
    it("Should lock token", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      await nft.connect(accounts[3]).lock(_tokenId);

      expect(await nft.isLocked(_tokenId)).to.be.equals(true);
    });
  });

  context("unlock", () => {
    it("Should unlock token", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      await nft.connect(accounts[3]).lock(_tokenId);
      await nft.connect(accounts[3]).unlock(_tokenId);

      expect(await nft.isLocked(_tokenId)).to.be.equals(false);
    });
  });

  context("transferFrom", () => {
    it("Should transfer token", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      await nft.connect(accounts[3]).transferFrom(_from, _to, _tokenId);

      expect(await nft.balanceOf(_from)).to.be.equals(0);
      expect(await nft.balanceOf(_to)).to.be.equals(1);
      expect(await nft.ownerOf(_tokenId)).to.be.equals(_to);
    });

    it("Should be reverted when not a market", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      await expect(
        nft.connect(accounts[0]).transferFrom(_from, _to, _tokenId)
      ).to.be.revertedWith("Token: caller is not the market");
    });

    it("Should be reverted when token locked", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[3]).lock(_tokenId);

      await expect(
        nft.connect(accounts[3]).transferFrom(_from, _to, _tokenId)
      ).to.be.revertedWith("Token: the token is locked");
    });
  });

  context("safeTransferFrom(address,address,uint256)", () => {
    it("Should transfer token", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[1]).setApprovalForAll(market, true);

      await nft
        .connect(accounts[3])
        ["safeTransferFrom(address,address,uint256)"](_from, _to, _tokenId);

      expect(await nft.balanceOf(_from)).to.be.equals(0);
      expect(await nft.balanceOf(_to)).to.be.equals(1);
      expect(await nft.ownerOf(_tokenId)).to.be.equals(_to);
    });

    it("Should be reverted when not a market", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[1]).setApprovalForAll(market, true);

      await expect(
        nft
          .connect(accounts[0])
          ["safeTransferFrom(address,address,uint256)"](_from, _to, _tokenId)
      ).to.be.revertedWith("Token: caller is not the market");
    });

    it("Should be reverted when token locked", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[1]).setApprovalForAll(market, true);
      await nft.connect(accounts[3]).lock(_tokenId);

      await expect(
        nft
          .connect(accounts[3])
          ["safeTransferFrom(address,address,uint256)"](_from, _to, _tokenId)
      ).to.be.revertedWith("Token: the token is locked");
    });
  });

  context("safeTransferFrom(address,address,uint256,bytes)", () => {
    it("Should transfer token", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[1]).setApprovalForAll(market, true);

      await nft
        .connect(accounts[3])
        ["safeTransferFrom(address,address,uint256,bytes)"](
          _from,
          _to,
          _tokenId,
          _data
        );

      expect(await nft.balanceOf(_from)).to.be.equals(0);
      expect(await nft.balanceOf(_to)).to.be.equals(1);
      expect(await nft.ownerOf(_tokenId)).to.be.equals(_to);
    });

    it("Should be reverted when not a market", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[1]).setApprovalForAll(market, true);

      await expect(
        nft
          .connect(accounts[0])
          ["safeTransferFrom(address,address,uint256,bytes)"](
            _from,
            _to,
            _tokenId,
            _data
          )
      ).to.be.revertedWith("Token: caller is not the market");
    });

    it("Should be reverted when token locked", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);
      await nft.connect(accounts[1]).setApprovalForAll(market, true);
      await nft.connect(accounts[3]).lock(_tokenId);

      await expect(
        nft
          .connect(accounts[3])
          ["safeTransferFrom(address,address,uint256,bytes)"](
            _from,
            _to,
            _tokenId,
            _data
          )
      ).to.be.revertedWith("Token: the token is locked");
    });
  });

  context("uri", () => {
    it("Should return token uri", async function () {
      await nft.connect(accounts[0]).setMarket(market);
      await nft.connect(accounts[3]).mint(_from, _tokenId);

      const uri = await nft.connect(accounts[0]).uri(_tokenId);

      expect(uri).to.be.equals(
        "mock_uri0000000000000000000000000000000000000000000000000000000000000001"
      );
    });
  });
});
