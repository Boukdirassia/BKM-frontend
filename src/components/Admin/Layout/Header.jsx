import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: 'calc(100% - 280px)', 
        ml: '280px',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              marginRight: 2,
              width: '300px',
            }}
          >
            <Box sx={{ padding: '0 16px', height: '100%', position: 'absolute', display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ color: '#666' }} />
            </Box>
            <InputBase
              placeholder="Rechercher..."
              sx={{
                color: '#000',
                padding: '8px 8px 8px 48px',
                width: '100%',
                '& input': {
                  color: '#000',
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="large" sx={{ color: '#000' }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#000' }}>
              Admin
            </Typography>
            <IconButton size="large" sx={{ color: '#000' }}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
