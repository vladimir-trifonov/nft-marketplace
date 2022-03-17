// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: " + deployer.address);

  const baseUri = "https://ipfs.infura.io/ipfs/f";

  const NFT = await ethers.getContractFactory("NFTEnumerable");
  const nft = await NFT.deploy(baseUri);
  await nft.deployed();

  const Collection = await ethers.getContractFactory("Collection");
  const collection = await Collection.deploy(baseUri);
  await collection.deployed();

  const Market = await ethers.getContractFactory("Market");
  const market = await Market.deploy(collection.address, nft.address as any);
  await market.deployed();

  await collection.setMinterRole(market.address);
  await nft.setMarket(market.address);

  console.log("NFT deployed to:", nft.address);
  console.log("Collection deployed to:", collection.address);
  console.log("Market deployed to:", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
