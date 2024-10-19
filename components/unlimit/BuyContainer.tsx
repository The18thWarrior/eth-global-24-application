'use client'
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import {GateFiSDK, GateFiDisplayModeEnum} from '@gatefi/js-sdk';
import { Stack, useTheme } from '@mui/material';
import { useAccount } from 'wagmi';

const BuyContainer = ({ showBalance = true }) => {
  const { address } = useAccount();
  const theme = useTheme();
  const [instance, setGatefiInstance] = useState<GateFiSDK>(null);

  useEffect(() => {
    /*const unlimitModule = new GateFiSDK({
        merchantId: "testID",
        displayMode: GateFiDisplayModeEnum.Embedded,
        nodeSelector: "#container",
        isSandbox: true,
    })*/
    
  })

  useEffect(() => {
    if (!address) return;
    let _instance = null;
    //if (instance) {
    _instance = new GateFiSDK({
      merchantId: process.env.NEXT_PUBLIC_UNLIMIT_ACCESS_KEY,
      displayMode: GateFiDisplayModeEnum.Embedded,
      nodeSelector: "#container",
      walletAddress: address,
      isSandbox: true,
      hideBrand: true,
      hideThemeSwitcher: true
    })
    _instance.setThemeType(theme.palette.mode === 'light' ? 'light' : 'dark');
    setGatefiInstance(_instance);

    //}
    return () => {
      if (_instance) {
        _instance.destroy();
      }
      if (instance) {
        instance.destroy();
      }
    }
  }, [address])

  return (
    <Box>
      <Stack direction={'row'} width={'full'} justifyContent={'center'} alignItems={'center'} id="container"></Stack>
    </Box>
  )
}

export default BuyContainer;

