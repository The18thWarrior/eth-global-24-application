'use client'
import { useRouter } from "next/navigation";
import { getTextColor } from "@/services/theme";
import { useTheme } from "@mui/material";
import { Box, Grid2 as Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";
import { IndexFund, useIndexFunds } from "@/hooks/useIndexFunds";
import PortfolioCard from "@/components/indexFunds/PortfolioCard";
import WalletNotConnected from "@/components/ui/WalletNotConnected";
import { chainValidation, normalizeDevChains } from "@/services/helpers";
//import { usePaidPlanCheck } from "@/hooks/usePaidPlanCheck";

// components/LoadingIndicator.tsx
export default function IndexFunds() {
  const theme = useTheme();
  const textColor = getTextColor(theme);
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);
  const [selectedFund, setSelectedFund] = useState(null as IndexFund | null);
  const { isConnected, address, chainId } = useAccount();
  const { indexFunds } = useIndexFunds({ chainId: normalizeDevChains(chainId) });
  //const { isSubscribed } = usePaidPlanCheck();


  useEffect(() => {
    if (selectedFund) { 
      const data = selectedFund.name;
      router.push(`/index-funds/${data}`);
    }
    //console.log(indexFunds);
  }, [selectedFund])

  if (!isConnected) return <WalletNotConnected />;
  //if (!chainValidation(chainId)) return <WalletNotConnected />;
  return (
    <Box pb={4}>
      <Stack justifyContent={'center'} alignItems={'center'}>
      </Stack>
      <Grid container spacing={4} p={5}>
        {indexFunds.map((fund) => (
          <Grid size={{ xs: 10, md: 4 }} offset={{ md: 0, xs: 1 }} key={`${fund.name}:${fund.chainId}`}>
            <PortfolioCard
              color={fund.color}
              title={fund.name}
              sourceLogo={''}
              subtitle={fund.cardSubtitle}
              image={fund.imageSmall}
              onclick={() => setSelectedFund(fund)}
            />
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};