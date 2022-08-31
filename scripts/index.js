const hre = require("hardhat");

async function main () {

    const contractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    const Media = await hre.ethers.getContractFactory("SocialMediaContract");
    const media = await Media.attach(contractAddress);

    const TokenAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
    const Token = await hre.ethers.getContractFactory("SocialToken");
    const token = await Token.attach(TokenAddress);

    // transfer tokens to contract
    await token.transfer(contractAddress, 50000000000000000000000n);
    // check contract balence
    const contractBalance = await token.balanceOf(contractAddress);
    console.log(contractBalance);

    // create post
    await media.createPost("0x000000");
    const userBalance = await token.balanceOf(contractAddress);
    console.log(userBalance);
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
})