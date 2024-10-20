'use client'
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack, Typography, useTheme } from '@mui/material';
import { FundButton } from '@coinbase/onchainkit/fund';
import { Wallet, WalletDefault } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import CoinbaseButton from './CoinbaseButton';

const projectId = 'ac8b42b9-7cf5-40c3-bb73-bc928a1964f5';

const OnRamp = ({ showBalance = true }) => {
  const { address } = useAccount();
  const theme = useTheme();
  //const [instance, setGatefiInstance] = useState<any>(null);

  useEffect(() => {    
  },[])

  useEffect(() => {
    if (!address) return;
    //let _instance = null;
    //if (instance) {

    //}
    return () => {
    }
  }, [address])

  return (
    <Box>
        {<FundButton openIn={'popup'} disabled={false}/>}
        
      
    </Box>
  )
}

export default OnRamp;

//<FundButton openIn={'popup'} disabled={false}/>