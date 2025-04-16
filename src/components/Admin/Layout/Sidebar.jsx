import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../../Logo/Logo';

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Véhicules', icon: <DirectionsCarIcon />, path: '/admin/vehicles' },
  { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Réservations', icon: <BookOnlineIcon />, path: '/admin/reservations' },
  { text: 'Statistiques', icon: <BarChartIcon />, path: '/admin/reports' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        backgroundColor: '#000000',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        p: 2,
      }}
    >
      <Box sx={{ mb: 4, mt: 2 }}>
        <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <Logo variant="admin" />
        </Link>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,215,0,0.1)', mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundColor: location.pathname === item.path ? 'rgba(255,215,0,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,215,0,0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#FFD700' : 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiListItemText-primary': {
                  color: location.pathname === item.path ? '#FFD700' : 'white',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 20, width: '100%', pr: 4 }}>
        <Divider sx={{ backgroundColor: 'rgba(255,215,0,0.1)', mb: 2 }} />
        <ListItem
          button
          sx={{
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'rgba(255,215,0,0.2)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
