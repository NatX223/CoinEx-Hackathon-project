const hre = require("hardhat");

async function main() {

  const postReward = 5;
  const likeReward = 1;
  const commentReward = 2;
  const Media = await hre.ethers.getContractFactory("SocialMediaContract");
  const media = await Media.deploy(postReward, likeReward, commentReward, "0x610178dA211FEF7D417bC0e6FeD39F05609AD788");

  await media.deployed();

  console.log(
    "Address", media.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
