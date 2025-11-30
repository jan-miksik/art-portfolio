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
      const data = await response.json()
      ethToUsdExchangeRate.value = data.ethereum.usd
      return data.ethereum.usd
    } catch (err) {
      return ethToUsdExchangeRate.value
    }
  }

  const getMintPrice = async () => {
    fetchingMintPrice.value = true
    const gasPrice = await getGasPrice(config, {
      chainId: optimism.id,
    })

    const encodedFunctionData = encodeFunctionData({
      abi: IntoPiecesContractAbi,
      functionName: 'safeMint',
      args: [DEMO_USER_ADDRESS],
    })

    const gasEstimate = await estimateGas(config, {
      chainId: optimism.id,
      account: DEMO_USER_ADDRESS,
      to: contractAddress,
      value: parseEther('0'),
      data: encodedFunctionData,
    })
    const ethToUsdRate = await getEthToUsdExchangeRate()
    const feeCostWei = gasPrice * BigInt(gasEstimate)
    const feeCostEth = formatEther(feeCostWei)
    const feeCostUsd = roundUp(parseFloat(feeCostEth) * ethToUsdRate, 1)
    const customPriceUsd = roundUp((requestedPrice.value || 0) * ethToUsdRate, 1)
    const fullPriceUsd = roundUp(feeCostUsd + customPriceUsd, 1)
    fetchingMintPrice.value = false
    mintPrice.value = { feeCostUsd, customPriceUsd, fullPriceUsd }
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
        showErrorNotification(new Error('User rejected the request'))
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
    await loadContractData()
    await getMintPrice()
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

