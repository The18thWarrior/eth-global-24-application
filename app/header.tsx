'use client'
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, AppBar, Box, Button, Toolbar, Stack, Divider, Drawer, IconButton, Menu, MenuItem, ButtonGroup } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu as MenuIcon, LightMode, DarkMode } from '@mui/icons-material'
import { useAccount, useDisconnect } from 'wagmi';
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher';
import SocialIcons from '@/components/ui/SocialIcons';
import { getTextColor } from '@/services/theme';
import AccountButton from '@/components/ui/AccountButton';


const drawerWidth = 240;
function Header() {
  const searchParams = useSearchParams()
  const navItems = [
    'Home',
    'Index Funds'
  ];
  const wallet = searchParams.get('wallet');
  const page = searchParams.get('page');
  const router = useRouter();
  const theme = useTheme();
  const textColor = getTextColor(theme);
  const themeSwitcher = useThemeSwitcher();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const [mobileOpen, setMobileOpen] = useState(false);
  const url = 'xucre.expo.client://ViewWallet';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isDarkTheme = theme.palette.mode === 'dark';
  const handleModeChange = () => {
    themeSwitcher();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goBack = () => {
    window.location.assign(url);
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleUserOpen = (event: React.MouseEvent<HTMLButtonElement>) => { }

  const navigateTo = (type) => {
    if (type === 'Index Fund') {
      router.replace('/index-fund')
    } else if (type === 'Home') {
      router.replace('/')
    }
  }


  const headerButton = (
    <Button variant="text" onClick={() => router.push('/')} >
      <Stack direction={'row'} spacing={2} alignItems={'center'} justifyContent={'center'}>
        <img src={'/icon.png'} className="side-image" alt="menuLogo" />
        {/*<Typography color={theme.palette.mode === 'dark' ? 'white' : 'black'} textTransform={'none'} fontSize={24} fontWeight={'400'} ></Typography>*/}
      </Stack>
    </Button>
  );

  const Social = () => (
    <SocialIcons discordUrl={'https://discord.gg/F4gaehZ7'} emailUrl={'mailto:support@xucre.io'} twitterUrl={'https://x.com/WalletXucre'} githubUrl={null} instagramUrl={null} governanceUrl={null} websiteUrl={'https://linktr.ee/xucrewallet'} gitbookUrl={null} />
  );

  const drawer = (
    <Stack direction={'column'} justifyContent={'space-between'} alignItems={'center'} spacing={2} onClick={handleDrawerToggle} sx={{ textAlign: 'center', zIndex: 100000, height: '95vh' }}>
      <Box width={'100%'}>
        {headerButton}
        <Divider />

        {<Stack direction={'row'} my={2} justifyItems={'center'} alignContent={'center'} mx={'auto'} display={'block'} width={'fit-content'}>
          <AccountButton />
        </Stack>}
        

      </Box>
      <Stack direction={'column'} spacing={2} width={'100%'} alignItems={'center'}>

        <IconButton
          color={theme.palette.mode === 'dark' ? 'warning' : 'info'}
          aria-label="change theme"
          edge="start"
          onClick={handleModeChange}
          sx={{ ml: 2, }}
        >
          {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>

        <Social />
      </Stack>
    </Stack>
  );

  return (
    <div>
      {wallet !== 'xucre' &&
        <AppBar component="nav" position="relative" color={'transparent'} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 'none', borderBottom: '1px solid', borderBottomColor: 'GrayText', mb: { xs: 0, sm: 0 } }}>
          <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>

            <Box sx={{}}>
              {headerButton}
            </Box>
            <Stack direction={'row'} sx={{}} alignContent={'end'} justifyContent={'end'}>
              <Box sx={{}}>
              </Box>
              <IconButton
                color={theme.palette.mode === 'dark' ? 'warning' : 'info'}
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' }, }}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {
                  <AccountButton />
                }

                <IconButton
                  color={theme.palette.mode === 'dark' ? 'warning' : 'info'}
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleMenuOpen}
                  sx={{ ml: 2, display: { xs: 'block', sm: 'none' }, }}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {navItems.map((item) => (
                    <MenuItem onClick={() => navigateTo(item)} key={item}>{item}</MenuItem>
                  ))}
                </Menu>
              </Box>

            </Stack>

          </Toolbar>
          {theme.palette.mode === 'light' && <Divider />}
        </AppBar>
      }

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          zIndex: 10000,
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </div>

  );
}
// 
export default Header;