import { ethers } from "hardhat";

const main = async () => {

  // const TestNFTContractFactory = await ethers.getContractFactory('TestNFT');
  // const TestNFTContract = await TestNFTContractFactory.deploy('https://www.721.so/api/example/metadata/');
  // await TestNFTContract.deployed();


  const ContractFactory = await ethers.getContractFactory('HelloNft');
  // @params uri(single NFT) contactURI(collection)
  const Contract = await ContractFactory.deploy();
  await Contract.deployed();
  // const Contract = await ContractFactory.deploy('ipfs://bafkreihx3yvxe3o6x7hlx3v4nhbpdries6ovjtvyoyz7qyexnqrfhif74y');
  // await Contract.deployed();

  console.log('deployed contract address: ', Contract.address);
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
