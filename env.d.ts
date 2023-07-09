import { declare } from './.nuxt/types/imports';
declare global {
  interface Window {
    ethereum?: any;
  }
}
interface Window {
  ethereum: import('ethers').providers.ExternalProvider | any;
  contract: any;
  contractReadOnly: any;
  jsonRpcProvider: any;
  ethers: any;
  contractStpReadOnly: any;
}
