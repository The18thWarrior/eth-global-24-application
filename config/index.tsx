import { cookieStorage, createConfig, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, celo, type AppKitNetwork, polygon, sepolia } from '@reown/appkit/networks'
import { base, baseSepolia } from 'wagmi/chains';
import { defineChain, http } from 'viem';
import { Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const customChain = defineChain({
  id: 19819,
  name: 'Test Sandbox',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.buildbear.io/vicious-goose-bfec7fbe'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://explorer.buildbear.io/vicious-goose-bfec7fbe/',
    },
  },
  testnet: true,
})
export const networks = [mainnet, polygon, sepolia, celo, base, baseSepolia, customChain]
export const networks1 = [mainnet, polygon, sepolia, celo, base, baseSepolia, customChain] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  connectors: [
    /*coinbaseWallet({
      appName: 'onchainkit',
    }),*/
  ],
  ssr: true,
  projectId,
  networks: networks1,
  transports: {
    [sepolia.id]: http(), 
    [baseSepolia.id]: http(), 
    [base.id]: http(), 
  },
})

export const config = wagmiAdapter.wagmiConfig;
export function useWagmiConfig() {
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [walletConnectWallet, rainbowWallet, metaMaskWallet],
        },
      ],
      {
        appName: 'onchainkit',
        projectId,
      },
    );
    const chains = [{...base} as Chain, {...baseSepolia} as Chain];
    const wagmiConfig = createConfig({
      chains: [{id: base.id, name: base.name, nativeCurrency: base.nativeCurrency, rpcUrls: base.rpcUrls}, {id: baseSepolia.id, name: baseSepolia.name, nativeCurrency: baseSepolia.nativeCurrency, rpcUrls: baseSepolia.rpcUrls}],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}