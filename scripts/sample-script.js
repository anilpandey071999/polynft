// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const PolyNFT = await hre.ethers.getContractFactory("PolyNFT");
  const polyNFT = await PolyNFT.deploy(
    3000,
    "ipfs://bafybeic26wp7ck2bsjhjm5pcdigxqebnthqrmugsygxj5fov2r2qwhxyqu/",
    "ipfs://bafkreignkbzn4nhtxixs5u7x3zprgzg653kzi3pkljxlyb3bag5e7vhx3u"
  );

  await polyNFT.deployed();

  console.log("POLY deployed to:", polyNFT.address);
  await polyNFT.ToggleWhitelist();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
