import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  InputBase, 
  Box, 
  Badge, 
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Chip,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationOpen = (event) => {
    setNotificationEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: 'calc(100% - 280px)', 
        ml: '280px',
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar sx={{ minHeight: '70px' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#000', 
              display: { xs: 'none', sm: 'block' },
              mr: 3
            }}
          >
            <span style={{ color: '#FFD700' }}>BKM</span> Admin
          </Typography>
          
          <Box
            sx={{
              position: 'relative',
              backgroundColor: '#f8f9fa',
              borderRadius: 3,
              marginRight: 2,
              width: '300px',
              border: '1px solid #eee',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                backgroundColor: '#fff',
              },
            }}
          >
            <Box sx={{ padding: '0 16px', height: '100%', position: 'absolute', display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ color: '#888' }} />
            </Box>
            <InputBase
              placeholder="Rechercher..."
              sx={{
                color: '#000',
                padding: '10px 10px 10px 48px',
                width: '100%',
                '& input': {
                  color: '#000',
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>
          
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<FilterListIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#666',
              '&:hover': {
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.04)',
              }
            }}
          >
            Filtres
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label="Pro" 
            size="small" 
            sx={{ 
              backgroundColor: '#FFD700', 
              color: '#000', 
              fontWeight: 'bold',
              height: 24,
              mr: 1
            }} 
          />
          
          <Tooltip title="Centre d'aide">
            <IconButton size="medium" sx={{ color: '#666' }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              size="medium" 
              sx={{ 
                color: '#666',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
              onClick={handleNotificationOpen}
            >
              <Badge 
                badgeContent={4} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    height: 16,
                    minWidth: 16,
                    padding: '0 4px'
                  }
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={notificationEl}
            open={Boolean(notificationEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: { 
                width: 320, 
                maxHeight: 400,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                mt: 1.5,
                '& .MuiList-root': {
                  p: 1,
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Notifications
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleNotificationClose} sx={{ borderRadius: 1, mb: 0.5, mt: 0.5 }}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Nouvelle réservation
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Il y a 5 min
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Jean Dupont a réservé une Tesla Model S
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotificationClose} sx={{ borderRadius: 1, mb: 0.5, mt: 0.5 }}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Annulation de réservation
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Il y a 2h
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Sophie Leroy a annulé sa réservation
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                size="small" 
                sx={{ 
                  textTransform: 'none',
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                Voir toutes les notifications
              </Button>
            </Box>
          </Menu>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: '#eee' }} />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              borderRadius: 2,
              p: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              }
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                backgroundColor: '#000',
                border: '2px solid #FFD700',
                color: '#FFD700',
                fontWeight: 'bold',
              }}
            >
              A
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold', lineHeight: 1.2 }}>
                Admin User
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', lineHeight: 1 }}>
                admin@bkm.com
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: '#666', fontSize: 18 }} />
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: { 
                width: 220,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                mt: 1.5,
                '& .MuiList-root': {
                  p: 1,
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mon profil
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Paramètres
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose} sx={{ borderRadius: 1, color: '#f44336' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#f44336' }} />
              </ListItemIcon>
              Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
