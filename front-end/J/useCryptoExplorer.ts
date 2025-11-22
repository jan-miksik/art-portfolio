import { mainSupportedChain } from "../appSetup"

export default function useCryptoExplorer() {
  const explorers = {
    goerli: {
      opensea: {
        getAssetLink: (contractAddressAndNftId: string) => `https://testnets.opensea.io/assets/goerli/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionName: string) => `https://testnets.opensea.io/collection/${collectionName}`,
      },
      looksrare: {
        getAssetLink: (contractAddressAndNftId: string) => `https://goerli.looksrare.org/collections/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionName: string) => `https://testnets.opensea.io/collections/${collectionName}`,
      },
      etherscan: { 
        getAssetLink: (contractAddress: string) => `https://goerli.looksrare.org/collections/${contractAddress.toLowerCase()}`,
      },
    },
    arbitrumGoerli: {
      opensea: {
        getAssetLink: (contractAddressAndNftId: string) => `https://testnets.opensea.io/assets/arbitrum-goerli/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionName: string) => `https://testnets.opensea.io/collection/${collectionName}`,
      },
      looksrare: {
        getAssetLink: (contractAddressAndNftId: string) => `https://goerli.looksrare.org/collections/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionName: string) => `https://testnets.opensea.io/collections/${collectionName}`,
      },
      etherscan: { 
        getAssetLink: (contractAddress: string) => `https://goerli.looksrare.org/collections/${contractAddress.toLowerCase()}`,
      },
    },
    optimismGoerli: {
      opensea: {
        getAssetLink: (contractAddressAndNftId: string) => `https://testnets.opensea.io/assets/optimism-goerli/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionName: string) => `https://testnets.opensea.io/collection/${collectionName}`,
      },
      looksrare: {
        getAssetLink: (contractAddressAndNftId: string) => `https://goerli.looksrare.org/collections/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionName: string) => `https://testnets.opensea.io/collections/${collectionName}`,
      },
      etherscan: { 
        getAssetLink: (contractAddress: string) => `https://goerli.looksrare.org/collections/${contractAddress.toLowerCase()}`,
      },
      quix: {
        getAssetLink: (contractAddressAndNftId: string) => `https://testnet.qx.app/asset/${contractAddressAndNftId.toLowerCase()}`,
        getCollectionLink: (collectionContract: string) => `https://testnet.qx.app/collection/${collectionContract}`,
      }
    },
  }

  const getLooksrareCollectionLink = () => {
    if (mainSupportedChain.keyName === 'arbitrumGoerli') {
      const link = explorers[mainSupportedChain.keyName].looksrare.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}`)
      return link
    }

    if (mainSupportedChain.keyName === 'optimismGoerli') {
      const link = explorers[mainSupportedChain.keyName].looksrare.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}`)
      return link
    }
  }

  const getQuixCollectionLink = () => {
    if (mainSupportedChain.keyName === 'optimismGoerli') {
      const link = explorers[mainSupportedChain.keyName].quix.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}`)
      return link
    }
  }
  
  const getLooksrareAssetLink = (nftId: number | string) => {
    if (mainSupportedChain.keyName === 'arbitrumGoerli') {
  
      const link = explorers[mainSupportedChain.keyName].looksrare.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}/${nftId}`)
      return link
    }

    if (mainSupportedChain.keyName === 'optimismGoerli') {
  
      const link = explorers[mainSupportedChain.keyName].looksrare.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}/${nftId}`)
      return link
    }
  }
  
  const getOpenseaCollectionLink = () => {
    if (mainSupportedChain.keyName === 'arbitrumGoerli') {
  
      const link = explorers[mainSupportedChain.keyName].opensea.getCollectionLink(`${mainSupportedChain.nftIntoPiecesCollectionName}`)
      return link
    }

    if (mainSupportedChain.keyName === 'optimismGoerli') {
  
      const link = explorers[mainSupportedChain.keyName].opensea.getCollectionLink(`${mainSupportedChain.nftIntoPiecesCollectionName}`)
      return link
    }
  }

  const getOpenseaAssetLink = (nftId: number | string) => {
    if (mainSupportedChain.keyName === 'arbitrumGoerli') {
  
      const link = explorers[mainSupportedChain.keyName].opensea.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}/${nftId}`)
      return link
    }

    if (mainSupportedChain.keyName === 'optimismGoerli') {
  
      const link = explorers[mainSupportedChain.keyName].opensea.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}/${nftId}`)
      return link
    }
  }

  const getQuixAssetLink = (nftId: number | string) => {
    if (mainSupportedChain.keyName === 'optimismGoerli') {
      const link = explorers[mainSupportedChain.keyName].quix.getAssetLink(`${mainSupportedChain.nftIntoPiecesContract}/${nftId}`)
      return link
    }
  }

  type ExplorerLinkTypes = {
    type: 'asset' | 'collection'
    marketplace: 'looksrare' | 'opensea' | 'quix'
    nftId?: string | number
  }

  const getExplorerLink = ({type, marketplace, nftId}: ExplorerLinkTypes) => {
    if (type === 'asset' && (nftId === 0 || nftId)) {
      switch (marketplace) {
        case 'looksrare':
          return getLooksrareAssetLink(nftId)
        case 'opensea':
          return getOpenseaAssetLink(nftId)
        case 'quix':
          return getQuixAssetLink(nftId)
      }
    }

    if (type === 'collection') {
      switch (marketplace) {
        case 'looksrare':
          return getLooksrareCollectionLink()
        case 'opensea':
          return getOpenseaCollectionLink()
        case 'quix':
          return getQuixCollectionLink()
      }
    }
  }

  return {explorers, getExplorerLink}
}
