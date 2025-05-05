import React, { useState, useEffect } from 'react';
import { voitureService, clientService, reservationService } from '../../../services';
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
const StatCard = ({ title, value, icon, color }) => (
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
    {/* Tendances et pourcentages supprimés */}
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



const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // États pour stocker les données récupérées
  const [vehicles, setVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState(0);
  const [clients, setClients] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  // Fonction pour calculer les véhicules populaires
  const calculatePopularVehicles = (allReservations, allVehicles) => {
    // Compter les occurrences de chaque véhicule dans les réservations
    const vehicleCounts = {};
    allReservations.forEach(reservation => {
      const vehicleId = reservation.VoitureID;
      if (vehicleId) {
        vehicleCounts[vehicleId] = (vehicleCounts[vehicleId] || 0) + 1;
      }
    });
    
    // Convertir en tableau et trier par nombre de réservations
    const sortedVehicles = Object.keys(vehicleCounts)
      .map(id => {
        const vehicle = allVehicles.find(v => v.VoitureID === parseInt(id));
        if (!vehicle) return null;
        
        // Déterminer le nom du véhicule en utilisant les champs disponibles
        // Vérifier toutes les variantes possibles du nom de champ "Modèle"
        const marque = vehicle.Marque || 'Marque inconnue';
        const modele = vehicle.Modele || vehicle.Modèle || vehicle.modele || vehicle.modèle || 'Modèle inconnu';
        
        // Pour débogage
        console.log('Véhicule trouvé:', vehicle);
        
        return {
          id: vehicle.VoitureID,
          name: `${marque} ${modele}`,
          image: 'https://placehold.co/50', // Placeholder pour l'image
          rentCount: vehicleCounts[id]
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.rentCount - a.rentCount)
      .slice(0, 4); // Prendre les 4 premiers
    
    return sortedVehicles;
  };
  
  // Fonction pour formater les réservations récentes
  const formatRecentReservations = (allReservations, allClients, allVehicles) => {
    // Obtenir le mois et l'année actuels
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filtrer les réservations du mois en cours
    const currentMonthReservations = allReservations.filter(reservation => {
      const reservationDate = new Date(reservation.DateDébut);
      return reservationDate.getMonth() === currentMonth && 
             reservationDate.getFullYear() === currentYear;
    });
    
    console.log(`Réservations filtrées pour le mois ${currentMonth + 1}/${currentYear}:`, currentMonthReservations.length);
    
    return currentMonthReservations
      .map(reservation => {
        const client = allClients.find(c => c.UserID === reservation.ClientID);
        const vehicle = allVehicles.find(v => v.VoitureID === reservation.VoitureID);
        
        if (!client || !vehicle) return null;
        
        // Calculer le montant en fonction des dates et du prix journalier
        let amount = 0;
        try {
          const startDate = new Date(reservation.DateDébut);
          const endDate = new Date(reservation.DateFin);
          
          // Vérifier que les dates sont valides
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
            const prix = parseFloat(vehicle.PrixJournalier) || parseFloat(vehicle.Prix) || 0;
            amount = days * prix;
          }
          
          // Débogage détaillé pour identifier le champ de prix
          console.log('Véhicule complet:', vehicle);
          console.log('Propriétés du véhicule:', Object.keys(vehicle));
          console.log('Valeurs de prix possibles:', {
            Prix: vehicle.Prix,
            PrixJournalier: vehicle.PrixJournalier,
            prix: vehicle.prix,
            prixJournalier: vehicle.prixJournalier,
            price: vehicle.price,
            dailyPrice: vehicle.dailyPrice
          });
        } catch (error) {
          console.error('Erreur lors du calcul du montant:', error);
        }
        
        // Déterminer le nom du véhicule
        const marque = vehicle.Marque || 'Marque inconnue';
        const modele = vehicle.Modele || vehicle.Modèle || vehicle.modele || vehicle.modèle || 'Modèle inconnu';
        
        return {
          id: reservation.ResID,
          customer: `${client.Prenom} ${client.Nom}`,
          vehicle: `${marque} ${modele}`,
          date: new Date(reservation.DateDébut).toLocaleDateString(),
          // Essayer tous les noms de champs possibles pour le prix
          amount: `${parseFloat(vehicle.Prix) || 
                    parseFloat(vehicle.PrixJournalier) || 
                    parseFloat(vehicle.prix) || 
                    parseFloat(vehicle.prixJournalier) || 
                    parseFloat(vehicle.price) || 
                    parseFloat(vehicle.dailyPrice) || 
                    0} DH/jour`,
          status: reservation.Statut === 'Confirmée' ? 'confirmed' : 
                  reservation.Statut === 'Annulée' ? 'cancelled' : 'pending'
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  // Fonction pour calculer le revenu total
  const calculateTotalRevenue = (allReservations, allVehicles) => {
    return allReservations.reduce((total, reservation) => {
      if (reservation.Statut === 'Confirmée') {
        const vehicle = allVehicles.find(v => v.VoitureID === reservation.VoitureID);
        if (vehicle) {
          const startDate = new Date(reservation.DateDébut);
          const endDate = new Date(reservation.DateFin);
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          return total + (days * vehicle.PrixJournalier);
        }
      }
      return total;
    }, 0);
  };

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
    // Recharger les données avec le nouveau filtre
    loadDashboardData(event.target.value);
  };
  
  // Fonction pour charger toutes les données du tableau de bord
  const loadDashboardData = async (filter = 'month') => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer toutes les voitures
      const vehiclesData = await voitureService.getAllVoitures();
      setVehicles(vehiclesData);
      
      // Récupérer les voitures disponibles
      const availableVehiclesData = await voitureService.getAvailableVoitures();
      setAvailableVehicles(availableVehiclesData.length);
      
      // Récupérer tous les clients
      const clientsData = await clientService.getAllClients();
      setClients(clientsData);
      
      // Récupérer toutes les réservations
      const reservationsData = await reservationService.getAllReservations();
      
      // Filtrer les réservations selon la période sélectionnée
      const filteredReservations = filterReservationsByTime(reservationsData, filter);
      setReservations(filteredReservations);
      
      // Calculer les véhicules populaires
      const popular = calculatePopularVehicles(filteredReservations, vehiclesData);
      setPopularVehicles(popular);
      
      // Formater les réservations récentes
      const recent = formatRecentReservations(filteredReservations, clientsData, vehiclesData);
      setRecentReservations(recent);
      
      // Calculer le revenu total
      const revenue = calculateTotalRevenue(filteredReservations, vehiclesData);
      setTotalRevenue(revenue);
      
    } catch (err) {
      console.error('Erreur lors du chargement des données du tableau de bord:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour filtrer les réservations selon la période
  const filterReservationsByTime = (reservations, filter) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Dimanche comme début de semaine
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    let startDate;
    
    switch (filter) {
      case 'day':
        startDate = startOfDay;
        break;
      case 'week':
        startDate = startOfWeek;
        break;
      case 'year':
        startDate = startOfYear;
        break;
      case 'month':
      default:
        startDate = startOfMonth;
        break;
    }
    
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.DateDébut);
      return reservationDate >= startDate;
    });
  };
  
  // Charger les données au chargement du composant
  useEffect(() => {
    loadDashboardData(timeFilter);
  }, []);  // Dépendance vide pour ne charger qu'une fois au montage

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
      
      {/* Espace pour les alertes - supprimé */}
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Véhicules disponibles"
            value={loading ? "..." : availableVehicles}
            icon={<DirectionsCarIcon sx={{ fontSize: 40 }} />}
            color="#FFD700"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Utilisateurs actifs"
            value={loading ? "..." : clients.length}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Réservations"
            value={loading ? "..." : reservations.length}
            icon={<BookOnlineIcon sx={{ fontSize: 40 }} />}
            color="#2196F3"
          />
        </Grid>
      </Grid>

      {/* Réservations récentes et véhicules populaires */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Réservations du mois en cours" 
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">Chargement des données...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">{error}</TableCell>
                    </TableRow>
                  ) : recentReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">Aucune réservation trouvée</TableCell>
                    </TableRow>
                  ) : (
                    recentReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.customer}</TableCell>
                        <TableCell>{reservation.vehicle}</TableCell>
                        <TableCell>{reservation.date}</TableCell>
                        <TableCell>{reservation.amount}</TableCell>
                        <TableCell>
                          <ReservationStatus status={reservation.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                {loading ? (
                  <ListItem>
                    <ListItemText primary="Chargement des données..." />
                  </ListItem>
                ) : error ? (
                  <ListItem>
                    <ListItemText primary={error} />
                  </ListItem>
                ) : popularVehicles.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="Aucun véhicule trouvé" />
                  </ListItem>
                ) : (
                  popularVehicles.map((vehicle) => (
                    <ListItem key={vehicle.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={vehicle.image} variant="rounded" />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={vehicle.name} 
                        secondary={`${vehicle.rentCount} location${vehicle.rentCount > 1 ? 's' : ''}`}
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
                  ))
                )}
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
