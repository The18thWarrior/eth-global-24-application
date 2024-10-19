import { Stack, Typography } from "@mui/material";
import OpaqueCard from "../ui/OpaqueCard";


export default function BuyItem() {

  return (
    <OpaqueCard>
      <Stack direction={'column'} spacing={2} width={'100%'}>
        <Typography variant="h6">Buy</Typography>
        <Typography variant="body1">Buy this index fund</Typography>
      </Stack>
    </OpaqueCard>
  )
}