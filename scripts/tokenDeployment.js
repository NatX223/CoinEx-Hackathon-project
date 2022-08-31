const hre = require("hardhat");

async function main() {
  
  const maxSupply = 1000000;
  const Token = await hre.ethers.getContractFactory("SocialToken");
  const token = await Token.deploy(maxSupply, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

  await token.deployed();

  console.log(
    "Address", token.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
