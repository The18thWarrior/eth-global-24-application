import Image from "next/image";
import styles from "./page.module.css";
import { Box, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Stack direction={'column'} spacing={2} alignItems={'center'} justifyContent={'center'} minHeight={'50vh'}> 
      <Typography variant="h3" textAlign={'center'}>Xucre Index Funds</Typography>
    </Stack>
  );
}
