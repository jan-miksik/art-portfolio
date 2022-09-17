import { ethers } from "hardhat";

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = ethers.utils.parseEther("1");

//   const Lock = await ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log("Lock with 1 ETH deployed to:", lock.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const main = async () => {
  // name of the contract should match with the file name!!
  // const msgContractFactory = await ethers.getContractFactory('MessagePortal');
  // const msgContract = await msgContractFactory.deploy({});
  // await msgContract.deployed();
  // console.log('msgPortal address: ', msgContract.address);


  const TestNFTContractFactory = await ethers.getContractFactory('TestNFT');
  const TestNFTContract = await TestNFTContractFactory.deploy('https://www.721.so/api/example/metadata/');
  await TestNFTContract.deployed();

  // const TestBNB = await ethers.getContractFactory('BNB');
  // const TestBNBContract = await TestBNB.deploy('200000000000000000000000000', 'BNBTest', 18, 'BNBTest');
  // await TestBNBContract.deployed();

  // 200000000000000000000000000
  console.log('TestNFTContract address: ', TestNFTContract.address);
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
