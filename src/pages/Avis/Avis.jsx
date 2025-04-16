import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Rating, Avatar } from '@mui/material';

const reviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    comment: 'Excellent service! La voiture était impeccable et le processus de location très simple.',
    date: '15 Jan 2025'
  },
  {
    id: 2,
    name: 'Mohammed K.',
    rating: 5,
    comment: 'Très satisfait de la qualité des véhicules et du professionnalisme du personnel.',
    date: '10 Jan 2025'
  },
  {
    id: 3,
    name: 'Julie D.',
    rating: 4,
    comment: 'Bon rapport qualité-prix. Je recommande vivement leurs services.',
    date: '5 Jan 2025'
  }
];

const Avis = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          Avis Clients
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Découvrez ce que nos clients pensent de nos services
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {reviews.map((review) => (
            <Grid item key={review.id} xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {review.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {review.name}
                      </Typography>
                      <Rating value={review.rating} readOnly />
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {review.comment}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Avis;
