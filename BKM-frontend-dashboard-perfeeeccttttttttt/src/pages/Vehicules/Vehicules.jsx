import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { carImages } from '../../assets/images/cars';

const Vehicules = () => {
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
          {carImages.featured.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4}>
              {/* Car card content */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Vehicules;
