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

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  const Market = await ethers.getContractFactory("Market");
  const market = await Market.deploy(nft.address);
  await market.deployed();

  await nft.setMarket(market.address);

  console.log("NFT deployed to:", nft.address);
  console.log("Market deployed to:", market.address);

  const collId = "0x23d6317299d5d4ed69147262f8ea73477172918df16c9d2fbdf755ae703833f0";
  const tokenId = "0xeade8654c28fcb82834c63a71e7edc3bb180b4d932bba605b5a4d8b140f0d25f";
  await market.createCollection(collId);
  await market.mintToken(tokenId, collId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
