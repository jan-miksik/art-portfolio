import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

const ALCHEMY_API_KEY = "Z-XTlpT7I0aI3a4rdfMPn3nTCvEoZhw_";
const ETHERSCAN_API_KEY = 'ZN8W2V9X1SI4BHUU32TZKRI3MKM3I3MRG5'

const TESTNET_PRIVATE_KEY = "17719d0728205e7bf995c2472b3af71e1cb348d58386760d9bb3ffd367e7131f";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/nb-YwxwyUOGDasmXNXHBeahPYcmUJExd`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      },
      chainId: 1
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};

export default config;