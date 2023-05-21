import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { IntoPieces } from '../typechain-types';
import { Contract } from 'ethers';

//***** Contract methods to test *****/
///// Royalty //////
// setRoyaltyReceiver
// getRoyaltyReceiver
// royaltyInfo
// supportsInterface

///// Minting //////
// safeMint
// allowedMintCount
// mintedNFTs

///// Withdraw //////
// withdraw
// withdrawERC20Token
// checkERC20Balance

///// Metadata //////
// contractURI
// tokenURI




const MINT_LIMIT_PER_WALLET = 3
const MAX_SUPPLY = 73

describe('Into pieces NFT test', function () {
  let IntoPieces,
    intoPiecesContract: IntoPieces,
    owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress,
    addrs: SignerWithAddress[],
    tokenErc20: Contract;
  beforeEach(async function () {
    IntoPieces = await ethers.getContractFactory('IntoPieces')
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    intoPiecesContract = await IntoPieces.deploy()

    const Token = await ethers.getContractFactory("ERC20Mock");
    tokenErc20 = await Token.deploy();

    // Mint some tokens to the contract
    await tokenErc20.mint(intoPiecesContract.address, ethers.utils.parseEther("1000"));
  })

  ////////////////////////
  // deployment
  ////////////////////////
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await intoPiecesContract.owner()).to.equal(owner.address)
    })

    it('Should have max supply 73', async () => {
      expect(await intoPiecesContract.MAX_SUPPLY()).to.equal(73)
    })

    it('Should have mint limit per wallet 3', async () => {
      expect(await intoPiecesContract.MINT_LIMIT_PER_WALLET()).to.equal(3)
    })
  })

  ////// Royalty //////////
  // setRoyaltyReceiver
  // getRoyaltyReceiver
  // royaltyInfo
  // supportsInterface
  ////////////////////////

  describe('getRoyaltyReceiver', function () {
    it('Royalty receiver is owner by default', async function () {
      expect(await intoPiecesContract.getRoyaltyReceiver()).to.equal(
        owner.address
      )
    })
  })

  describe('setRoyaltyReceiver', function () {
    it('Royalty receiver can be changed only by owner', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReceiver(addr2.address)
      expect(await intoPiecesContract.getRoyaltyReceiver()).to.equal(
        addr2.address
      )
    })

    it('Should revert if new royalty receiver is the same as the current one', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReceiver(addr2.address)
      await expect(intoPiecesContract.connect(owner).setRoyaltyReceiver(addr2.address)).to.be.revertedWith("New royalty receiver is the same as the current one");
      expect(await intoPiecesContract.getRoyaltyReceiver()).to.equal(
        addr2.address
      )
    })

    it('Should revert if address is zero', async function () {
      await expect(intoPiecesContract.connect(owner).setRoyaltyReceiver(ethers.constants.AddressZero)).to.be.revertedWith("New royalty receiver cannot be the zero address");
    })

    it('Royalty info returns the new royalty receiver and 5% royalty', async function () {
      await intoPiecesContract.connect(owner).setRoyaltyReceiver(addr2.address)
      const royaltyInfo = await intoPiecesContract
        .connect(addr1)
        .royaltyInfo(1, 100)
      expect(royaltyInfo[0]).to.equal(addr2.address)
      expect(royaltyInfo[1].toNumber()).to.equal(5)
    })
  })

  describe('royaltyInfo', function () {
    it('Should return 5% royalty and default royalty receiver (owner)', async function () {
      const royaltyInfo = await intoPiecesContract
        .connect(addr1)
        .royaltyInfo(1, 100)
      expect(royaltyInfo[0]).to.equal(owner.address)
      expect(royaltyInfo[1].toNumber()).to.equal(5)
    })
  })

  describe('supportsInterface', function () {
    const INVALID_ID = '0xffffffff'
    const ERC165_ID = '0x01ffc9a7'

    it('Should return true for ERC 165 id', async function () {
      expect(await intoPiecesContract
        .connect(addr1)
        .supportsInterface(ERC165_ID)).to.equal(true)
    })

    it('Should return false for invalid id', async function () {
      expect(await intoPiecesContract
        .connect(addr1)
        .supportsInterface(INVALID_ID)).to.equal(false)
    })

  })

  ////// Minting //////////
  // safeMint
  // allowedMintCount
  // mintedNFTs
  ////////////////////////

  describe('safeMint', function () {
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

    it('Should be possible to mint NFT with custom price and contract balance has then appropriate amount', async function () {
      const AMOUNT_IN_ETH_TO_SPEND = '0.1'
      const overrides = {
        value: ethers.utils.parseEther(AMOUNT_IN_ETH_TO_SPEND)
      }
      await intoPiecesContract.connect(addr1).safeMint(addr1.address, overrides)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)

      const contractBalance = await ethers.provider.getBalance(
        intoPiecesContract.address
      )
      const contractBalanceETH = ethers.utils.formatEther(contractBalance)
      expect(contractBalanceETH).to.equal(AMOUNT_IN_ETH_TO_SPEND)
    })

    it('Should be possible to mint NFT with zero price and contract balance has then appropriate amount', async function () {
      const AMOUNT_IN_ETH_TO_SPEND = '0.0'

      const overrides = {
        value: ethers.utils.parseEther('0.0')
      }
      await intoPiecesContract.connect(addr1).safeMint(addr1.address, overrides)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)

      const contractBalance = await ethers.provider.getBalance(
        intoPiecesContract.address
      )
      const contractBalanceETH = ethers.utils.formatEther(contractBalance)
      expect(contractBalanceETH).to.equal(AMOUNT_IN_ETH_TO_SPEND)
    })
  })

  describe('allowedMintCount', function () {
    it('allowedMintCount returns how many NFTs is possible to mint on address', async function () {
      expect(await intoPiecesContract.allowedMintCount(addr1.address)).to.equal(
        MINT_LIMIT_PER_WALLET
      )
    })

    it('allowedMintCount returns remaining amount of mints on address after minting', async function () {
      const MINTED_NFTS = 2

      Array.from(
        { length: MINTED_NFTS },
        async () =>
          await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      )

      expect(await intoPiecesContract.allowedMintCount(addr1.address)).to.equal(
        MINT_LIMIT_PER_WALLET - MINTED_NFTS
      )
    })
  })

  describe('mintedNFTs', function () {
    it('mintedNFTs returns 0 if no NFTs was minted', async function () {
      expect(await intoPiecesContract.mintedNFTs()).to.equal(0)
    })

    it('mintedNFTs returns how many NFTs was minted', async function () {
      const MINTED_NFTS = 3

      Array.from(
        { length: MINTED_NFTS },
        async () =>
          await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      )

      expect(await intoPiecesContract.mintedNFTs()).to.equal(MINTED_NFTS)
    })

    it('mintedNFTs should not exceed max supply', async function () {
      // workaround for MAX_SUPPLY 1001
      const amountOfLoops = 72 / 3

      for (let i = 0; i < amountOfLoops; i++) {
        for (let j = 0; j < 3; j++) {
          await intoPiecesContract.connect(addrs[i]).safeMint(addrs[i].address)
        }
      }

      // workaround for MAX_SUPPLY 73
      await intoPiecesContract.connect(addr1).safeMint(addr1.address)

      await expect(
        intoPiecesContract.connect(addr1).safeMint(addr1.address)
      ).to.be.revertedWith('Exceeds max supply')
    })
  })

  /////// Withdraw ////////
  // withdraw
  // withdrawERC20Token
  // checkERC20Balance
  ////////////////////////

  describe('withdraw', function () {
    it('owner can withdraw from contract', async function () {
      const AMOUNT_IN_ETH_TO_SPEND = '0.1'

      const overrides = {
        value: ethers.utils.parseEther('0.1')
      }
      await intoPiecesContract.connect(addr1).safeMint(addr1.address, overrides)
      expect(await intoPiecesContract.ownerOf(0)).to.equal(addr1.address)

      const contractBalance = await ethers.provider.getBalance(
        intoPiecesContract.address
      )
      const contractBalanceETH = ethers.utils.formatEther(contractBalance)
      expect(contractBalanceETH).to.equal(AMOUNT_IN_ETH_TO_SPEND)

      const ownerBalance = await ethers.provider.getBalance(owner.address)

      const txResp = await intoPiecesContract.connect(owner).withdraw()
      const txReceipt = await txResp.wait()
      const withdrawEthFee = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)

      const contractBalanceAfterWithdraw = await ethers.provider.getBalance(
        intoPiecesContract.address
      )
      const contractBalanceETHAfterWithdraw = ethers.utils.formatEther(
        contractBalanceAfterWithdraw
      )
      expect(contractBalanceETHAfterWithdraw).to.equal('0.0')

      const ownerBalanceAfterWithdraw = await ethers.provider.getBalance(
        owner.address
      )

      expect(ownerBalanceAfterWithdraw).to.equal(
        ownerBalance.add(contractBalance).sub(withdrawEthFee)
      )
    })

    it('address which is not owner can not withdraw from contract', async function () {
      await expect(
        intoPiecesContract.connect(addr1).withdraw()
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it("Should revert if there are no Ether to withdraw", async function () {
      await expect(intoPiecesContract.connect(owner).withdraw()).to.be.revertedWith("No Ether available for withdrawal");
    });
  })

  describe('withdrawERC20Token', function () {

    it("Owner should withdraw all ERC20 tokens to a specific address", async function() {
      await intoPiecesContract.connect(owner).withdrawERC20Token(tokenErc20.address, owner.address);
      expect(await tokenErc20.balanceOf(intoPiecesContract.address)).to.equal(0);
      expect(await tokenErc20.balanceOf(owner.address)).to.equal(
        ethers.utils.parseEther("1000")
      );
    });

    it("Should fail if there are no tokens to withdraw", async function () {
      await intoPiecesContract.connect(owner).withdrawERC20Token(tokenErc20.address, owner.address);
      await expect(
        intoPiecesContract.withdrawERC20Token(tokenErc20.address, owner.address)
      ).to.be.revertedWith("No tokens to withdraw");
    });

    it("Should fail if called by non-owner", async function () {
      await expect(
        intoPiecesContract.connect(addr1).withdrawERC20Token(tokenErc20.address, addr1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  })

  describe('checkERC20Balance', function () {
    it("Should return the balance of the ERC20 tokens", async function() {

      const balance = await intoPiecesContract.connect(owner).checkERC20Balance(tokenErc20.address);
      expect(balance).to.equal(ethers.utils.parseEther("1000"));
    });
  })



  /////// Metadata ////////
  // contractURI
  // tokenURI
  ////////////////////////

  describe('contractURI', function () {
    it('contractURI give expected data', async function () {
      const contractUriBase64 = await intoPiecesContract
        .connect(addr1)
        .contractURI()
  
      // substring(29) removing "data:application/json;base64"
      const contractUriJson = Buffer.from(
        contractUriBase64.substring(29),
        'base64'
      ).toString()
      const contractUriObject = {
        name: 'Into Pieces',
        description: 'Test your imagination',
        image:
          'ipfs://bafybeidr3ssynrir4wez5bayz36qxk557irrrkwsplxeq3xdwieysxzlqq',
        external_link: 'https://janmiksik.ooo',
        seller_fee_basis_points: 500,
        fee_recipient: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
      }
      expect(JSON.stringify(JSON.parse(contractUriJson))).to.equal(
        JSON.stringify(contractUriObject)
      )
    })
  })

  describe('tokenURI', function () {
    it('tokenURI give expected data', async function () {
      const tokenURI = await intoPiecesContract.connect(addr1).tokenURI(0)
      const tokenUriObject = {
        name: 'Into Pieces ~0',
        description: 'When we meet, this NFT will be your ticket to a reward. JM',
        image:
          'ipfs://bafybeidr3ssynrir4wez5bayz36qxk557irrrkwsplxeq3xdwieysxzlqq'
      }

      // substring(29) removing "data:application/json;base64"
      const tokenUriJson = Buffer.from(
        tokenURI.substring(29),
        'base64'
      ).toString()

      expect(JSON.stringify(JSON.parse(tokenUriJson))).to.equal(
        JSON.stringify(tokenUriObject)
      )
    })
  })
})
