import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  Alert,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LuggageIcon from '@mui/icons-material/Luggage';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { cars } from '../../data/cars';

const extras = [
  {
    id: 'professional-driver',
    name: 'Conducteur professionnel',
    description: 'Un chauffeur expérimenté à votre service',
    price: 500,
    icon: DirectionsCarIcon,
    priceUnit: 'jour'
  },
  {
    id: 'limited-mileage',
    name: 'Kilométrage illimité',
    description: '200 km par jour inclus',
    price: 0,
    icon: SpeedIcon,
    priceUnit: 'jour'
  },
  {
    id: 'second-driver',
    name: '2ème conducteur',
    description: 'Ajoutez un conducteur supplémentaire',
    price: 100,
    icon: SupervisorAccountIcon,
    priceUnit: 'jour'
  },
  {
    id: 'baby-chair',
    name: 'Chaise de bébé',
    description: 'Siège auto homologué et adapté',
    price: 30,
    icon: ChildCareIcon,
    priceUnit: 'jour'
  }
];

const steps = ['DÉPART & RETOUR', 'VÉHICULE', 'EXTRAS', 'CONFIRMATION'];

const locations = [
  'Aéroport Mohammed V - Casablanca',
  'Aéroport Marrakech Menara',
  'Agence Centre-ville - Rabat',
  'Agence Tanger City Center',
  'Agence Agadir - Marina',
  'Aéroport Fès-Saïs',
];

const RecapSection = ({ selectedVehicle, departureInfo, arrivalInfo }) => {
  const calculateDays = (dateDepart, dateRetour) => {
    if (!dateDepart || !dateRetour) return 0;
    const start = new Date(dateDepart);
    const end = new Date(dateRetour);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePrice = (days, vehiculeId) => {
    const vehicle = cars.featured.find(car => car.id === vehiculeId);
    return vehicle ? days * vehicle.price : 0;
  };

  const numberOfDays = calculateDays(departureInfo.date, arrivalInfo.date);
  const totalPrice = selectedVehicle ? selectedVehicle.price * numberOfDays : 0;

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#1a1a1a', borderRadius: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          Résumé de votre réservation
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#888' }}>
          RÉCAPITULATIF DE RÉSERVATION
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
          Informations de départ
        </Typography>
        <Box sx={{ ml: 2, color: '#888' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Lieu</Typography>
          <Typography sx={{ mb: 2 }}>{departureInfo.location}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Date & Heure</Typography>
          <Typography>{departureInfo.date}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
          Informations d'arrivée
        </Typography>
        <Box sx={{ ml: 2, color: '#888' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Location</Typography>
          <Typography sx={{ mb: 2 }}>{arrivalInfo.location}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Date & Heure</Typography>
          <Typography>{arrivalInfo.date}</Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a', mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>Libellé</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>Nb. jrs/hrs</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>Prix</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedVehicle && (
              <>
                <TableRow>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                    {selectedVehicle.name.toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                    {numberOfDays} jrs
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                    <Box>
                      {selectedVehicle.price} /jr
                      <br />
                      0 /h
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                    {numberOfDays * selectedVehicle.price}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} sx={{ color: '#666', borderBottom: '1px solid #333', fontSize: '0.85em', py: 1 }}>
                    {numberOfDays} jrs × {selectedVehicle.price} = {numberOfDays * selectedVehicle.price}
                  </TableCell>
                </TableRow>
              </>
            )}
            {/* Options supplémentaires */}
            <TableRow>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ color: 'red', mr: 1 }}>✕</Box>
                  Conducteur professionnel
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>-</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                <Box>
                  200 /jr
                  <br />
                  0 /h
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>600</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ color: 'red', mr: 1 }}>✕</Box>
                  Kilométrage limité à 200 km par jour
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>1</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>/jour</TableCell>
              <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'white',
        mb: 3,
        px: 2,
        py: 1
      }}>
        <Typography sx={{ fontWeight: 'bold' }}>Total : {totalPrice + 600} MAD</Typography>
      </Box>
    </Box>
  );
};

const RecapTable = ({ headers, rows, total }) => (
  <Box sx={{ width: '100%', overflow: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ 
              color: 'rgba(255,255,255,0.7)',
              padding: '8px 12px',
              textAlign: index === 0 ? 'left' : 'right',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={{ 
                color: 'white',
                padding: '8px 12px',
                textAlign: cellIndex === 0 ? 'left' : 'right',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(255,255,255,0.03)'
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {total && (
        <tfoot>
          <tr>
            <td colSpan={headers.length - 1} style={{ 
              textAlign: 'right',
              padding: '12px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              Total:
            </td>
            <td style={{ 
              textAlign: 'right',
              padding: '12px',
              color: '#2196F3',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              {total} MAD
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  </Box>
);

const DepartRetour = ({ formData, setFormData, error }) => (
  <>
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}
    <Grid container spacing={4}>
      {/* Informations de départ */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Informations de départ
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Date et heure de départ"
                type="datetime-local"
                value={formData.dateDepart}
                onChange={(e) => setFormData({ ...formData, dateDepart: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Lieu de prise en charge</InputLabel>
                <Select
                  value={formData.lieuDepart}
                  label="Lieu de prise en charge"
                  onChange={(e) => setFormData({ ...formData, lieuDepart: e.target.value })}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Informations d'arrivée */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Informations d'arrivée
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Date et heure de retour"
                type="datetime-local"
                value={formData.dateRetour}
                onChange={(e) => setFormData({ ...formData, dateRetour: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Lieu de retour</InputLabel>
                <Select
                  value={formData.lieuRetour}
                  label="Lieu de retour"
                  onChange={(e) => setFormData({ ...formData, lieuRetour: e.target.value })}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </>
);

const Vehicule = ({ formData, setFormData, error }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all'
  });

  // Get unique vehicle types
  const types = ['all', ...new Set(cars.featured.map(car => car.type))];
  
  // Define price ranges
  const priceRanges = [
    { value: 'all', label: 'Tous les prix' },
    { value: '0-300', label: 'Moins de 300 DH' },
    { value: '300-500', label: 'Entre 300 et 500 DH' },
    { value: '500+', label: 'Plus de 500 DH' }
  ];

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setFormData({ ...formData, vehicule: car.id });
  };

  const filteredCars = cars.featured.filter(car => {
    if (filters.type !== 'all' && car.type !== filters.type) return false;
    
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        if (car.price < min || car.price > max) return false;
      } else {
        if (car.price < min) return false;
      }
    }
    
    return true;
  });

  const calculateDays = (dateDepart, dateRetour) => {
    if (!dateDepart || !dateRetour) return 0;
    const start = new Date(dateDepart);
    const end = new Date(dateRetour);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePrice = (days, vehiculeId) => {
    const vehicle = cars.featured.find(car => car.id === vehiculeId);
    return vehicle ? days * vehicle.price : 0;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Contenu existant des véhicules */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
              Sélectionnez votre véhicule
            </Typography>
            <Grid container spacing={3}>
              {filteredCars.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
                      color: 'white',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out',
                      }
                    }}
                    onClick={() => handleCarSelect(car)}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                        {car.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                        {car.type}
                      </Typography>

                      {/* Specs Icons */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        mb: 2,
                        color: '#fff',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.2rem'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon />
                          <Typography variant="body2">{car.specs.passagers}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LuggageIcon />
                          <Typography variant="body2">{car.specs.portes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SettingsIcon />
                          <Typography variant="body2">
                            {car.specs.transmission === 'Automatique' ? 'Auto' : 'Man'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Car Image */}
                    <Box sx={{ 
                      position: 'relative',
                      height: 200,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      <img
                        src={car.image}
                        alt={car.name}
                        style={{
                          width: '90%',
                          height: '90%',
                          objectFit: 'contain',
                          transform: 'scale(1.1)',
                          transition: 'transform 0.3s ease-in-out'
                        }}
                      />
                    </Box>

                    {/* Price Section */}
                    <Box sx={{ 
                      p: 2, 
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                          Kilométrage illimité disponible
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {car.price} DH
                          <Typography component="span" variant="body2" sx={{ color: '#aaa' }}>/jour</Typography>
                        </Typography>
                      </Box>
                      {selectedCar?.id === car.id && (
                        <Chip 
                          label="Sélectionné" 
                          color="primary" 
                          size="small"
                          sx={{ 
                            backgroundColor: '#1976d2',
                            color: 'white'
                          }} 
                        />
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#1a1a1a',
            borderRadius: 2,
            mb: 2
          }}>
            <CardContent>
              {/* En-tête avec titre */}
              <Box sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                pb: 2,
                mb: 3
              }}>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  RÉCAPITULATIF DE RÉSERVATION
                </Typography>
              </Box>

              {/* Véhicule sélectionné */}
              {formData.vehicule && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 1,
                    p: 2,
                    mb: 3
                  }}>
                    <Box sx={{ 
                      position: 'relative',
                      height: 140,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      <img
                        src={cars.featured.find(car => car.id === formData.vehicule)?.image}
                        alt="Véhicule sélectionné"
                        style={{
                          width: '90%',
                          height: '90%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      mb: 1
                    }}>
                      {cars.featured.find(car => car.id === formData.vehicule)?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {cars.featured.find(car => car.id === formData.vehicule)?.type}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.85em', mt: 1 }}>
                      {formData.dateDepart && formData.dateRetour ? 
                        `${calculateDays(formData.dateDepart, formData.dateRetour)} jrs × ${cars.featured.find(car => car.id === formData.vehicule)?.price} = ${calculatePrice(calculateDays(formData.dateDepart, formData.dateRetour), formData.vehicule)}`
                        : ''
                      }
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Informations de départ */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: 'white',
                  mb: 2,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Informations de départ
                </Typography>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 1,
                  p: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.lieuDepart}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.dateDepart}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Informations d'arrivée */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: 'white',
                  mb: 2,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Informations d'arrivée
                </Typography>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 1,
                  p: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.lieuRetour}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.dateRetour}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bouton Suivant */}
              <Box sx={{ 
                borderTop: '1px solid rgba(255,255,255,0.1)',
                pt: 3,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

const Extras = ({ formData, setFormData }) => {
  const selectedCar = cars.featured.find(car => car.id === formData.vehicule);
  const calculateDays = (dateDepart, dateRetour) => {
    if (!dateDepart || !dateRetour) return 0;
    const start = new Date(dateDepart);
    const end = new Date(dateRetour);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const days = calculateDays(formData.dateDepart, formData.dateRetour);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Contenu existant des extras */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
              Sélectionnez vos extras
            </Typography>
            {extras.map((extra) => (
              <Card
                key={extra.id}
                sx={{
                  mb: 2,
                  bgcolor: '#1a1a1a',
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      mr: 3,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    <extra.icon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {extra.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {extra.description}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 2, textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ color: extra.price === 0 ? '#4CAF50' : '#2196F3', mb: 1 }}>
                      {extra.price === 0 ? 'Inclus' : `${extra.price} DH/${extra.priceUnit}`}
                    </Typography>
                    <Checkbox
                      checked={formData.extras.includes(extra.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            extras: [...formData.extras, extra.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            extras: formData.extras.filter(id => id !== extra.id)
                          });
                        }
                      }}
                      sx={{
                        color: 'rgba(255,255,255,0.3)',
                        '&.Mui-checked': {
                          color: '#2196F3',
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: '#1a1a1a',
            borderRadius: 2,
            mb: 2
          }}>
            <CardContent>
              {/* En-tête avec titre */}
              <Box sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                pb: 2,
                mb: 3
              }}>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  RÉCAPITULATIF DE RÉSERVATION
                </Typography>
              </Box>

              {/* Véhicule sélectionné */}
              {formData.vehicule && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 1,
                    p: 2,
                    mb: 3
                  }}>
                    <Box sx={{ 
                      position: 'relative',
                      height: 140,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      <img
                        src={cars.featured.find(car => car.id === formData.vehicule)?.image}
                        alt="Véhicule sélectionné"
                        style={{
                          width: '90%',
                          height: '90%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      mb: 1
                    }}>
                      {cars.featured.find(car => car.id === formData.vehicule)?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {cars.featured.find(car => car.id === formData.vehicule)?.type}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Informations de départ */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: 'white',
                  mb: 2,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Informations de départ
                </Typography>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 1,
                  p: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.lieuDepart}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.dateDepart}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Informations d'arrivée */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: 'white',
                  mb: 2,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Informations d'arrivée
                </Typography>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRadius: 1,
                  p: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.lieuRetour}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#666', fontSize: '1.2rem', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {formData.dateRetour}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ color: 'white', textAlign: 'left', padding: '8px 0' }}>Libellé</th>
                      <th style={{ color: 'white', textAlign: 'center', padding: '8px 0' }}>Jrs/hrs</th>
                      <th style={{ color: 'white', textAlign: 'right', padding: '8px 0' }}>Prix</th>
                      <th style={{ color: 'white', textAlign: 'right', padding: '8px 0' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.extras.map(extraId => {
                      const extra = extras.find(e => e.id === extraId);
                      if (!extra) return null;
                      return (
                        <tr key={extra.id}>
                          <td style={{ color: '#999', padding: '8px 0' }}>{extra.name}</td>
                          <td style={{ color: '#999', textAlign: 'center', padding: '8px 0' }}>{days}</td>
                          <td style={{ color: '#999', textAlign: 'right', padding: '8px 0' }}>{extra.price}</td>
                          <td style={{ color: '#999', textAlign: 'right', padding: '8px 0' }}>{extra.price * days}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="3" style={{ color: 'white', textAlign: 'right', padding: '16px 0 8px' }}>Total :</td>
                      <td style={{ color: 'white', textAlign: 'right', padding: '16px 0 8px' }}>
                        {formData.extras.reduce((total, extraId) => {
                          const extra = extras.find(e => e.id === extraId);
                          return total + (extra ? extra.price * days : 0);
                        }, 0)} MAD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const Confirmation = ({ formData, setFormData }) => {
  const selectedCar = cars.featured.find(car => car.id === formData.vehicule);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Vos informations</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Civilité"
                  variant="outlined"
                  value={formData.civilite || ''}
                  onChange={(e) => setFormData({ ...formData, civilite: e.target.value })}
                >
                  <MenuItem value="M.">M.</MenuItem>
                  <MenuItem value="Mme">Mme</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nº CIN/Passport"
                  variant="outlined"
                  value={formData.cinPassport || ''}
                  onChange={(e) => setFormData({ ...formData, cinPassport: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  variant="outlined"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  variant="outlined"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de naissance"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateNaissance || ''}
                  onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nº de permit"
                  variant="outlined"
                  value={formData.numeroPermit || ''}
                  onChange={(e) => setFormData({ ...formData, numeroPermit: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Permit delivré le"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={formData.datePermit || ''}
                  onChange={(e) => setFormData({ ...formData, datePermit: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  variant="outlined"
                  value={formData.telephone || ''}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  variant="outlined"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={formData.adresse || ''}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Nb. jrs/hrs</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedCar?.name}</TableCell>
                  <TableCell>3 jrs</TableCell>
                  <TableCell>
                    {selectedCar?.price} /jr
                    <br />
                    0 /h
                  </TableCell>
                  <TableCell>{selectedCar?.price * 3}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'red', mr: 1 }}>✕</Box>
                      Conducteur professionnel
                    </Box>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    200 /jr
                    <br />
                    0 /h
                  </TableCell>
                  <TableCell>600</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'red', mr: 1 }}>✕</Box>
                      Kilométrage limité à 200 km par jour
                    </Box>
                  </TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>/jour</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography>Montant Total : 1801 MAD</Typography>
            <Typography>Total à payé : 1801 MAD</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{ color: 'text.secondary', borderColor: 'divider' }}
              onClick={() => setFormData({ ...formData, step: formData.step - 1 })}
            >
              ← Retour
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                // Logique de confirmation
              }}
            >
              Confirmer réservation ✓
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src={selectedCar?.image}
                alt={selectedCar?.name}
                sx={{ width: '100%', height: 'auto', borderRadius: 1, mb: 2 }}
              />
              <Typography variant="h6">{selectedCar?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCar?.type}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Informations de départ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lieu
              </Typography>
              <Typography sx={{ mb: 1 }}>{formData.lieuDepart}</Typography>
              <Typography variant="body2" color="text.secondary">
                Date & Heure
              </Typography>
              <Typography>{formData.dateDepart}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Informations d'arrivée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography sx={{ mb: 1 }}>{formData.lieuRetour}</Typography>
              <Typography variant="body2" color="text.secondary">
                Date & Heure
              </Typography>
              <Typography>{formData.dateRetour}</Typography>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Éditer
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const Reserver = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    dateDepart: '',
    dateRetour: '',
    lieuDepart: '',
    lieuRetour: '',
    vehicule: null,
    extras: [],
    civilite: '',
    cinPassport: '',
    prenom: '',
    nom: '',
    dateNaissance: '',
    numeroPermit: '',
    datePermit: '',
    telephone: '',
    adresse: '',
    email: '',
  });

  const validateStep = (step) => {
    setError('');
    switch (step) {
      case 0:
        if (!formData.dateDepart || !formData.dateRetour || !formData.lieuDepart || !formData.lieuRetour) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        const depart = new Date(formData.dateDepart);
        const retour = new Date(formData.dateRetour);
        if (depart >= retour) {
          setError('La date de retour doit être postérieure à la date de départ');
          return false;
        }
        break;
      case 1:
        if (!formData.vehicule) {
          setError('Veuillez sélectionner un véhicule');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DepartRetour formData={formData} setFormData={setFormData} error={error} />;
      case 1:
        return <Vehicule formData={formData} setFormData={setFormData} error={error} />;
      case 2:
        return <Extras formData={formData} setFormData={setFormData} />;
      case 3:
        return <Confirmation formData={formData} setFormData={setFormData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Réserver un véhicule
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Retour
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Reserver;
