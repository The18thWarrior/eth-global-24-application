'use client'

import React, { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack';
import { wagmiAdapter, config, projectId, networks } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { cookieToInitialState, State, WagmiProvider, type Config } from 'wagmi'

import { useTheme } from '@mui/material'
import { ThemeSwitcherProvider } from '@/hooks/useThemeSwitcher';

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Xucre Crypto Index Fund',
  description: 'dApp enabling users to invest in a diversified portfolio of cryptocurrencies',
  url: 'https://fund.xucre.net', // origin must match your domain & subdomain
  icons: ['https://swap.xucre.net/icon-green.png']
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
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
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return null;
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ThemeSwitcherProvider>
            <SnackbarProvider maxSnack={3} >
                {children}
            </SnackbarProvider>
          </ThemeSwitcherProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}