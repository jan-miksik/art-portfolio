import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const { TESTNET_PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, ALCHEMY_API_KEY_MUMBAI } = process.env as Record<string, string>;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/nb-YwxwyUOGDasmXNXHBeahPYcmUJExd`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY_MUMBAI}`,
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
    apiKey:
    {
    //     //ethereum
        mainnet: ETHERSCAN_API_KEY,
        ropsten: ETHERSCAN_API_KEY,
        rinkeby: ETHERSCAN_API_KEY,
        goerli: ETHERSCAN_API_KEY,
        kovan: ETHERSCAN_API_KEY,             
    //     //polygon
    //     polygon: POLYGONSCAN_API_KEY,
    //     polygonMumbai: POLYGONSCAN_API_KEY
    }
  }
};

export default config;