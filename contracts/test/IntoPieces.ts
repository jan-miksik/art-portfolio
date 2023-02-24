import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";


// deployment


// setRoyaltyReciever
// getRoyaltyReciever
// royaltyInfo


// safeMint
// allowedMintCount
// updateMintCount
// mintedNFTs


// withdraw


// contractURI
// tokenURI


// TODOS test for all requirments


describe("Hello Nft test", function () {
  let IntoPieces, intoPiecesContract: any, owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress, addr3, addrs
  beforeEach(async function () {
    IntoPieces = await ethers.getContractFactory('IntoPieces')
    ;[owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
    intoPiecesContract = await IntoPieces.deploy();
  })

  ////////////////////////
  // deployment
  ////////////////////////
  describe("Deployment", function () {
    it('should set the right owner', async function () {
      expect(await intoPiecesContract.owner()).to.equal(owner.address)
    })
  })


  ////////////////////////
  // setRoyaltyReciever
  // getRoyaltyReciever
  // royaltyInfo
  ////////////////////////

  describe("getRoyaltyReciever", function () {
    it('Royalty reciver is owner by default', async function () {
      expect(await intoPiecesContract.getRoyaltyReciever()).to.equal(owner.address)
    })
  })


  describe("setRoyaltyReciever", function () {
    it('Royalty reciever can be changed only by owner', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReciever(addr2.address)
      expect(await intoPiecesContract.getRoyaltyReciever()).to.equal(addr2.address)
    })

    it('Royalty info returns the new royalty reciever and 5% royalty', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReciever(addr2.address)
      const royaltyInfo = await intoPiecesContract.connect(addr1).royaltyInfo(1, 100)
      expect(royaltyInfo[0]).to.equal(addr2.address)
      expect(royaltyInfo[1].toNumber()).to.equal(5)
    })
  })

  describe("royaltyInfo", function () {
    it('Should return 5% royalty and default royalty reciever (owner)', async function () {
      const royaltyInfo = await intoPiecesContract.connect(addr1).royaltyInfo(1, 100)
      expect(royaltyInfo[0]).to.equal(owner.address)
      expect(royaltyInfo[1].toNumber()).to.equal(5)
    })
  })


  ////////////////////////
  // safeMint
  // allowedMintCount
  // updateMintCount
  // mintedNFTs
  ////////////////////////

  describe("safeMint", function () {
    it.only('Is possible to mint NFT', async function () {
      await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      // expect(await intoPiecesContract.getRoyaltyReciever()).to.equal(owner.address)
    })

    it('Block minting if address mint more than allowed amount per address', async function () {

      for (let i = 0; i < 7; i++) {
        await intoPiecesContract.connect(addr1).safeMint(addr1.address)
        // ([addrs[i].address], 200)
        // await intoPiecesContract.connect(addrs[i]).mintAllowList(200, overrides)
      }
      await expect(
        intoPiecesContract.connect(addr1).safeMint(addr1.address)
      ).to.be.revertedWith('Minting limit exceeded')
      // expect(await intoPiecesContract.getRoyaltyReciever()).to.equal(owner.address)
    })
  })

})


//   describe('mintAllowList', function () {

//     it('Should be reverted if exceeded max available to purchase', async function () {
//       await doodlesContract.connect(owner).setIsAllowListActive(true)
//       const overrides = {
//         value: ethers.utils.parseEther('0.246'), // ether in this case MUST be a string
//       }
//       await doodlesContract.connect(owner).setAllowList([addr1.address], 1)
//       await expect(
//         doodlesContract.connect(addr1).mintAllowList(2, overrides),
//       ).to.be.revertedWith('Exceeded max available to purchase')
//     })

//     it('Should be reverted because the caller exceeds max token', async function () {
//       await doodlesContract.connect(owner).setIsAllowListActive(true)
//       const overrides = {
//         value: ethers.utils.parseEther('24.6'), // ether in this case MUST be a string
//       }
//       //50*200 = 10000
//       for (let i = 0; i < 50; i++) {
//         await doodlesContract
//           .connect(owner)
//           .setAllowList([addrs[i].address], 200)
//         await doodlesContract.connect(addrs[i]).mintAllowList(200, overrides)
//       }
//       await doodlesContract
//         .connect(owner)
//         .setAllowList([addrs[50].address], 200)
//       await expect(
//         doodlesContract.connect(addrs[50]).mintAllowList(1, overrides),
//       ).to.be.revertedWith('Purchase would exceed max tokens')
//     })

//     it('Should be reverted because the caller do not have enough fund', async function () {
//       await doodlesContract.connect(owner).setIsAllowListActive(true)

//       const overrides = {
//         value: ethers.utils.parseEther('0.122'), // ether in this case MUST be a string
//       }
//       await doodlesContract.connect(owner).setAllowList([addr1.address], 1)
//       await expect(
//         doodlesContract.connect(addr1).mintAllowList(1, overrides),
//       ).to.be.revertedWith('Ether value sent is not correct')
//     })

//     it('Should mint token', async function () {
//       const baseurl = 'ipfs://test.url/'
//       doodlesContract.connect(owner).setBaseURI(baseurl)
//       await doodlesContract.connect(owner).setIsAllowListActive(true)
//       const overrides = {
//         value: ethers.utils.parseEther('0.123'), // ether in this case MUST be a string
//       }
//       await doodlesContract.connect(owner).setAllowList([addr1.address], 1)
//       await doodlesContract.connect(addr1).mintAllowList(1, overrides)

//       expect(await doodlesContract.tokenURI(0)).to.equal(baseurl + '0') //ipfs://test.url/0
//       expect(await doodlesContract.ownerOf(0)).to.equal(addr1.address)
//     })
//   })

//   describe('setBaseURI', function () {
//     it('Should be reverted because the caller is not owner', async function () {
//       await expect(
//         doodlesContract.connect(addr1).setBaseURI('url'),
//       ).to.be.revertedWith('caller is not the owner')
//     })

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

//   describe('setProvenance', function () {
//     it('Should be reverted because the caller is not owner', async function () {
//       await expect(
//         doodlesContract.connect(addr1).setProvenance('random hash'),
//       ).to.be.revertedWith('caller is not the owner')
//     })

//     it('Should should set PROVENANCE by owner', async function () {
//       const expectedValue = 'random hash'

//       await doodlesContract.connect(owner).setProvenance(expectedValue)

//       expect(await doodlesContract.PROVENANCE()).to.equal(expectedValue)
//     })
//   })

//   describe('reserve', function () {
//     it('Should be reverted because the caller is not owner', async function () {
//       await expect(
//         doodlesContract.connect(addr1).reserve(1),
//       ).to.be.revertedWith('caller is not the owner')
//     })

//     it('Should reserve tokens by owner', async function () {
//       const baseurl = 'ipfs://test.url/'
//       doodlesContract.connect(owner).setBaseURI(baseurl)
//       await doodlesContract.connect(owner).reserve(5)
//       for (let i = 0; i < 5; i++) {
//         expect(await doodlesContract.tokenURI(i)).to.equal(baseurl + i)
//       }
//     })
//   })

//   describe('setSaleState', function () {
//     it('Should be reverted because the caller is not owner', async function () {
//       await expect(
//         doodlesContract.connect(addr1).setSaleState(true),
//       ).to.be.revertedWith('caller is not the owner')
//     })

//     it('Should should set saleIsActive by owner', async function () {
//       const expectedValue = true

//       await doodlesContract.connect(owner).setSaleState(expectedValue)

//       expect(await doodlesContract.saleIsActive()).to.equal(expectedValue)
//     })
//   })

//   describe('mint', function () {
//     it('Should be reverted because the saleIsActive is false', async function () {
//       await doodlesContract.connect(owner).setSaleState(false)
//       const overrides = {
//         value: ethers.utils.parseEther('0.123'), // ether in this case MUST be a string
//       }
//       await expect(
//         doodlesContract.connect(addr1).mint(1, overrides),
//       ).to.be.revertedWith('Sale must be active to mint tokens')
//     })

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