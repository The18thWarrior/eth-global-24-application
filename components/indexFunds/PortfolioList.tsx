'use client'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { PortfolioItem as PortfolioItemType, PriceData } from '@/hooks/useIndexFunds';
import PortfolioItem  from './PortfolioItem';

const DEFAULT_LOGO = "/icon-green.png"

export default function PortfolioItemList({ portfolioItems, priceMap, sourceToken }: { sourceToken: PortfolioItemType,portfolioItems: PortfolioItemType[], priceMap: { [key: string]: PriceData } }) {
  const openItem = (item: PortfolioItemType) => () => {
    window.open(`https://polygonscan.com/address/${item.address}`, '_blank');
  }
  return (
    
      <List sx={{
        maxWidth: { xs: 360, sm: '100%' },
        bgcolor: '',
        my: 4,
        //maxHeight: { xs: null, sm: 400 },
        overflowY: 'auto',
      }}>
        {portfolioItems.filter((item) => item.active).map((item, i) => {
          const price = priceMap[item.address.toLowerCase()];
          
          return (
            <PortfolioItem key={item.address} sourceToken={sourceToken} portfolioItem={{...item}} price={price} showDivider={i < portfolioItems.length - 1} openItem={openItem}/>
          )
        })}
      </List>
   
  );
}