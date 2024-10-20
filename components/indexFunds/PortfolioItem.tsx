'use client'
import { Avatar, Divider, Link, ListItem, ListItemAvatar, ListItemText, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import { type PriceData, type PortfolioItem, useFundItem } from '@/hooks/useIndexFunds';
import { useEffect, useState } from "react";
import React from "react";
//import AccountButton from "./accountButton";

const DEFAULT_LOGO = "/icon-green.png"
// components/LoadingIndicator.tsx
export default function PortfolioItem({portfolioItem, price, openItem, showDivider, sourceToken} : { sourceToken: PortfolioItem, portfolioItem: PortfolioItem, price: PriceData, showDivider: boolean, openItem: (item: PortfolioItem) => () => void }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const {poolKey, isFetched, syncState, doesPoolExist} = useFundItem({token: portfolioItem, source: sourceToken});

  useEffect(() => {
    if (isFetched) {
      console.log('Fetched pool key', poolKey)
    }
  }, [isFetched])
  return (
    <span key={portfolioItem.address} >
      <ListItem alignItems="flex-start">
        <ListItemAvatar onClick={openItem(portfolioItem)} sx={{ cursor: 'pointer' }}>
          <Avatar alt={portfolioItem.name} src={portfolioItem.logo} >
            <Avatar alt={portfolioItem.name} src={price?.logo} >
              <Avatar alt={portfolioItem.name} src={DEFAULT_LOGO} />
            </Avatar>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body1"
                sx={{ color: 'text.primary', display: 'inline', fontWeight: 'bold' }}
              >
                {portfolioItem.name} -
              </Typography>
              <Typography
                component="span"
                variant="body1"
                sx={{ color: 'text.primary', display: 'inline', pl: 1 }}
              >
                ({price && price.items[0].price ? `$${price.items[0].price.toFixed(2)}` : 'N/A'})
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                {portfolioItem.description}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      {showDivider && <Divider variant="inset" component="li" />}
    </span>
  );
};
