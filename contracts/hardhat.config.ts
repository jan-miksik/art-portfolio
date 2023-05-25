import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import 'solidity-coverage'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { optimism } from '@wagmi/core/chains';
dotenv.config()

const { TESTNET_PRIVATE_KEY, ALCHEMY_API_KEY,ALCHEMY_API_KEY_ARBITRUM_GOERLI, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, ALCHEMY_API_KEY_MUMBAI, ARBISCAN_API_KEY, ALCHEMY_API_KEY_OPTIMSM_GOERLI } = process.env as Record<string, string>;

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  // {
  //   version: "0.8.16",
  //   compilers: [
  //     {
  //       version: "0.8.16",
  //       settings: {
  //         outputSelection: {
  //           "*": {
  //             "*": ["storageLayout"]
  //           }
  //         }
  //       }
  //     }
  //   ]
  // },
  // solidity: {
  //   version: "0.8.16",
  //   settings: {
  //     outputSelection: {
  //       "*": {
  //         "*": ["storageLayout"],
  //       },
  //     },
  //   },
  // },
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
    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY_ARBITRUM_GOERLI}`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    optimisticGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY_ARBITRUM_GOERLI}`,
      accounts: [TESTNET_PRIVATE_KEY]
    },
    optimisticEthereum: {
      url: 'https://1rpc.io/op'
    },
    'optimism-goerli': {
      url: "https://goerli.optimism.io",
      accounts: [TESTNET_PRIVATE_KEY]
    },
    hardhat: {
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      // },
      accounts: {
        count: 500,
      },
      chainId: 1
    },
  },

  etherscan: {
    apiKey:
    {
        mainnet: ETHERSCAN_API_KEY,
        ropsten: ETHERSCAN_API_KEY,
        rinkeby: ETHERSCAN_API_KEY,
        goerli: ETHERSCAN_API_KEY,
        kovan: ETHERSCAN_API_KEY,
        arbitrumGoerli: ARBISCAN_API_KEY,
        optimisticGoerli: ETHERSCAN_API_KEY,
        optimisticEthereum: ETHERSCAN_API_KEY,
    //     //polygon
    //     polygon: POLYGONSCAN_API_KEY,
    //     polygonMumbai: POLYGONSCAN_API_KEY
    },
    customChains: [
      {
        network: "arbitrumGoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://goerli.arbiscan.io/",
        }
      }
    ]
  },


};

export default config;