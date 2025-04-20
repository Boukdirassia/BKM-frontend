import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const ErrorPage = () => {

  useEffect(() => {
    document.title = 'Page Not Found • BKM';
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#fafafa',
      textAlign: 'center',
      p: 4,
    }}>
      <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'sans-serif', color: '#262626' }}>
        BKM
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, color: '#8e8e8e' }}>
        Sorry, this page isn't available.
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: '#8e8e8e', maxWidth: 400 }}>
        The link you followed may be broken, or the page may have been removed.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{
            bgcolor: '#FFD700',
            color: 'black',
            mt: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#E6C200',
            }
          }}
      >
        Go back to BKM
      </Button>
    </Box>
  );
};

export default ErrorPage;