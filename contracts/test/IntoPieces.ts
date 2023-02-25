import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { base64 } from "ethers/lib/utils";
import { ethers } from "hardhat";
// import { FakeContract, smock } from '@defi-wonderland/smock';

// setRoyaltyReceiver
// getRoyaltyReceiver
// royaltyInfo


// safeMint
// allowedMintCount
// mintedNFTs


// withdraw


// contractURI
// tokenURI


const MINT_LIMIT_PER_WALLET = 7
const MAX_SUPPLY = 1000;

// chai.should(); // if you like should syntax
// chai.use(smock.matchers);

// describe('IntoPieces', () => {
//     let fakeContract: any;

//     beforeEach(async () => {
//         // ...
//         // myContractFake = await smock.fake('IntoPieces');
//         // 
//         // const myMockedContractFactory = await smock.mock<IntoPieces__factory>("IntoPieces");
//         const myContractFactory = await hre.ethers.getContractFactory('IntoPieces');
//         const myContract = await myContractFactory.deploy();
//         fakeContract = await smock.fake(myContract);
//     });

//     it('some test', async () => {
//         // myContractFake.MAX_SUPPLY.returns(500);
//         // ...
//         // myContractFake.bark.atCall(0).should.be.calledWith('Hello World');
//         
//         expect(await fakeContract.MAX_SUPPLY()).to.equal(500);
//     });
// });














describe("Into Pieces Nft test", function () {
  let IntoPieces, intoPiecesContract: any, owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress, addr3, addrs: SignerWithAddress[]
  beforeEach(async function () {
    IntoPieces = await ethers.getContractFactory('IntoPieces')
    ;[owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
    intoPiecesContract = await IntoPieces.deploy();
  })

  ////////////////////////
  // deployment
  ////////////////////////
  describe("Deployment", function () {
    it('Should set the right owner', async function () {
      expect(await intoPiecesContract.owner()).to.equal(owner.address)
    })

    it("Should have max supply 1000", async () => {
      expect(await intoPiecesContract.MAX_SUPPLY()).to.equal(1000);
    });

    it("Should have mint limit per wallet 7", async () => {
      expect(await intoPiecesContract.MINT_LIMIT_PER_WALLET()).to.equal(7);
    });
  })


  ////////////////////////
  // setRoyaltyReceiver
  // getRoyaltyReceiver
  // royaltyInfo
  ////////////////////////

  describe("getRoyaltyReceiver", function () {
    it('Royalty receiver is owner by default', async function () {
      expect(await intoPiecesContract.getRoyaltyReceiver()).to.equal(owner.address)
    })
  })


  describe("setRoyaltyReceiver", function () {
    it('Royalty receiver can be changed only by owner', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReceiver(addr2.address)
      expect(await intoPiecesContract.getRoyaltyReceiver()).to.equal(addr2.address)
    })

    it('Royalty info returns the new royalty receiver and 5% royalty', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReceiver(addr2.address)
      const royaltyInfo = await intoPiecesContract.connect(addr1).royaltyInfo(1, 100)
      expect(royaltyInfo[0]).to.equal(addr2.address)
      expect(royaltyInfo[1].toNumber()).to.equal(5)
    })
  })

  describe("royaltyInfo", function () {
    it('Should return 5% royalty and default royalty receiver (owner)', async function () {
      const royaltyInfo = await intoPiecesContract.connect(addr1).royaltyInfo(1, 100)
      expect(royaltyInfo[0]).to.equal(owner.address)
      expect(royaltyInfo[1].toNumber()).to.equal(5)
    })
  })


  ////////////////////////
  // safeMint
  // allowedMintCount
  // mintedNFTs
  ////////////////////////

  describe("safeMint", function () {
    it('Is possible to mint NFT', async function () {
      await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)
    })

    it('Block minting if address mint more than allowed amount per address', async function () {
      for (let i = 0; i < MINT_LIMIT_PER_WALLET; i++) {
        await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      }
      await expect(
        intoPiecesContract.connect(addr1).safeMint(addr1.address)
      ).to.be.revertedWith('Minting limit exceeded')
    })

    it('Should be possible to mint NFT with custom price and contract balance has appropriate amount', async function () {
      const AMOUNT_IN_ETH_TO_SPEND = '0.1'
      const overrides = {
        value: ethers.utils.parseEther(AMOUNT_IN_ETH_TO_SPEND),
      }
      await intoPiecesContract.connect(addr1).safeMint(addr1.address, overrides)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)

      const contractBalance = await ethers.provider.getBalance(intoPiecesContract.address);
      const contractBalanceETH = ethers.utils.formatEther(contractBalance)
      expect(contractBalanceETH).to.equal(AMOUNT_IN_ETH_TO_SPEND)
    })

    it('Should be possible to mint NFT with zero price and contract balance has appropriate amount', async function () {
      const AMOUNT_IN_ETH_TO_SPEND = '0.0'

      const overrides = {
        value: ethers.utils.parseEther('0.0'),
      }
      await intoPiecesContract.connect(addr1).safeMint(addr1.address, overrides)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)

      const contractBalance = await ethers.provider.getBalance(intoPiecesContract.address);
      const contractBalanceETH = ethers.utils.formatEther(contractBalance)
      expect(contractBalanceETH).to.equal(AMOUNT_IN_ETH_TO_SPEND)
    })
  })


  describe("allowedMintCount", function () {
    it('allowedMintCount returns how many NFTs is possible to mint on address', async function () {
      expect(await intoPiecesContract.allowedMintCount(addr1.address)).to.equal(MINT_LIMIT_PER_WALLET)
    })

    it('allowedMintCount returns remaining amount of mints on address after minting', async function () {
      const MINTED_NFTS = 3

      // for (let i = 0; i < MINTED_NFTS; i++) {
      //   await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      // }
      Array.from({ length: MINTED_NFTS }, async () =>  await intoPiecesContract.connect(addr1).safeMint(addr1.address))

      expect(await intoPiecesContract.allowedMintCount(addr1.address)).to.equal(MINT_LIMIT_PER_WALLET - MINTED_NFTS)
    })
  })


  describe("mintedNFTs", function () {
    it('mintedNFTs returns 0 if no NFTs was minted', async function () {
      expect(await intoPiecesContract.mintedNFTs()).to.equal(0)
    })

    it('mintedNFTs returns how many NFTs was minted', async function () {
      const MINTED_NFTS = 5
      

      Array.from({ length: MINTED_NFTS }, async () =>  await intoPiecesContract.connect(addr1).safeMint(addr1.address))

      expect(await intoPiecesContract.mintedNFTs()).to.equal(MINTED_NFTS)
    })

    // it.only('mintedNFTs should not exceed max supply', async function () {
    //   for (let i = 0; i < MAX_SUPPLY; i++) {
    //     const randomWallet = ethers.Wallet.createRandom()
    //     const connectedRandomWallet = randomWallet.connect(ethers.provider);
    //     await addr1.sendTransaction({to: connectedRandomWallet.address, value: ethers.utils.parseEther("2")});
    //     for (let j = 0; j < MINT_LIMIT_PER_WALLET; j++) {
    //       
    //       await intoPiecesContract.connect(connectedRandomWallet).safeMint(connectedRandomWallet.address)
    //     }
    //   }
    //   await expect(
    //     intoPiecesContract.connect(addr1).safeMint(addr1.address)
    //   ).to.be.revertedWith('Exceeds max supply')
    // })
  })


  ////////////////////////
  // withdraw
  ////////////////////////

  describe("withdraw", function () {
    it('owner can withdraw from contract', async function () {
      const AMOUNT_IN_ETH_TO_SPEND = '0.1'

      const overrides = {
        value: ethers.utils.parseEther('0.1'),
      }
      await intoPiecesContract.connect(addr1).safeMint(addr1.address, overrides)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)

      const contractBalance = await ethers.provider.getBalance(intoPiecesContract.address);
      const contractBalanceETH = ethers.utils.formatEther(contractBalance)
      expect(contractBalanceETH).to.equal(AMOUNT_IN_ETH_TO_SPEND)

      const ownerBalance = await ethers.provider.getBalance(owner.address);

      const txResp = await intoPiecesContract.connect(owner).withdraw()
      const txReceipt = await txResp.wait();
      const withdrawEthFee = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)
      
      const contractBalanceAfterWithdraw = await ethers.provider.getBalance(intoPiecesContract.address);
      const contractBalanceETHAfterWithdraw  = ethers.utils.formatEther(contractBalanceAfterWithdraw)
      expect(contractBalanceETHAfterWithdraw).to.equal('0.0')
    
      const ownerBalanceAfterWithdraw = await ethers.provider.getBalance(owner.address);

      expect(ownerBalanceAfterWithdraw).to.equal(ownerBalance.add(contractBalance).sub(withdrawEthFee))
    })


    it('address which is not owner can not withdraw from contract', async function () {
      await expect(
        intoPiecesContract.connect(addr1).withdraw(),
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  
  })

////////////////////////
// contractURI
// tokenURI
////////////////////////

describe.only("contractURI", function () {
  it('contractURI give expected data', async function () {
    const contractURIBase64 = await intoPiecesContract.connect(addr1).contractURI()
    console.log('contractURI: ', contractURIBase64);
    // base64.
    const contractURI = base64.decode(contractURIBase64);
    console.log('contractURI: ', contractURI);
    
  })


  // it('address which is not owner can not withdraw from contract', async function () {
  //   await expect(
  //     intoPiecesContract.connect(addr1).withdraw(),
  //   ).to.be.revertedWith('Ownable: caller is not the owner')
  // })

})

})











































//   describe('mintAllowList', function () {

//     it('Should set the baseTokenURI by owner', async function () {
//       const baseurl = 'ipfs://test.url/'
//       doodlesContract.connect(owner).setBaseURI(baseurl)
//       const overrides = {
//         value: ethers.utils.parseEther('0.123'), // ether in this case MUST be a string
//       }
//       await doodlesContract.connect(owner).setSaleState(true)
//       await doodlesContract.connect(addr1).mint(1, overrides)

//       expect(await doodlesContract.tokenURI(0)).to.equal(baseurl + '0')
//       expect(await doodlesContract.ownerOf(0)).to.equal(addr1.address)
//     })
//   })


//   describe('mint', function () {

//     it('Should be reverted if exceeded max token purchase', async function () {
//       await doodlesContract.connect(owner).setSaleState(true)
//       const overrides = {
//         value: ethers.utils.parseEther('0.738'), // ether in this case MUST be a string
//       }

//       await expect(
//         doodlesContract.connect(addr1).mint(6, overrides),
//       ).to.be.revertedWith('Exceeded max token purchase')
//     })

//     it('Should be reverted because the caller exceeds max token', async function () {
//       await doodlesContract.connect(owner).setSaleState(true)
//       const overrides = {
//         value: ethers.utils.parseEther('0.615'), // ether in this case MUST be a string
//       }

//       //5 token each time * 2000 = 10000
//       for (let i = 0; i < 2000; i++) {
//         await doodlesContract.connect(addr1).mint(5, overrides)
//       }

//       await expect(
//         doodlesContract.connect(addr1).mint(1, overrides),
//       ).to.be.revertedWith('Purchase would exceed max tokens')
//     })

//     it('Should be reverted because the caller do not have enough fund', async function () {
//       await doodlesContract.connect(owner).setSaleState(true)

//       const overrides = {
//         value: ethers.utils.parseEther('0.122'), // ether in this case MUST be a string
//       }
//       await expect(
//         doodlesContract.connect(addr1).mint(1, overrides),
//       ).to.be.revertedWith('Ether value sent is not correct')
//     })

//     it('Should mint token', async function () {
//       const baseurl = 'ipfs://test.url/'
//       doodlesContract.connect(owner).setBaseURI(baseurl)
//       await doodlesContract.connect(owner).setSaleState(true)
//       const overrides = {
//         value: ethers.utils.parseEther('0.123'), // ether in this case MUST be a string
//       }
//       await doodlesContract.connect(addr1).mint(1, overrides)

//       expect(await doodlesContract.tokenURI(0)).to.equal(baseurl + '0')
//       expect(await doodlesContract.ownerOf(0)).to.equal(addr1.address)
//     })
//   })

//   describe('withdraw', function () {
//     it('Should be reverted because the caller is not owner', async function () {
//       await expect(
//         doodlesContract.connect(addr1).withdraw(),
//       ).to.be.revertedWith('caller is not the owner')
//     })
//     it('Should withdraw fund by the owner', async function () {
//       await doodlesContract.connect(owner).withdraw()
//     })

//     it('Should withdraw fund by the owner', async function () {
//       await doodlesContract.connect(owner).setSaleState(true)
//       const overrides = {
//         value: ethers.utils.parseEther('5'), // ether in this case MUST be a string
//       }
//       await doodlesContract.connect(addr1).mint(1, overrides)
//       const accountBalanceBeforeWithdraw = ethers.utils.formatEther(
//         await doodlesContract.provider.getBalance(owner.address),
//       )

//       await doodlesContract.connect(owner).withdraw()
//       const accountBalanceAfterWithdraw = ethers.utils.formatEther(
//         await doodlesContract.provider.getBalance(owner.address),
//       )

//       expect(
//         parseInt(accountBalanceAfterWithdraw) >
//           parseInt(accountBalanceBeforeWithdraw),
//       ).to.be.true

//       //get smart contract balance before withdraw and smart contract balance after withdraw
//     })
//   })
// })
