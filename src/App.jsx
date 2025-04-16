import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Vehicules from './pages/Vehicules/Vehicules';
import Reserver from './pages/Reserver/Reserver';
import Avis from './pages/Avis/Avis';
import Contact from './pages/Contact/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
      light: '#2c2c2c',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFD700', // Gold
      light: '#FFE44D',
      dark: '#B29700',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    gold: {
      main: '#FFD700',
      light: '#FFE44D',
      dark: '#B29700',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#000000',
    },
    body1: {
      color: '#000000',
    },
    body2: {
      color: '#666666',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        containedSecondary: {
          color: '#000000',
          '&:hover': {
            backgroundColor: '#FFE44D',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          '& .MuiButton-root': {
            '&:hover': {
              color: '#FFD700',
            },
          },
        },
      },
    },
  },
});

const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    }}>
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicules" element={<Vehicules />} />
          <Route path="/reserver" element={<Reserver />} />
          <Route path="/avis" element={<Avis />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </Box>
  );
};

function App() {
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
