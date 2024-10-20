'use client'
import { getTextColor } from "@/services/theme";
import { Divider, useTheme } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useAccount, useConnections } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useConnectedIndexFund, useIndexFunds, PriceData } from "@/hooks/useIndexFunds";
import WalletNotConnected from "@/components/ui/WalletNotConnected";
import PortfolioItemList from "@/components/indexFunds/PortfolioList";
import { getTokenPrices } from "@/services/covalent";
//import { BuyItem } from "@/components/portfolio/buyItem";
import { chainValidation, normalizeDevChains } from "@/services/helpers";
import React from "react";
import OpaqueCard from "@/components/ui/OpaqueCard";
import BuyItem from "@/components/indexFunds/BuyItem";

export default function IndexFundItem({ params }: { params: { slug: string } }) {
  const theme = useTheme();
  const slugString = params.slug as string;
  const textColor = getTextColor(theme);
  const { isConnected, chainId, isConnecting, isReconnecting } = useAccount();
  const { indexFunds } = useIndexFunds({ chainId: normalizeDevChains(chainId) });
  const _indexFund = indexFunds.find((fund) => {
    return encodeURIComponent(fund.name) === slugString || normalizeDevChains(chainId) === fund.chainId;
  });
  const { balance, allowance, hash, error, loading, confirmationHash, approveContract, initiateSpot, sourceToken, sourceTokens, setSourceToken, status } = useConnectedIndexFund({ fund: _indexFund });
  const [amount, setAmount] = useState<BigInt>(BigInt(0));
  const [rawAmount, setRawAmount] = useState<string>('');
  const [priceData, setPriceData] = useState([] as PriceData[]);
  const [priceMap, setPriceMap] = useState({} as { [key: string]: PriceData });
  const getPrices = async () => {
    const addresses = _indexFund.portfolio.map((item) => item.address);
    const _chainId = normalizeDevChains(chainId);
    console.log('chainId', _chainId)
    const prices = await getTokenPrices(addresses, _chainId);
    try {
      setPriceData(prices as PriceData[]);
      const _priceMap = prices.reduce((acc, price) => {
        return { ...acc, [price.address.toLowerCase()]: price }
      }, {});
      setPriceMap(_priceMap);
    } catch (err) {
      console.log(err.message);
    }

  }

  useEffect(() => {
    if (chainId && _indexFund) getPrices();
  }, [chainId, _indexFund])

  const handleAmountUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawAmount(event.target.value);
    setAmount(parseUnits(event.target.value, sourceToken.decimals));
  }

  const handleApproval = () => {
    console.log('Approving');
    approveContract(amount);
  }

  const handleSpot = () => {
    initiateSpot(amount);
  }
  const allowanceString = allowance ? formatUnits(allowance as bigint, sourceToken.decimals) : 0;
  const allowanceAmount = allowance ? (allowance as BigInt) <= amount : true;

  const PortfolioDescription = () => (
    <Stack direction={'column'} spacing={2}>
      <Typography variant={'h5'} color={textColor} textAlign={'center'}>{_indexFund.name}</Typography>
      <Typography variant={'body1'} color={textColor}>{_indexFund.description}</Typography>
    </Stack>
  )
  
  useEffect(() => {
    console.log('sourceToken', sourceToken)
  }, [sourceToken])

  if (!isConnected && !isConnecting && !isReconnecting) {
    return <WalletNotConnected />
  }

  if (_indexFund === undefined || !sourceToken) return <></>;
  return (
    <Box mt={{ xs: 0, sm: 4 }} pb={4}>

      <Stack direction={'row'} mt={2} mx={2} spacing={2} justifyContent={'space-evenly'} alignItems={'start'} sx={{ display: { md: 'flex', xs: 'none' } }}>
        <OpaqueCard>
          <Stack maxWidth={'50vw'} direction={'column'} justifyContent={'center'} alignItems={'center'}>
            <PortfolioDescription />
            <PortfolioItemList sourceToken={sourceToken} portfolioItems={_indexFund.portfolio} priceMap={priceMap} />
          </Stack>
        </OpaqueCard>
        <Box maxWidth={'50vw'}>
          {<BuyItem />}
        </Box>

      </Stack>

      <Stack direction={'column'} m={2} spacing={4} justifyContent={'center'} alignItems={'center'} sx={{ display: { md: 'none', xs: 'flex' } }}>
        <PortfolioDescription />
        <PortfolioItemList sourceToken={sourceToken} portfolioItems={_indexFund.portfolio} priceMap={priceMap} />
        <Divider sx={{ color: textColor, width: '80vw' }} />

        {<BuyItem />}
      </Stack>
    </Box>
  );
};