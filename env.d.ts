interface Window {
  ethereum: import('ethers').providers.ExternalProvider | any;
  contract: any;
  contractReadOnly: any;
  jsonRpcProvider: any;
  ethers: any;
}