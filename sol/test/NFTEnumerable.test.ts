/* eslint-disable camelcase */
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { NFTEnumerable, NFTEnumerable__factory } from "../typechain-types";
import { MockContract, smock } from "@defi-wonderland/smock";

describe("NFTEnumerable", function () {
  let _from: string;
  let market: string;
  let _except: string;
  let _only: string;
  let accounts: Signer[];
  let nftEnumerable: MockContract<NFTEnumerable>;
  const _tokenId = BigNumber.from(1);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  before(async function () {
    accounts = await ethers.getSigners();
    _except = await accounts[1].getAddress();
    _only = await accounts[2].getAddress();
    _from = _only;
    market = await accounts[3].getAddress();
  });

  beforeEach(async () => {
    const nftEnumerableFactory = await smock.mock<NFTEnumerable__factory>(
      "NFTEnumerable"
    );
    nftEnumerable = await nftEnumerableFactory.deploy("mock_uri");
  });

  it("Should be reverted on wrong params", async function () {
    await expect(
      nftEnumerable.connect(accounts[0]).fetchTokensIdsBatch(_except, _only)
    ).to.be.revertedWith("Token: wrong params");
  });

  it("Should return market tokens ids", async function () {
    await nftEnumerable.connect(accounts[0]).setMarket(market);
    await nftEnumerable.connect(accounts[3]).mint(_from, _tokenId);

    const tokensIds = await nftEnumerable
      .connect(accounts[0])
      .fetchTokensIdsBatch(_except, zeroAddress);

    expect(tokensIds[0].toString()).to.be.equals(_tokenId.toString());
  });

  it("Should return owners' tokens ids", async function () {
    await nftEnumerable.connect(accounts[0]).setMarket(market);
    await nftEnumerable.connect(accounts[3]).mint(_from, _tokenId);

    const tokensIds = await nftEnumerable
      .connect(accounts[0])
      .fetchTokensIdsBatch(zeroAddress, _only);

    expect(tokensIds[0].toString()).to.be.equals(_tokenId.toString());
  });
});
