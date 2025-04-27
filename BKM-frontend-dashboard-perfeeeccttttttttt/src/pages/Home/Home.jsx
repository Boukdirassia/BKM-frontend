import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  InputAdornment,
  MenuItem,
  Autocomplete,
  Divider,
  Rating,
  Avatar
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Security, 
  Support, 
  AttachMoney, 
  LocationOn, 
  FlightTakeoff, 
  LocationCity, 
  Store,
  Cancel,
  Star,
  LocalShipping,
  FamilyRestroom,
  LocationSearching,
  DirectionsCar,
  Person,
  Settings,
  LocalGasStation,
  Phone,
  Email
} from '@mui/icons-material';
import { carImages } from '../../assets/images/cars';
import { locations } from '../../data/locations';
import { cars } from '../../data/cars';

// Images d'arrière-plan
const backgroundImages = [
  'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg', // Voiture noire 1
  'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg', // Voiture noire 2
  'https://images.pexels.com/photos/831475/pexels-photo-831475.jpeg', // Voiture noire 3
  'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg' // Voiture noire 4
];

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnLocation: '',
    returnDate: '',
    returnTime: ''
  });

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const handleSearch = () => {
    // Créer l'URL avec les paramètres de recherche
    const searchParams = new URLSearchParams({
      pickupLocation: searchData.pickupLocation,
      pickupDate: searchData.pickupDate,
      pickupTime: searchData.pickupTime,
      returnLocation: searchData.returnLocation,
      returnDate: searchData.returnDate,
      returnTime: searchData.returnTime,
      step: '2' // Pour aller directement à l'étape VÉHICULE
    });

    // Naviguer vers la page de réservation avec les paramètres
    navigate(`/reserver?${searchParams.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section with Background Slider */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.6)',
              zIndex: 1
            },
            '& > img': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 1s ease-in-out'
            }
          }}
        >
          {backgroundImages.map((bg, index) => (
            <img
              key={index}
              src={bg}
              alt={`background-${index + 1}`}
              style={{
                opacity: currentBgIndex === index ? 1 : 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ))}
        </Box>

        {/* Hero Content */}
        <Container
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            pt: 8
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 500,
              mb: 2,
              maxWidth: '800px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Choisissez parmi notre sélection premium de véhicules. Meilleurs prix garantis avec notre promesse de prix.
          </Typography>

          {/* Search Form */}
          <Paper
            sx={{
              p: 3,
              mt: 4,
              bgcolor: 'rgba(0,0,0,0.8)',
              borderRadius: 2,
              border: '1px solid #333',
              width: '100%',
              maxWidth: '800px'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#FFD700',
                textAlign: 'center',
                mb: 3,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              RÉSERVEZ VOTRE VOITURE
            </Typography>

            <Grid container spacing={2}>
              {/* Départ */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DirectionsCar sx={{ color: '#FFD700', mr: 1, fontSize: 20 }} />
                    <Typography sx={{ color: '#999' }}>Départ</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => option.name || ''}
                        onChange={(_, newValue) => handleInputChange('pickupLocation', newValue?.name || '')}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Lieu de départ"
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: '#1a1a1a',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#444' },
                                '& input': { color: 'white' }
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="date"
                        fullWidth
                        onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                        InputProps={{
                          sx: {
                            bgcolor: '#1a1a1a',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#444' },
                            '& input': { color: 'white' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        fullWidth
                        onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                        InputProps={{
                          sx: {
                            bgcolor: '#1a1a1a',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#444' },
                            '& input': { color: 'white' }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Arrivée */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DirectionsCar sx={{ color: '#FFD700', mr: 1, fontSize: 20 }} />
                    <Typography sx={{ color: '#999' }}>Arrivée</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => option.name || ''}
                        onChange={(_, newValue) => handleInputChange('returnLocation', newValue?.name || '')}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Lieu de retour"
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: '#1a1a1a',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#444' },
                                '& input': { color: 'white' }
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="date"
                        fullWidth
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        InputProps={{
                          sx: {
                            bgcolor: '#1a1a1a',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#444' },
                            '& input': { color: 'white' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        fullWidth
                        onChange={(e) => handleInputChange('returnTime', e.target.value)}
                        InputProps={{
                          sx: {
                            bgcolor: '#1a1a1a',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#444' },
                            '& input': { color: 'white' }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Search Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    bgcolor: '#FFD700',
                    color: 'black',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#E6C200',
                    }
                  }}
                >
                  Rechercher un Véhicule
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        sx={{ 
          py: 10,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.08))',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 6,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #FFD700, #FDB931)',
                borderRadius: '2px'
              }
            }}
          >
            Nos Services
          </Typography>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                icon: <FamilyRestroom />,
                title: 'Service Familial',
                description: 'Des véhicules adaptés à toute la famille avec sièges enfants disponibles sur demande'
              },
              {
                icon: <AttachMoney />,
                title: 'Meilleur Prix Garanti',
                description: 'Prix compétitifs et transparents, sans frais cachés. Garantie du meilleur tarif'
              },
              {
                icon: <Cancel />,
                title: 'Annulation Gratuite',
                description: 'Annulation flexible et gratuite jusqu à 24h avant la prise du véhicule'
              },
              {
                icon: <LocalShipping />,
                title: 'Livraison & Réception',
                description: 'Service de livraison et récupération du véhicule à l adresse de votre choix'
              },
              {
                icon: <Star />,
                title: 'Qualité & Expérience',
                description: 'Plus de 10 ans d expérience avec une flotte de véhicules premium régulièrement renouvelée'
              },
              {
                icon: <LocationSearching />,
                title: 'GPS Inclus',
                description: 'Système GPS intégré dans tous nos véhicules pour une navigation facile et sûre'
              }
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      backgroundColor: 'white',
                      '& .service-icon': {
                        transform: 'scale(1.1) rotateY(180deg)',
                        color: '#FDB931'
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box
                      className="service-icon"
                      sx={{
                        fontSize: 50,
                        color: '#FFD700',
                        mb: 3,
                        transition: 'all 0.5s ease',
                        '& > svg': {
                          fontSize: 'inherit'
                        }
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: '#1a1a1a'
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Cars Section */}
      <Box sx={{ bgcolor: '#1a1a1a', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 6, 
              textAlign: 'center', 
              color: 'white',
              fontWeight: 600,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 3,
                bgcolor: '#FFD700'
              }
            }}
          >
            Nos Véhicules
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {cars.featured.map((car) => (
              <Grid item xs={12} sm={6} md={3} key={car.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#1a1a1a',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #333',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.4)',
                      border: '1px solid #444',
                    }
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    pt: '75%', 
                    height: 300, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    bgcolor: '#262626',
                    borderBottom: '1px solid #333'
                  }}>
                    <CardMedia
                      component="img"
                      image={car.image}
                      alt={car.name}
                      sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain',
                        bgcolor: 'transparent',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translate(-50%, -50%) scale(1.05)',
                        }
                      }}
                    />
                  </Box>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 2, 
                    bgcolor: '#1a1a1a',
                    borderTop: '1px solid #222'
                  }}>
                    <Typography 
                      variant="h6"
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      {car.name}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: '#FFD700'
                        }}
                      >
                        {car.type}
                      </Typography>
                      <Typography 
                        variant="h6"
                        sx={{ 
                          color: '#FFD700',
                          fontWeight: 700
                        }}
                      >
                        {car.price} Dh<span style={{ fontSize: '0.7em', color: '#999' }}>/jour</span>
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: 2,
                      pt: 2,
                      borderTop: '1px solid #333'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 18, color: '#FFD700' }} />
                        <Typography variant="body2" sx={{ color: '#999' }}>
                          {car.specs.passagers}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Settings sx={{ fontSize: 18, color: '#FFD700' }} />
                        <Typography variant="body2" sx={{ color: '#999' }}>
                          {car.specs.transmission}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalGasStation sx={{ fontSize: 18, color: '#FFD700' }} />
                        <Typography variant="body2" sx={{ color: '#999' }}>
                          {car.specs.carburant}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to="/reserver"
                      sx={{
                        bgcolor: '#FFD700',
                        color: 'black',
                        py: 1,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#E6C200'
                        }
                      }}
                    >
                      Réserver Maintenant
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ mb: 6 }}>
            Ce que disent nos Clients
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                name: 'Mohammed El Amrani',
                location: 'Casablanca',
                comment: 'Service exceptionnel ! La voiture était impeccable et le personnel très professionnel. Je recommande vivement pour la location de voiture à Casablanca.',
                rating: 5
              },
              {
                name: 'Fatima Benali',
                location: 'Rabat',
                comment: 'Très satisfaite de mon expérience. Les prix sont raisonnables et le service client est excellent. Je relouerai certainement chez eux.',
                rating: 5
              },
              {
                name: 'Karim Tazi',
                location: 'Marrakech',
                comment: 'Une agence sérieuse avec des voitures bien entretenues. La prise en charge était rapide et le personnel très aimable.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: 'white',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Rating value={testimonial.rating} readOnly />
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      minHeight: 100
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#FFD700' }}>
                      {testimonial.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ bgcolor: '#1a1a1a', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 6, color: 'white' }}>
            Nous Contacter
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white', p: 4 }}>
                <Typography variant="h5" sx={{ mb: 4 }}>
                  Si vous avez des questions, n'hésitez pas de nous contacter
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="span" sx={{ color: '#FFD700' }}>
                      <Phone />
                    </Box>
                    <Typography sx={{ color: '#999' }}>06 25 37 39 41</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="span" sx={{ color: '#FFD700' }}>
                      <Email />
                    </Box>
                    <Typography sx={{ color: '#999' }}>boukdirassia@gmail.com</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="span" sx={{ color: '#FFD700' }}>
                      <LocationOn />
                    </Box>
                    <Typography sx={{ color: '#999' }}>Oulfa, Casablanca, Maroc</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, bgcolor: 'white' }}>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    required
                    fullWidth
                    label="Nom & Prénom"
                    variant="outlined"
                  />
                  
                  <TextField
                    required
                    fullWidth
                    label="Téléphone"
                    variant="outlined"
                  />
                  
                  <TextField
                    required
                    fullWidth
                    label="E-mail"
                    type="email"
                    variant="outlined"
                  />
                  
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                  
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#FFD700',
                      color: 'black',
                      '&:hover': {
                        bgcolor: '#E6C200',
                      },
                      py: 1.5
                    }}
                  >
                    Envoyer
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
