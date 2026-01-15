import { ref, computed, watch, onMounted } from 'vue'
import { logger } from '~/utils/logger'
import { IntoPiecesContractAbi } from '~/abi/IntoPieces'
import { switchChain, getGasPrice, estimateGas, writeContract } from '@wagmi/vue/actions'
import { config } from '~/config'
import { encodeFunctionData, formatEther, parseEther, getContract } from 'viem'
import type { Address } from 'viem'
import { createPublicClient, http } from 'viem'
import { optimism } from 'viem/chains'
import { useAppKit } from '@reown/appkit/vue'
import type { IChain } from '~/constants/chains'
import { useAccount } from '@wagmi/vue'
import { DEMO_USER_ADDRESS } from '~/constants/blockchain'
import useErrorNotification from '~/J/useErrorNotification'

const roundUp = (num: number, decimals: number) => Math.ceil(num * 10 ** decimals) / 10 ** decimals

export const useCollection = (chain: IChain) => {
  const requestedPrice = ref<number>()
  const mintInProgress = ref(false)
  const isMinted = ref(false)
  const maxSupply = ref<number>()
  const mintLimitExceeded = ref(false)
  const mintedNfts = ref<number>()
  const mintPrice = ref<{ feeCostUsd: number; customPriceUsd: number; fullPriceUsd: number }>()
  const fetchingMintPrice = ref(false)
  const ethToUsdExchangeRate = ref<number>()
  const modal = ref<ReturnType<typeof useAppKit>>()
  const isContinueMintAfterConnect = ref(false)

  const account = useAccount()
  const { showErrorNotification } = useErrorNotification()

  const contractAddress = chain.nftIntoPiecesContract as Address
  const client = createPublicClient({
    chain: optimism,
    transport: http(),
  })
  const contract = getContract({
    address: contractAddress,
    abi: IntoPiecesContractAbi,
    client,
  })

  const nftId = computed(() => (mintedNfts.value ? Number(mintedNfts.value) - 1 : 0))
  const fullMintPrice = computed(() => {
    const hasRequestedPrice = requestedPrice.value || requestedPrice.value === 0
    if (fetchingMintPrice.value && hasRequestedPrice) {
      return '...'
    }
    if (hasRequestedPrice) {
      return mintPrice.value?.fullPriceUsd
    }
    return '?'
  })

  const openseaAssetLink = computed(() => {
    return `https://opensea.io/assets/${chain.keyName}/${chain.nftIntoPiecesContract}/${nftId.value}`
  })

  const openseaCollectionLink = computed(() => {
    return `https://opensea.io/collection/${chain.nftIntoPiecesCollectionName}`
  })

  const getEthToUsdExchangeRate = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rate: ${response.status}`)
      }
      const data = await response.json()
      if (data?.ethereum?.usd) {
        ethToUsdExchangeRate.value = data.ethereum.usd
        return data.ethereum.usd
      }
      throw new Error('Invalid exchange rate response format')
    } catch (err) {
      logger.error('Failed to fetch ETH to USD exchange rate:', err)
      // Return previously cached value if available
      return ethToUsdExchangeRate.value
    }
  }

  const getMintPrice = async () => {
    fetchingMintPrice.value = true
    try {
      const gasPrice = await getGasPrice(config, {
        chainId: optimism.id,
      })

      // Use connected account address if available, otherwise use demo address
      // For gas estimation, we need an address that can mint (or at least simulate the call)
      const estimateAddress = (account.address.value || DEMO_USER_ADDRESS) as Address
      const mintRecipient = estimateAddress // The address that will receive the NFT in the mint call
      
      const encodedFunctionData = encodeFunctionData({
        abi: IntoPiecesContractAbi,
        functionName: 'safeMint',
        args: [mintRecipient],
      })

      let gasEstimate: bigint
      try {
        // Try to estimate gas with the address
        // The 'account' field is who's paying for gas, 'to' field is the contract
        // The args in encodedFunctionData specify who receives the NFT
        // Include requestedPrice in value for accurate gas estimation
        const estimatedValue = requestedPrice.value !== undefined && requestedPrice.value !== null
          ? parseEther(requestedPrice.value.toString())
          : parseEther('0')
        
        gasEstimate = await estimateGas(config, {
          chainId: optimism.id,
          account: estimateAddress,
          to: contractAddress,
          value: estimatedValue,
          data: encodedFunctionData,
        })
      } catch (estimateError) {
        // Check if this is an execution revert (address can't mint)
        const errorMessage = (estimateError as Error)?.message?.toLowerCase() || ''
        const errorName = (estimateError as any)?.name || ''
        const causedBy = (estimateError as any)?.cause
        const causedByMessage = causedBy?.message?.toLowerCase() || ''
        const causedByName = causedBy?.name || ''
        
        const isExecutionRevert = 
          errorName.includes('ExecutionReverted') ||
          errorName.includes('EstimateGasExecutionError') ||
          errorMessage.includes('execution reverted') ||
          causedByName.includes('ExecutionReverted') ||
          causedByMessage.includes('execution reverted')
        
        if (isExecutionRevert) {
          // Address can't mint or simulation reverted.
          // Use a reasonable default gas estimate so price can still be shown.
          // Typical NFT mint uses around 150k-200k gas, using 180k as a safe estimate.
          gasEstimate = 180000n
        } else {
          // Other error (network, RPC, etc.) - throw it
          throw estimateError
        }
      }

      const ethToUsdRate = await getEthToUsdExchangeRate()
      if (!ethToUsdRate) {
        throw new Error('Failed to fetch ETH to USD exchange rate')
      }
      const feeCostWei = gasPrice * BigInt(gasEstimate)
      const feeCostEth = formatEther(feeCostWei)
      const feeCostUsd = roundUp(parseFloat(feeCostEth) * ethToUsdRate, 1)
      const customPriceUsd = roundUp((requestedPrice.value || 0) * ethToUsdRate, 1)
      const fullPriceUsd = roundUp(feeCostUsd + customPriceUsd, 1)
      mintPrice.value = { feeCostUsd, customPriceUsd, fullPriceUsd }
    } catch (error) {
      // Check if this is an execution revert error
      const errorMessage = (error as Error)?.message?.toLowerCase() || ''
      const errorName = (error as any)?.name || ''
      const causedBy = (error as any)?.cause
      const causedByMessage = causedBy?.message?.toLowerCase() || ''
      const causedByName = causedBy?.name || ''
      
      const isExecutionRevert = 
        errorName.includes('ExecutionReverted') ||
        errorName.includes('EstimateGasExecutionError') ||
        errorMessage.includes('execution reverted') ||
        causedByName.includes('ExecutionReverted') ||
        causedByMessage.includes('execution reverted')
      
      if (isExecutionRevert) {
        // Address can't mint - silently fail, user will see "?" for price
        return
      }
      
      // Log other errors (network issues, RPC failures, etc.)
      logger.error('Failed to fetch mint price:', error)
      // Silently fail - user can still mint, they just won't see the price estimate
    } finally {
      fetchingMintPrice.value = false
    }
  }

  const mintAction = async () => {
    if (!account.address.value) {
      throw new Error('No account address')
    }
    try {
      const resultHash = await writeContract(config, {
        abi: IntoPiecesContractAbi,
        address: contractAddress,
        functionName: 'safeMint',
        args: [account.address.value],
        value: parseEther(requestedPrice.value!.toString()),
      })
      await client.waitForTransactionReceipt({
        hash: resultHash,
      })
      return true
    } catch (error) {
      mintInProgress.value = false
      const context = 'useCollection.mintAction'
      if (!(error as Error)?.message) {
        showErrorNotification(new Error('Unexpected mint error'), context)
        return false
      }

      const message = (error as Error)?.message ?? ''
      if (
        message?.toLowerCase()?.startsWith('err: insufficient funds') ||
        (error as any).data?.message?.startsWith('err: insufficient funds')
      ) {
        showErrorNotification(new Error('insufficient funds for transaction'), context)
        return false
      }

      if ((error as any)?.message?.toLowerCase()?.startsWith('user rejected')) {
        showErrorNotification(new Error('User rejected the request'), context)
        return false
      }

      showErrorNotification(error, context)
      return false
    }
  }

  const getMintedNFTs = async () => {
    return contract.read.mintedNFTs()
  }

  const handleMintNFT = async (event?: Event) => {
    event?.preventDefault()
    modal.value = useAppKit()

    if (!account.address.value) {
      isContinueMintAfterConnect.value = true
      modal.value?.open()
      return
    }
    isContinueMintAfterConnect.value = false

    if (Number(account.chainId) !== chain.chainIdDec) {
      await switchChain(config, { chainId: chain.chainIdDec as typeof optimism.id })
    }

    isMinted.value = false
    mintInProgress.value = true
    const confirmation = await mintAction()
    mintInProgress.value = false
    if (confirmation) {
      requestedPrice.value = undefined
      const mintedCount = await getMintedNFTs()
      mintedNfts.value = Number(mintedCount ?? 0)
      isMinted.value = true
    }
  }

  const checkMintingLimit = async () => {
    if (account?.address.value) {
      const remainingMints = await contract.read.allowedMintCount([account.address.value])
      mintLimitExceeded.value = Number(remainingMints) === 0
    }
  }

  const loadContractData = async () => {
    try {
      const maxSupplyResult = await contract.read.MAX_SUPPLY()
      const mintedNftsResult = await getMintedNFTs()
      maxSupply.value = Number(maxSupplyResult ?? 0)
      mintedNfts.value = Number(mintedNftsResult ?? 0)
      await checkMintingLimit()
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Detailed error:', error.message)
      }
    }
  }

  watch(requestedPrice, async () => {
    await getMintPrice()
  })

  watch(
    () => account.address.value,
    async (newVal) => {
      if (newVal && isContinueMintAfterConnect.value) {
        await handleMintNFT()
      }
    },
    { immediate: true },
  )

  onMounted(async () => {
    try {
      await loadContractData()
    } catch (error) {
      logger.error('Failed to load contract data:', error)
      showErrorNotification(error, 'useCollection.loadContractData')
    }

    try {
      await getMintPrice()
    } catch (error) {
      logger.error('Failed to get mint price on mount:', error)
      // Error is already handled in getMintPrice, but we catch here to prevent unhandled promise rejection
    }
  })

  return {
    requestedPrice,
    mintInProgress,
    isMinted,
    maxSupply,
    mintedNfts,
    mintLimitExceeded,
    fullMintPrice,
    openseaAssetLink,
    openseaCollectionLink,
    handleMintNFT,
  }
}

