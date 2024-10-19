'use client'
import { Stack, useMediaQuery, useTheme } from "@mui/material"
//import AccountButton from "./accountButton";
import CoinbaseButton from "@/components/coinbase/CoinbaseButton";
// components/LoadingIndicator.tsx
export default function WalletNotConnected() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Stack justifyContent={'center'} alignItems={'center'} my={10}>
      {/*<Typography color={theme.palette.mode === 'dark' ? 'white' : 'gray'} my={3}>{languageData[language].ui.address_not_found}</Typography>*/}
      {
        <CoinbaseButton />
      }
    </Stack>
  );
};
