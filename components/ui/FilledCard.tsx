'use client'
import { Card, styled } from "@mui/material"


const FilledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#00872a',
  padding: theme.spacing(2),
  boxShadow: 'none',
  borderRadius: 25,
}));

export default FilledCard