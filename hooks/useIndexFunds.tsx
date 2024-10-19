import { useEffect, useMemo, useState } from "react";
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { type BaseError, useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi } from "viem";
import XucreETF from "@/public/XucreIndexFunds.json";
import { getAddress, TransactionReceipt, zeroAddress } from "viem";
import { useSnackbar } from 'notistack';
import { config } from "@/config";
import { distributeWeights, normalizeDevChains } from "@/services/helpers";

export type PortfolioItem = {
  name: string;
  chainId: number;
  address: string;
  weight: number;
  description: string;
  logo: string;
  active: boolean;
  poolFee: number;
  decimals: number;
  chain_logo: string;
  chartColor: string;
  links: string[];
  sourceFees: {
    [key: string]: number;
  };
}

export type PriceItem = {
  date: string,
  price: number,
  prettyPrice: string,
};

export type PriceData = {
  items: PriceItem[],
  chainId: number,
  chainName: string,
  address: string,
  lastModified: number,
  logo: string,
  decimals: number,
  name: string,
  symbol: string,
  currency: string,
}

export type IndexFund = {
  name: string;
  cardSubtitle: string;
  description: string;
  image: string;
  imageSmall: string;
  color: string;
  chainId: number;
  custom: boolean | undefined;
  sourceToken: PortfolioItem | undefined;
  portfolio: PortfolioItem[]
};

const initialSourceTokens = [] as PortfolioItem[];
const initialFunds = [{
  "name": "Classic Fund",
  "cardSubtitle": "A curated selection of foundational assets",
  "description": "Explore 'The Classics' index fund on Polygon, featuring a curated selection of foundational cryptocurrencies: Bitcoin (BTC), Ethereum (ETH), Solana (SOL). This fund offers a robust investment option, focusing on well-established digital assets with proven track records. Perfect for those seeking stability within the volatile crypto market.",
  "image": "/classics.png",
  "imageSmall": "/classics-low.png",
  "chainId": 8453,
  "color": "#00872a",
  "custom": false,
  "sourceToken": undefined,
  "portfolio": [
    {
      "name": "WBTC",
      "address": "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      "chainId": 8453,
      "weight": 3400,
      "poolFee": 3000,
      "active": true,
      "decimals": 18,
      "sourceFees": {
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": 3000,
        "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": 3000
      },
      "chartColor": "#FFD700",
      "description": "Wrapped Bitcoin (cbBTC) is an ERC20 token pegged to the price of Bitcoin.",
      "logo": "https://xucre-public.s3.sa-east-1.amazonaws.com/btc.png",
      "chain_logo": "https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=24.9.2.0",
      "links": ["https://www.centre.io/usdc"]
    },
    {
      "name": "WETH",
      "address": "0x4200000000000000000000000000000000000006",
      "chainId": 8453,
      "weight": 3300,
      "poolFee": 3000,
      "active": true,
      "decimals": 18,
      "sourceFees": {
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": 3000,
        "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": 500
      },
      "chartColor": "#627EEA",
      "description": "WETH is the native token for the Ethereum blockchain.",
      "logo": "https://xucre-public.s3.sa-east-1.amazonaws.com/eth.png",
      "chain_logo": "https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=24.9.2.0",
      "links": ["https://weth.io/"]
    },
    {
      "name": "AERO",
      "address": "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
      "chainId": 8453,
      "weight": 3300,
      "poolFee": 3000,
      "active": true,
      "decimals": 18,
      "sourceFees": {
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": 3000,
        "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": 3000
      },
      "chartColor": "#9945FF",
      "description": "AERO is a cryptocurrency token used on the Base network.",
      "logo": "https://basescan.org/token/images/aerodrome_32.png",
      "chain_logo": "https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=24.9.2.0",
      "links": ["https://portalbridge.com/"]
    },
    {
      "name": "Mantra",
      "address": "0x3992B27dA26848C2b19CeA6Fd25ad5568B68AB98",
      "chainId": 8453,
      "weight": 909,
      "poolFee": 500,
      "active": true,
      "decimals": 18,
      "sourceFees": {
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": 500,
        "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": 3000
      },
      "chartColor": "#FFD700",
      "description": "Matic Token is a cryptocurrency token used on the Polygon network.",
      "logo": "https://basescan.org/token/images/mantradao_base_32.png",
      "chain_logo": "https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=24.9.2.0",
      "links": ["https://polygon.technology/"]
    }
  ]
} as IndexFund] as IndexFund[];
const contractAddressMap = {
  1: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETH,
  137: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
};

//console.log(initialFunds[0].portfolio.reduce((acc, item) => acc + item.weight, 0))
export function useIndexFunds({ chainId }: { chainId: number }) {
  const [indexFunds, setIndexFunds] = useState(initialFunds.filter((item) => item.chainId === chainId));
  const [sourceTokens, setSourceTokens] = useState(initialSourceTokens.find((item) => item.chainId === chainId && item.active));

  useEffect(() => {
    setIndexFunds(initialFunds.filter((item) => item.chainId === chainId));
    setSourceTokens(initialSourceTokens.find((item) => item.chainId === chainId && item.active));
  }, [chainId])

  return useMemo(
    () => ({ indexFunds, sourceTokens }),
    [chainId, indexFunds, sourceTokens],
  );
}

export function useConnectedIndexFund({ fund }: { fund: IndexFund }) {
  const { isConnected, address, chainId, chain } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [sourceToken, setSourceToken] = useState(initialSourceTokens.find((item) => item.chainId === normalizeDevChains(chainId) && item.active));
  const [confirmationHash, setConfirmationHash] = useState('');
  const { data: hash, error, writeContractAsync, isPending, status, } = useWriteContract()
  const { data: sourceBalance, refetch: balanceRefetch } = useReadContract({
    address: sourceToken ? getAddress(sourceToken.address) : zeroAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: false }
  })

  const { data: sourceAllowance, refetch: allowanceRefetch } = useReadContract({
    address: sourceToken ? getAddress(sourceToken.address) : zeroAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address, contractAddressMap[chainId]],
    query: { enabled: false }
  })

  const confirmedTransaction = useWaitForTransactionReceipt({
    hash: confirmationHash as `0x${string}`
  });

  const approveContract = async (amount: BigInt) => {
    setIsLoading(true);
    try {
      //console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, amount)
      const result = await writeContract(config, {
        abi: erc20Abi,
        address: getAddress(sourceToken.address),
        functionName: 'approve',
        chainId,
        args: [
          contractAddressMap[chainId],
          BigInt(amount.toString()),
        ],
        chain,
        account: address
      })
      const receipt = await waitForTransactionReceipt(config, { hash: result });
      const receipt2 = receipt as TransactionReceipt;
      if (receipt2.status === 'success') {
        enqueueSnackbar(`Transaction Successful:`, { variant: 'success', autoHideDuration: 5000 });
        await initiateSpot(amount);
      } else {
        enqueueSnackbar(`Error`, { variant: 'error', autoHideDuration: 5000 });
        setIsLoading(false);
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error', autoHideDuration: 5000 });
      setIsLoading(false);
    }

    //console.log(result);
    //setIsLoading(false);

    //return 'success';
  }

  const initiateSpot = async (amount: BigInt) => {
    //const runSwap = await xucre.spotExecution(signerAddress, [ethers.utils.getAddress(DAI), ethers.utils.getAddress(WBTC), UNI_CONTRACT.address], [6000, 2000, 2000], [3000, 3000, 3000], USDT_CONTRACT.address, balanceUSDT.div(100));
    try {
      setIsLoading(true);
      const portfolio = fund.portfolio.filter((item) => item.active);
      const tokenAllocations = distributeWeights(portfolio);
      const tokenAddresses = portfolio.map((item) => getAddress(item.address));
      //const tokenAllocations = portfolio.map((item) => item.weight);
      const tokenPoolFees = portfolio.map((item) => item.sourceFees[sourceToken.address] ? item.sourceFees[sourceToken.address] : item.poolFee);
      const result = await writeContractAsync({
        abi: XucreETF.abi,
        address: getAddress(contractAddressMap[chainId]),
        functionName: 'spotExecution',
        args: [
          address,
          tokenAddresses,
          tokenAllocations,
          tokenPoolFees,
          getAddress(sourceToken.address),
          amount
        ],
        chain: chain,
        account: address
      })
      enqueueSnackbar(`Transaction Successful:: ${result}`, { variant: 'success', autoHideDuration: 5000 });
      setConfirmationHash(result);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      enqueueSnackbar(err.message, { variant: 'error', autoHideDuration: 5000 });
    }
  }

  useEffect(() => {
    const runAsync = async () => {
      setIsLoading(true);
      await allowanceRefetch()
      await balanceRefetch()
      //await getPrices();
      setIsLoading(false);
    }

    if (!isPending && status === 'success') {
      //runAsync()
    }
  }, [isPending, status])


  useEffect(() => {
    const runAsync = async () => {
      setIsLoading(true);
      await allowanceRefetch()
      await balanceRefetch()
      //await getPrices();
      setIsLoading(false);
    }

    if (confirmationHash.length > 0) {
      runAsync()
    }
  }, [confirmedTransaction])

  useEffect(() => {
    const runAsync = async () => {
      //setIsLoading(true);
      await allowanceRefetch()
      await balanceRefetch()
      //await getPrices();
      //setIsLoading(false);
    }
    if (isConnected && address && sourceToken) {
      //console.log('reloading balances');
      runAsync()
    }
  }, [isConnected, address, sourceToken])

  useEffect(() => {
    if (error && error as BaseError) {
      const err = error as BaseError;
      console.log(err.details);
    }
  }, [error])

  useEffect(() => {
    setSourceToken(initialSourceTokens.find((item) => item.chainId === normalizeDevChains(chainId) && item.active));
  }, [chainId]);

  const loading = isLoading || isPending;

  return { balance: sourceBalance, allowance: sourceAllowance, sourceToken, sourceTokens: initialSourceTokens.filter((token) => token.chainId === normalizeDevChains(chainId)), setSourceToken, approveContract, initiateSpot, hash, error, loading, status, confirmationHash }
}