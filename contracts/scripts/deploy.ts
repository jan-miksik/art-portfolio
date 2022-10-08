import { ethers } from "hardhat";

const main = async () => {

  // const TestNFTContractFactory = await ethers.getContractFactory('TestNFT');
  // const TestNFTContract = await TestNFTContractFactory.deploy('https://www.721.so/api/example/metadata/');
  // await TestNFTContract.deployed();


  const TestACP_NFTContractFactory = await ethers.getContractFactory('NftArbitraryPrice');
  const TestNFTContract = await TestACP_NFTContractFactory.deploy('ipfs://bafkreib63o5i3n6ocv4l3ey3po4nhcochjymsof5end4jt64kbbhnl4uiq', 'ipfs://bafkreiaz5rlt5y5kfixnbbc7npmyk4muy4zhozf4tkqxw5ze7cewhsx6vi');
  await TestNFTContract.deployed();

  console.log('deployed contract address: ', TestNFTContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
