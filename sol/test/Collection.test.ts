/* eslint-disable camelcase */
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { Collection, Collection__factory } from "../typechain-types";
import { MockContract, smock } from "@defi-wonderland/smock";

describe("Collection", function () {
  let _creator: string;
  let minter: string;
  let _to: string;
  let accounts: Signer[];
  let collection: MockContract<Collection>;
  const _collectionId = BigNumber.from(1);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  before(async function () {
    accounts = await ethers.getSigners();
    _creator = await accounts[0].getAddress();
    _to = await accounts[1].getAddress();
    minter = await accounts[2].getAddress();
  });

  beforeEach(async () => {
    const collectionFactory = await smock.mock<Collection__factory>(
      "Collection"
    );
    collection = await collectionFactory.deploy("mock_uri");
  });

  it("Should be reverted on mint when minter has no minter role", async function () {
    await expect(
      collection
        .connect(accounts[2])
        ["mint(address,uint256)"](_to, _collectionId)
    ).to.be.revertedWith(
      "ERC1155PresetMinterPauser: must have minter role to mint"
    );
  });

  it("Should be reverted on wrong creator", async function () {
    await expect(
      collection
        .connect(accounts[0])
        ["mint(address,uint256)"](zeroAddress, _collectionId)
    ).to.be.revertedWith("Wrong creator");
  });

  it("Should set minter role", async function () {
    await collection.connect(accounts[0]).setMinterRole(minter);
    const minterRole = await collection.connect(accounts[0]).MINTER_ROLE();
    expect(await collection.hasRole(minterRole, minter)).to.be.equals(true);
  });

  it("Should be reverted on wrong minter", async function () {
    await expect(
      collection.connect(accounts[0]).setMinterRole(zeroAddress)
    ).to.be.revertedWith("Wrong minter");
  });

  it("Should mint new collection", async function () {
    await collection
      .connect(accounts[0])
      ["mint(address,uint256)"](_to, _collectionId);
    expect(
      await collection.connect(accounts[0]).isCreator(_collectionId, _to)
    ).to.be.equals(true);
  });

  it("Should be reverted when mint existing collection id", async function () {
    await collection
      .connect(accounts[0])
      ["mint(address,uint256)"](_to, _collectionId);

    await expect(
      collection
        .connect(accounts[0])
        ["mint(address,uint256)"](_to, _collectionId)
    ).to.be.revertedWith("Collection: existing collection");
  });

  it("Should be reverted on wrong creator", async function () {
    await expect(
      collection.connect(accounts[0]).isCreator(_collectionId, zeroAddress)
    ).to.be.revertedWith("Wrong creator");
  });

  it("Should be reverted on non existing collection", async function () {
    await expect(
      collection.connect(accounts[0]).isCreator(BigNumber.from(2), _creator)
    ).to.be.revertedWith("Collection: not existing collection");
  });

  it("Should return collections ids", async function () {
    await collection
      .connect(accounts[0])
      ["mint(address,uint256)"](_creator, _collectionId);

    const collectionsIds = await collection
      .connect(accounts[0])
      .collectionsIdsByCreator(_creator);

    expect(collectionsIds[0].toString()).to.be.equals(_collectionId.toString());
  });

  it("Should return collection uri", async function () {
    await collection
      .connect(accounts[0])
      ["mint(address,uint256)"](_creator, _collectionId);

    const uri = await collection.connect(accounts[0]).uri(_collectionId);

    expect(uri).to.be.equals(
      "mock_uri0000000000000000000000000000000000000000000000000000000000000001"
    );
  });
});
