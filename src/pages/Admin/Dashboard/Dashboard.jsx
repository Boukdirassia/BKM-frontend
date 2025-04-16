import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        {title}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenus mensuels',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenus mensuels',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#000', fontWeight: 'bold' }}>
        Tableau de bord
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Véhicules disponibles"
            value="24"
            icon={<DirectionsCarIcon sx={{ fontSize: 40 }} />}
            color="#FFD700"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs actifs"
            value="156"
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations"
            value="38"
            icon={<BookOnlineIcon sx={{ fontSize: 40 }} />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenus"
            value="€9,840"
            icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
            color="#F44336"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
        <Line data={revenueData} options={options} />
      </Paper>
    </Box>
  );
};

export default Dashboard;
