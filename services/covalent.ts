'use server'

import { PriceData, PriceItem } from '@/hooks/useIndexFunds';
import { GoldRushClient } from '@covalenthq/client-sdk';
import dayjs from 'dayjs';

const covalent = new GoldRushClient(process.env.COVALENT_API_KEY);

const chainNames = {
  84532 : 'base-mainnet', //'base-sepolia-testnet',
  8453: 'base-mainnet'
}

const callTokenPrice = async (addresses: string[], chainId: number) => {
  const resp = await covalent.PricingService.getTokenPrices(
    chainNames[chainId],
    "USD",
    addresses.join(","),
    {
      from: dayjs().subtract(30, "d").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    }
  );
  return resp;
};

export const getTokenPrices = async (addresses, chainId) => {
  const prices = await callTokenPrice(addresses, chainId);
  const _tokenPrices = prices.data.map((tokenPrice) => {
    return {
      items: tokenPrice.items.map((item) => {
        return {
          price: item.price,
          date: item.date.toISOString(),
          prettyPrice: item.pretty_price,

        } as PriceItem;
      }),
      chainId: chainId,
      chainName: chainNames[chainId],
      address: tokenPrice.contract_address.toLowerCase(),
      lastModified: dayjs().unix(),
      logo: tokenPrice.logo_url,
      decimals: tokenPrice.contract_decimals,
      name: tokenPrice.contract_name,
      symbol: tokenPrice.contract_ticker_symbol,
      currency: tokenPrice.quote_currency,
    } as PriceData;
  });
  return _tokenPrices;
}