import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import AdminTabs from '../../../components/Admin/Navigation/AdminTabs';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AddReservationClientDialog from '../../../components/Admin/Shared/AddReservationClientDialog';

const ReservationClientLayout = ({ children, onAddReservation, onAddClient }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const tabs = [
    { label: 'Rendez-vous', path: 'reservations', icon: <BookOnlineIcon /> },
    { label: 'Clients', path: 'clients', icon: <PersonIcon /> }
  ];

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveReservation = (reservationData) => {
    // Appeler la fonction onAddReservation et fermer le dialogue
    onAddReservation(reservationData);
    handleCloseDialog();
  };

  const handleSaveClient = (clientData) => {
    // Appeler la fonction onAddClient et fermer le dialogue
    onAddClient(clientData);
    handleCloseDialog();
  };

  // Écouter l'événement pour ouvrir le dialogue
  useEffect(() => {
    const handleForceOpenDialog = () => {
      setDialogOpen(true);
    };

    document.addEventListener('force-open-dialog', handleForceOpenDialog);
    document.addEventListener('open-reservation-client-dialog', handleOpenDialog);
    
    return () => {
      document.removeEventListener('force-open-dialog', handleForceOpenDialog);
      document.removeEventListener('open-reservation-client-dialog', handleOpenDialog);
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <AdminTabs tabs={tabs} />
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          data-action="add-reservation-client"
        >
          Ajouter réservation/client
        </Button>
        
        <AddReservationClientDialog
          open={dialogOpen}
          handleClose={handleCloseDialog}
          handleOpen={handleOpenDialog}
          handleSaveReservation={handleSaveReservation}
          handleSaveClient={handleSaveClient}
        />
      </Box>
      {children}
    </Container>
  );
};

export default ReservationClientLayout;
