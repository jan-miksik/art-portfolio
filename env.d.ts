import { declare } from './.nuxt/types/imports';

/**
 * EIP-1193 Ethereum Provider interface
 * Standard interface for Ethereum providers (MetaMask, WalletConnect, etc.)
 */
interface EIP1193Provider {
  isMetaMask?: boolean
  request(args: { method: string; params?: unknown[] }): Promise<unknown>
  on(event: string, handler: (...args: unknown[]) => void): void
  removeListener(event: string, handler: (...args: unknown[]) => void): void
}

declare global {
  interface Window {
    /**
     * EIP-1193 compatible Ethereum provider
     * Available when MetaMask or other Web3 wallets are installed
     */
    ethereum?: EIP1193Provider
  }
}
