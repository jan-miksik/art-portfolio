import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { IntoPieces } from '../typechain-types';

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

///// Metadata //////
// contractURI
// tokenURI




const MINT_LIMIT_PER_WALLET = 7
const MAX_SUPPLY = 1000

describe('Into pieces NFT test', function () {
  let IntoPieces,
    intoPiecesContract: IntoPieces,
    owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress,
    addrs: SignerWithAddress[]
  beforeEach(async function () {
    IntoPieces = await ethers.getContractFactory('IntoPieces')
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    intoPiecesContract = await IntoPieces.deploy()
  })

  ////////////////////////
  // deployment
  ////////////////////////
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await intoPiecesContract.owner()).to.equal(owner.address)
    })

    it('Should have max supply 1000', async () => {
      expect(await intoPiecesContract.MAX_SUPPLY()).to.equal(1000)
    })

    it('Should have mint limit per wallet 7', async () => {
      expect(await intoPiecesContract.MINT_LIMIT_PER_WALLET()).to.equal(7)
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
      const MINTED_NFTS = 3

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
      const MINTED_NFTS = 5

      Array.from(
        { length: MINTED_NFTS },
        async () =>
          await intoPiecesContract.connect(addr1).safeMint(addr1.address)
      )

      expect(await intoPiecesContract.mintedNFTs()).to.equal(MINTED_NFTS)
    })

    it('mintedNFTs should not exceed max supply', async function () {
      const amountOfLoops = MAX_SUPPLY / 5

      for (let i = 0; i < amountOfLoops; i++) {
        for (let j = 0; j < 5; j++) {
          await intoPiecesContract.connect(addrs[i]).safeMint(addrs[i].address)
        }
      }

      await expect(
        intoPiecesContract.connect(addr1).safeMint(addr1.address)
      ).to.be.revertedWith('Exceeds max supply')
    })
  })

  /////// Withdraw ////////
  // withdraw
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
          'ipfs://bafkreifivloyeuiky6ozz7w7uke2lb2amutsu4bnb76i2pv4hdqvv7uv4i',
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
        name: 'Into Pieces @0',
        description: '',
        image:
          'ipfs://bafkreifivloyeuiky6ozz7w7uke2lb2amutsu4bnb76i2pv4hdqvv7uv4i'
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
