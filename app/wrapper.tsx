'use client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import Header from './header';
import { Box, CssBaseline } from '@mui/material';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { Suspense } from 'react';
import { ThemeSwitcherProvider } from '@/hooks/useThemeSwitcher';
import {sepolia} from 'wagmi/chains';
import Footer from './footer';
//import { TokenListProvider } from '@/hooks/useTokenList';

export default function Wrapper({
  children
}: {
  children: React.ReactNode;
}) {
  
  return (
    <Box mb={10}>
      <ThemeSwitcherProvider>
          <Suspense >
            <CssBaseline />
            <Header />
            {children}
            <Footer />
          </Suspense>
      </ThemeSwitcherProvider>
    </Box>
  );
}

