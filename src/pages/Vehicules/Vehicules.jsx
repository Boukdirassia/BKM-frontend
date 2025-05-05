import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import { voitureService } from '../../services';
import { Link } from 'react-router-dom';

const Vehicules = () => {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        setLoading(true);
        const data = await voitureService.getAllVoitures();
        setVoitures(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des voitures:', err);
        setError('Impossible de charger les véhicules. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoitures();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" color="error" align="center">
            {error}
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          Nos Véhicules
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Découvrez notre flotte de véhicules de qualité pour tous vos besoins
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {voitures.map((voiture) => (
            <Grid item key={voiture.VoitureID} xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={voiture.Image || 'https://via.placeholder.com/300x200?text=Voiture+non+disponible'}
                  alt={`${voiture.Marque} ${voiture.Modele}`}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {voiture.Marque} {voiture.Modele}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {voiture.Annee} • {voiture.Categorie}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {voiture.PrixJour} DH / jour
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      component={Link} 
                      to={`/vehicules/${voiture.VoitureID}`} 
                      variant="outlined" 
                      size="small"
                    >
                      Détails
                    </Button>
                    <Button 
                      component={Link} 
                      to={`/reserver/${voiture.VoitureID}`} 
                      variant="contained" 
                      size="small"
                      disabled={!voiture.Disponibilite}
                    >
                      {voiture.Disponibilite ? 'Réserver' : 'Indisponible'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Vehicules;
