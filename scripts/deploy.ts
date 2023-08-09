import { ethers } from "hardhat";

async function main() {
  // const lockedAmount = ethers.utils.parseEther("1");

  const NFT = await ethers.getContractFactory("MyToken");
  // const greeting = await Greeting.deploy("Hello world", { value: lockedAmount });
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log("NFT contract deployed to: ", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
