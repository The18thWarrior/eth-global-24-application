'use client'

import '@rainbow-me/rainbowkit/styles.css';
import React, { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack';
import { wagmiAdapter, config, projectId, networks, networks1, useWagmiConfig } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { cookieToInitialState, State, WagmiProvider, type Config } from 'wagmi'
import { OnchainKitProvider, OnchainKitConfig } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'viem/chains';

import { useTheme } from '@mui/material'
import { ThemeSwitcherProvider } from '@/hooks/useThemeSwitcher';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Xucre Crypto Index Fund',
  description: 'dApp enabling users to invest in a diversified portfolio of cryptocurrencies',
  url: 'https://fund.xucre.net', // origin must match your domain & subdomain
  icons: ['https://swap.xucre.net/icon-green.png']
}
const baseChain = {
  id: base.id, name: base.name, nativeCurrency:base.nativeCurrency, rpcUrls: base.rpcUrls
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks1,
  defaultNetwork: polygon,
  metadata: metadata,
  themeMode: 'dark',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export function ContextProvider({
  children,
  cookies
}: {
  children: ReactNode
  cookies?: string | null
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const wagmiConfig = useWagmiConfig();
  const initialState = cookieToInitialState(wagmiConfig, cookies)
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return null;
  return (
    <ThemeSwitcherProvider>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY} chain={baseChain}> 
            <RainbowKitProvider modalSize="compact">
              <SnackbarProvider maxSnack={3} >
                  {children}
              </SnackbarProvider>
            </RainbowKitProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeSwitcherProvider>
  )
}