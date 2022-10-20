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
  }
  return explorers
}
