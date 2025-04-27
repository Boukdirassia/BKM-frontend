import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon, color, trend, percentage }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#000',
      color: 'white',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '4px',
        backgroundColor: color,
      }
    }}
  >
    <Box sx={{ mr: 2, color: color }}>
      {icon}
    </Box>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        {title}
      </Typography>
    </Box>
    {trend && (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        {trend === 'up' ? (
          <TrendingUpIcon sx={{ color: '#4CAF50', mr: 0.5 }} />
        ) : (
          <TrendingDownIcon sx={{ color: '#F44336', mr: 0.5 }} />
        )}
        <Typography 
          variant="body2" 
          sx={{ 
            color: trend === 'up' ? '#4CAF50' : '#F44336',
            fontWeight: 'bold'
          }}
        >
          {percentage}%
        </Typography>
      </Box>
    )}
  </Paper>
);

// Composant pour le statut des réservations
const ReservationStatus = ({ status }) => {
  let color = '#FFC107';
  let icon = <AccessTimeIcon fontSize="small" />;
  let label = 'En attente';

  if (status === 'confirmed') {
    color = '#4CAF50';
    icon = <CheckCircleIcon fontSize="small" />;
    label = 'Confirmée';
  } else if (status === 'cancelled') {
    color = '#F44336';
    icon = <CancelIcon fontSize="small" />;
    label = 'Annulée';
  }

  return (
    <Chip 
      icon={icon}
      label={label}
      size="small"
      sx={{ 
        backgroundColor: color + '20', 
        color: color,
        fontWeight: 'bold',
        '& .MuiChip-icon': {
          color: color
        }
      }}
    />
  );
};

// Données pour les véhicules populaires
const popularVehicles = [
  { id: 1, name: 'Tesla Model S', image: 'https://placehold.co/50', rentCount: 42 },
  { id: 2, name: 'BMW X5', image: 'https://placehold.co/50', rentCount: 38 },
  { id: 3, name: 'Mercedes C-Class', image: 'https://placehold.co/50', rentCount: 35 },
  { id: 4, name: 'Audi A4', image: 'https://placehold.co/50', rentCount: 29 },
];

// Données pour les réservations récentes
const recentReservations = [
  { id: 1, customer: 'Jean Dupont', vehicle: 'Tesla Model S', date: '20/04/2025', amount: '€120', status: 'confirmed' },
  { id: 2, customer: 'Marie Martin', vehicle: 'BMW X5', date: '19/04/2025', amount: '€95', status: 'pending' },
  { id: 3, customer: 'Pierre Durand', vehicle: 'Audi A4', date: '18/04/2025', amount: '€85', status: 'confirmed' },
  { id: 4, customer: 'Sophie Leroy', vehicle: 'Mercedes C-Class', date: '17/04/2025', amount: '€110', status: 'cancelled' },
  { id: 5, customer: 'Lucas Bernard', vehicle: 'Renault Clio', date: '16/04/2025', amount: '€65', status: 'confirmed' },
];

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Gestion des menus
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  return (
    <Box>
      {/* En-tête du tableau de bord */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#000', fontWeight: 'bold' }}>
          Tableau de bord
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={timeFilter}
              onChange={handleTimeFilterChange}
              label="Période"
            >
              <MenuItem value="day">Aujourd'hui</MenuItem>
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton 
            color="primary" 
            aria-label="notifications"
            onClick={handleNotificationOpen}
          >
            <NotificationsIcon />
          </IconButton>
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 }
            }}
          >
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Nouvelle réservation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jean Dupont a réservé une Tesla Model S
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Annulation de réservation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sophie Leroy a annulé sa réservation
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Nouvel utilisateur
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lucas Bernard vient de s'inscrire
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* Alertes */}
      <Alert 
        severity="warning" 
        sx={{ mb: 4, borderRadius: 2 }}
        action={
          <Button color="inherit" size="small">
            VOIR
          </Button>
        }
      >
        3 véhicules nécessitent une maintenance programmée
      </Alert>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Véhicules disponibles"
            value="24"
            icon={<DirectionsCarIcon sx={{ fontSize: 40 }} />}
            color="#FFD700"
            trend="up"
            percentage="8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs actifs"
            value="156"
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#4CAF50"
            trend="up"
            percentage="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations"
            value="38"
            icon={<BookOnlineIcon sx={{ fontSize: 40 }} />}
            color="#2196F3"
            trend="down"
            percentage="5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenus"
            value="€9,840"
            icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
            color="#F44336"
            trend="up"
            percentage="15"
          />
        </Grid>
      </Grid>

      {/* Réservations récentes et véhicules populaires */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Réservations récentes" 
              action={
                <>
                  <IconButton aria-label="settings" onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>Voir toutes les réservations</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Exporter en CSV</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Filtrer</MenuItem>
                  </Menu>
                </>
              }
              sx={{ 
                '& .MuiCardHeader-title': { 
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }
              }}
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Véhicule</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.customer}</TableCell>
                      <TableCell>{reservation.vehicle}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.amount}</TableCell>
                      <TableCell>
                        <ReservationStatus status={reservation.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text" color="primary">
                Voir toutes les réservations
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Véhicules populaires" 
              sx={{ 
                '& .MuiCardHeader-title': { 
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }
              }}
            />
            <Divider />
            <CardContent>
              <List>
                {popularVehicles.map((vehicle) => (
                  <ListItem key={vehicle.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={vehicle.image} variant="rounded" />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={vehicle.name} 
                      secondary={`${vehicle.rentCount} locations`}
                    />
                    <Chip 
                      label={`#${popularVehicles.indexOf(vehicle) + 1}`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#FFD70020', 
                        color: '#FFD700',
                        fontWeight: 'bold'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text" color="primary">
                Voir tous les véhicules
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
