import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PhoneIcon from '@mui/icons-material/Phone';

const AddReservationClientDialog = ({ open, handleClose, handleSaveReservation, handleSaveClient, handleOpen }) => {
  const [tabValue, setTabValue] = useState(0);
  const [combinedMode, setCombinedMode] = useState(false);
  const [newReservation, setNewReservation] = useState({ 
    client: '', 
    vehicle: '', 
    startDate: '', 
    endDate: '', 
    statut: 'en_attente', 
    extra: '' 
  });
  const [newClient, setNewClient] = useState({ 
    civilite: '', 
    nom_complet: '',
    telephone: '',
    cin_passport: '', 
    dateNaissance: '', 
    numPermis: '', 
    dateDelivrancePermis: '',
    adresse: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [reservationErrors, setReservationErrors] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Options pour les menus déroulants
  const vehicleOptions = [
    { id: 1, name: 'Tesla Model S' },
    { id: 2, name: 'BMW X5' },
    { id: 3, name: 'Audi A4' },
    { id: 4, name: 'Mercedes C-Class' },
    { id: 5, name: 'Renault Clio' }
  ];
  
  const clientOptions = [
    { id: 1, name: 'Jean Dupont' },
    { id: 2, name: 'Marie Martin' },
    { id: 3, name: 'Pierre Durand' },
    { id: 4, name: 'Sophie Leroy' }
  ];

  const extraOptions = [
    { id: 1, name: 'GPS' },
    { id: 2, name: 'Siège bébé' },
    { id: 3, name: 'Chaînes neige' },
    { id: 4, name: 'Porte-vélos' },
    { id: 5, name: 'Assurance tous risques' }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Désactiver le mode combiné lors du changement d'onglet
    setCombinedMode(false);
  };
  
  const toggleCombinedMode = () => {
    setCombinedMode(!combinedMode);
  };

  const handleReservationChange = (e) => {
    setNewReservation({ ...newReservation, [e.target.name]: e.target.value });
  };

  const handleClientChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const validateReservation = () => {
    const errors = {};
    if (!newReservation.client) errors.client = "Le client est obligatoire";
    if (!newReservation.vehicle) errors.vehicle = "Le véhicule est obligatoire";
    if (!newReservation.startDate) errors.startDate = "La date de début est obligatoire";
    if (!newReservation.endDate) errors.endDate = "La date de fin est obligatoire";
    
    setReservationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateClient = () => {
    const newErrors = {};
    if (!newClient.civilite.trim()) newErrors.civilite = "La civilité est obligatoire";
    if (!newClient.nom_complet.trim()) newErrors.nom_complet = "Le nom complet est obligatoire";
    if (!newClient.telephone.trim()) newErrors.telephone = "Le numéro de téléphone est obligatoire";
    if (!newClient.cin_passport.trim()) newErrors.cin_passport = "CIN/Passport est obligatoire";
    if (!newClient.dateNaissance.trim()) newErrors.dateNaissance = "La date de naissance est obligatoire";
    if (!newClient.numPermis.trim()) newErrors.numPermis = "Le numéro de permis est obligatoire";
    if (!newClient.dateDelivrancePermis.trim()) newErrors.dateDelivrancePermis = "La date de délivrance du permis est obligatoire";
    if (!newClient.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire";
    
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return false;
    }
    return true;
  };

  const resetForms = () => {
    setNewReservation({ client: '', vehicle: '', startDate: '', endDate: '', statut: 'en_attente', extra: '' });
    setNewClient({ civilite: '', nom_complet: '', telephone: '', cin_passport: '', dateNaissance: '', numPermis: '', dateDelivrancePermis: '', adresse: '' });
    setReservationErrors({});
    setClientErrors({});
    setIsEditing(false);
  };

  const handleSave = () => {
    if (combinedMode) {
      // Mode combiné: valider les deux formulaires
      if (validateReservation() && validateClient()) {
        handleSaveClient(newClient);
        handleSaveReservation(newReservation);
        resetForms();
        handleClose();
      }
    } else if (tabValue === 0) {
      // Onglet réservation
      if (validateReservation()) {
        handleSaveReservation(newReservation);
        resetForms();
        handleClose();
      }
    } else if (tabValue === 1) {
      // Onglet client
      if (validateClient()) {
        handleSaveClient(newClient);
        resetForms();
        handleClose();
      }
    }
  };

  // Écouter l'événement d'édition de réservation
  React.useEffect(() => {
    const handleEditReservation = (event) => {
      const reservationData = event.detail;
      setNewReservation(reservationData);
      setTabValue(0); // Passer à l'onglet réservation
      setIsEditing(true);
    };

    document.addEventListener('edit-reservation', handleEditReservation);
    return () => {
      document.removeEventListener('edit-reservation', handleEditReservation);
    };
  }, []);

  // Écouter l'événement d'édition de client
  React.useEffect(() => {
    const handleEditClient = (event) => {
      const clientData = event.detail;
      setNewClient(clientData);
      setTabValue(1); // Passer à l'onglet client
      setIsEditing(true);
    };

    document.addEventListener('edit-client', handleEditClient);
    return () => {
      document.removeEventListener('edit-client', handleEditClient);
    };
  }, []);

  // Écouter l'événement d'ouverture du dialogue
  React.useEffect(() => {
    const handleOpenDialog = () => {
      if (!open) {
        handleClose(); // Pour s'assurer que le dialogue est fermé avant de l'ouvrir à nouveau
        setTimeout(() => {
          // Utiliser un délai pour s'assurer que le dialogue se ferme complètement avant de l'ouvrir à nouveau
          if (typeof handleOpen === 'function') {
            handleOpen();
          } else {
            // Si handleOpen n'est pas disponible, simuler l'ouverture en modifiant directement l'état local
            // Ceci est une solution de contournement et devrait être remplacé par un appel à handleOpen si disponible
            const openDialogEvent = new CustomEvent('force-open-dialog');
            document.dispatchEvent(openDialogEvent);
          }
        }, 50);
      }
    };

    document.addEventListener('open-reservation-client-dialog', handleOpenDialog);
    return () => {
      document.removeEventListener('open-reservation-client-dialog', handleOpenDialog);
    };
  }, [open, handleClose, handleOpen]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' } }}
      PaperProps={{ sx: { borderRadius: 3, width: '700px', maxWidth: '95vw', margin: 'auto', backgroundColor: '#000000', overflow: 'hidden' } }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: '#FFD700', 
          color: '#000000', 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 3,
          fontSize: '1.3rem'
        }}
      >
        {combinedMode ? (
          <>
            <BookOnlineIcon /> <PersonIcon /> {isEditing ? 'Modifier réservation et client' : 'Ajouter réservation et client'}
          </>
        ) : tabValue === 0 ? (
          <>
            <BookOnlineIcon /> {isEditing ? 'Modifier une réservation' : 'Ajouter une réservation'}
          </>
        ) : (
          <>
            <PersonIcon /> {isEditing ? 'Modifier un client' : 'Ajouter un client'}
          </>
        )}
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#000000' }}>
        {!combinedMode && (
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              '& .MuiTabs-indicator': { backgroundColor: '#FFD700' },
              '& .MuiTab-root': { color: '#999999' },
              '& .Mui-selected': { color: '#FFD700' }
            }}
          >
            <Tab icon={<BookOnlineIcon />} label="Réservation" sx={{ py: 2 }} />
            <Tab icon={<PersonIcon />} label="Client" sx={{ py: 2 }} />
          </Tabs>
        )}
      </Box>
      
      <DialogContent sx={{ px: 4, py: 4, backgroundColor: '#000000', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {combinedMode ? (
          <>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, borderBottom: '1px solid #333', pb: 1 }}>
              Informations du client
            </Typography>
            <Grid container spacing={2} sx={{ pt: 1, mb: 3 }}>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#FFD700' }} /> Civilité
                  </Typography>
                  <TextField 
                    name="civilite" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.civilite} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.civilite} 
                    helperText={clientErrors.civilite} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon sx={{ color: '#FFD700' }} /> CIN/Passport
                  </Typography>
                  <TextField 
                    name="cin_passport" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.cin_passport} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.cin_passport} 
                    helperText={clientErrors.cin_passport} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CakeIcon sx={{ color: '#FFD700' }} /> Date de naissance
                  </Typography>
                  <TextField 
                    name="dateNaissance" 
                    type="date" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.dateNaissance} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.dateNaissance} 
                    helperText={clientErrors.dateNaissance} 
                    InputLabelProps={{ shrink: true }} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DriveEtaIcon sx={{ color: '#FFD700' }} /> Numéro de permis
                  </Typography>
                  <TextField 
                    name="numPermis" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.numPermis} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.numPermis} 
                    helperText={clientErrors.numPermis} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon sx={{ color: '#FFD700' }} /> Date délivrance permis
                  </Typography>
                  <TextField 
                    name="dateDelivrancePermis" 
                    type="date" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.dateDelivrancePermis} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.dateDelivrancePermis} 
                    helperText={clientErrors.dateDelivrancePermis} 
                    InputLabelProps={{ shrink: true }} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon sx={{ color: '#FFD700' }} /> Adresse
                  </Typography>
                  <TextField 
                    name="adresse" 
                    variant="outlined" 
                    fullWidth 
                    multiline
                    rows={2}
                    value={newClient.adresse} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.adresse} 
                    helperText={clientErrors.adresse} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#FFD700' }} /> Nom Complet
                  </Typography>
                  <TextField 
                    name="nom_complet" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.nom_complet} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.nom_complet} 
                    helperText={clientErrors.nom_complet} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: '#FFD700' }} /> Téléphone
                  </Typography>
                  <TextField 
                    name="telephone" 
                    variant="outlined" 
                    fullWidth 
                    value={newClient.telephone} 
                    onChange={handleClientChange} 
                    error={!!clientErrors.telephone} 
                    helperText={clientErrors.telephone} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, borderBottom: '1px solid #333', pb: 1 }}>
              Informations de la réservation
            </Typography>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon sx={{ color: '#FFD700' }} /> Véhicule
                  </Typography>
                  <FormControl fullWidth variant="outlined" error={!!reservationErrors.vehicle} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                    <Select
                      name="vehicle"
                      value={newReservation.vehicle}
                      onChange={handleReservationChange}
                      displayEmpty
                      sx={{ color: 'white' }}
                    >
                      <MenuItem value=""><em>Sélectionner un véhicule</em></MenuItem>
                      {vehicleOptions.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.name}>{vehicle.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {reservationErrors.vehicle && <Typography variant="caption" color="error" sx={{ pl: 1 }}>{reservationErrors.vehicle}</Typography>}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#FFD700' }} /> Date début
                  </Typography>
                  <TextField 
                    name="startDate" 
                    type="date" 
                    variant="outlined" 
                    fullWidth 
                    value={newReservation.startDate} 
                    onChange={handleReservationChange} 
                    error={!!reservationErrors.startDate} 
                    helperText={reservationErrors.startDate} 
                    InputLabelProps={{ shrink: true }} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#FFD700' }} /> Date fin
                  </Typography>
                  <TextField 
                    name="endDate" 
                    type="date" 
                    variant="outlined" 
                    fullWidth 
                    value={newReservation.endDate} 
                    onChange={handleReservationChange} 
                    error={!!reservationErrors.endDate} 
                    helperText={reservationErrors.endDate} 
                    InputLabelProps={{ shrink: true }} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        backgroundColor: '#222222', 
                        color: 'white', 
                        '& fieldset': { borderColor: '#444444' }, 
                        '&:hover fieldset': { borderColor: '#FFD700' }, 
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                      }, 
                      '& .MuiFormHelperText-root': { 
                        color: '#f44336', 
                        marginLeft: 0 
                      } 
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: '#FFD700' }} /> Statut
                  </Typography>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                    <Select
                      name="statut"
                      value={newReservation.statut}
                      onChange={handleReservationChange}
                      sx={{ color: 'white' }}
                    >
                      <MenuItem value="en_attente">En attente</MenuItem>
                      <MenuItem value="confirmee">Confirmée</MenuItem>
                      <MenuItem value="annulee">Annulée</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddShoppingCartIcon sx={{ color: '#FFD700' }} /> Extra
                  </Typography>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                    <Select
                      name="extra"
                      value={newReservation.extra}
                      onChange={handleReservationChange}
                      displayEmpty
                      sx={{ color: 'white' }}
                    >
                      <MenuItem value=""><em>Aucun extra</em></MenuItem>
                      {extraOptions.map((extra) => (
                        <MenuItem key={extra.id} value={extra.name}>{extra.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </>
        ) : null}
        
        {/* Formulaire de réservation */}
        {tabValue === 0 && !combinedMode && (
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon sx={{ color: '#FFD700' }} /> Client
                </Typography>
                <FormControl fullWidth variant="outlined" error={!!reservationErrors.client} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                  <Select
                    name="client"
                    value={newReservation.client}
                    onChange={handleReservationChange}
                    displayEmpty
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="" disabled><em>Sélectionner un client</em></MenuItem>
                    {clientOptions.map((client) => (
                      <MenuItem key={client.id} value={client.name}>{client.name}</MenuItem>
                    ))}
                  </Select>
                  {reservationErrors.client && (
                    <Typography variant="caption" color="error" sx={{ pl: 1 }}>
                      {reservationErrors.client}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarIcon sx={{ color: '#FFD700' }} /> Véhicule
                </Typography>
                <FormControl fullWidth variant="outlined" error={!!reservationErrors.vehicle} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                  <Select
                    name="vehicle"
                    value={newReservation.vehicle}
                    onChange={handleReservationChange}
                    displayEmpty
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="" disabled><em>Sélectionner un véhicule</em></MenuItem>
                    {vehicleOptions.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.name}>{vehicle.name}</MenuItem>
                    ))}
                  </Select>
                  {reservationErrors.vehicle && (
                    <Typography variant="caption" color="error" sx={{ pl: 1 }}>
                      {reservationErrors.vehicle}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: '#FFD700' }} /> Date début
                </Typography>
                <TextField 
                  name="startDate" 
                  type="date" 
                  variant="outlined" 
                  fullWidth 
                  value={newReservation.startDate} 
                  onChange={handleReservationChange} 
                  error={!!reservationErrors.startDate} 
                  helperText={reservationErrors.startDate} 
                  InputLabelProps={{ shrink: true }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: '#FFD700' }} /> Date fin
                </Typography>
                <TextField 
                  name="endDate" 
                  type="date" 
                  variant="outlined" 
                  fullWidth 
                  value={newReservation.endDate} 
                  onChange={handleReservationChange} 
                  error={!!reservationErrors.endDate} 
                  helperText={reservationErrors.endDate} 
                  InputLabelProps={{ shrink: true }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: '#FFD700' }} /> Statut
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                  <Select
                    name="statut"
                    value={newReservation.statut}
                    onChange={handleReservationChange}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="en_attente">En attente</MenuItem>
                    <MenuItem value="confirmee">Confirmée</MenuItem>
                    <MenuItem value="annulee">Annulée</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddShoppingCartIcon sx={{ color: '#FFD700' }} /> Extra
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#222222', color: 'white', '& fieldset': { borderColor: '#444444' }, '&:hover fieldset': { borderColor: '#FFD700' }, '&.Mui-focused fieldset': { borderColor: '#FFD700' } } }}>
                  <Select
                    name="extra"
                    value={newReservation.extra}
                    onChange={handleReservationChange}
                    displayEmpty
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value=""><em>Aucun extra</em></MenuItem>
                    {extraOptions.map((extra) => (
                      <MenuItem key={extra.id} value={extra.name}>{extra.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        )}
        
        {/* Formulaire client */}
        {tabValue === 1 && !combinedMode && (
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ color: '#FFD700' }} /> Civilité
                </Typography>
                <TextField 
                  name="civilite" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.civilite} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.civilite} 
                  helperText={clientErrors.civilite} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeIcon sx={{ color: '#FFD700' }} /> CIN/Passport
                </Typography>
                <TextField 
                  name="cin_passport" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.cin_passport} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.cin_passport} 
                  helperText={clientErrors.cin_passport} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CakeIcon sx={{ color: '#FFD700' }} /> Date de naissance
                </Typography>
                <TextField 
                  name="dateNaissance" 
                  type="date" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.dateNaissance} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.dateNaissance} 
                  helperText={clientErrors.dateNaissance} 
                  InputLabelProps={{ shrink: true }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DriveEtaIcon sx={{ color: '#FFD700' }} /> Numéro de permis
                </Typography>
                <TextField 
                  name="numPermis" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.numPermis} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.numPermis} 
                  helperText={clientErrors.numPermis} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon sx={{ color: '#FFD700' }} /> Date délivrance permis
                </Typography>
                <TextField 
                  name="dateDelivrancePermis" 
                  type="date" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.dateDelivrancePermis} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.dateDelivrancePermis} 
                  helperText={clientErrors.dateDelivrancePermis} 
                  InputLabelProps={{ shrink: true }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon sx={{ color: '#FFD700' }} /> Adresse
                </Typography>
                <TextField 
                  name="adresse" 
                  variant="outlined" 
                  fullWidth 
                  multiline
                  rows={2}
                  value={newClient.adresse} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.adresse} 
                  helperText={clientErrors.adresse} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ color: '#FFD700' }} /> Nom Complet
                </Typography>
                <TextField 
                  name="nom_complet" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.nom_complet} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.nom_complet} 
                  helperText={clientErrors.nom_complet} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: '#FFD700' }} /> Téléphone
                </Typography>
                <TextField 
                  name="telephone" 
                  variant="outlined" 
                  fullWidth 
                  value={newClient.telephone} 
                  onChange={handleClientChange} 
                  error={!!clientErrors.telephone} 
                  helperText={clientErrors.telephone} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      backgroundColor: '#222222', 
                      color: 'white', 
                      '& fieldset': { borderColor: '#444444' }, 
                      '&:hover fieldset': { borderColor: '#FFD700' }, 
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' } 
                    }, 
                    '& .MuiFormHelperText-root': { 
                      color: '#f44336', 
                      marginLeft: 0 
                    } 
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ backgroundColor: '#000000', px: 4, pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <FormControlLabel
              control={
                <Switch 
                  checked={combinedMode}
                  onChange={toggleCombinedMode}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#FFD700',
                      '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.08)' }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#FFD700'
                    }
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Mode combiné
                  </Typography>
                  <Typography sx={{ color: '#AAA', fontSize: '0.7rem' }}>
                    Ajouter un client et sa réservation en même temps
                  </Typography>
                </Box>
              }
              sx={{ color: '#FFD700' }}
            />
          </Box>
          <Box>
            <Button 
              onClick={handleClose} 
              sx={{ 
                color: '#FFD700',
                mr: 2
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ 
                backgroundColor: '#FFD700', 
                color: '#000000', 
                '&:hover': { backgroundColor: '#E6C200' },
                fontWeight: 'bold'
              }}
            >
              {combinedMode 
                ? (isEditing ? 'Mettre à jour les deux' : 'Enregistrer les deux') 
                : (isEditing ? 'Mettre à jour' : 'Enregistrer')}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddReservationClientDialog;
