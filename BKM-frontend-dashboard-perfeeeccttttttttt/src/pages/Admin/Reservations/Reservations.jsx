import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AdminTabs from '../../../components/Admin/Navigation/AdminTabs';
import PersonIcon from '@mui/icons-material/Person';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ReservationClientLayout from '../Shared/ReservationClientLayout';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ client: '', vehicle: '', startDate: '', endDate: '', statut: 'en_attente', extra: '' });
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [vehicleOptions, setVehicleOptions] = useState([
    { id: 1, name: 'Tesla Model S' },
    { id: 2, name: 'BMW X5' },
    { id: 3, name: 'Audi A4' },
    { id: 4, name: 'Mercedes C-Class' },
    { id: 5, name: 'Renault Clio' }
  ]);
  const [clientOptions, setClientOptions] = useState([
    { id: 1, name: 'Jean Dupont' },
    { id: 2, name: 'Marie Martin' },
    { id: 3, name: 'Pierre Durand' },
    { id: 4, name: 'Sophie Leroy' }
  ]);

  const handleChange = (e) => setNewReservation({ ...newReservation, [e.target.name]: e.target.value });

  const handleSave = (data) => {
    const newErrors = {};
    if (!data.client.trim()) newErrors.client = "Le nom du client est obligatoire";
    if (!data.vehicle.trim()) newErrors.vehicle = "Le véhicule est obligatoire";
    if (!data.startDate.trim()) newErrors.startDate = "La date de début est obligatoire";
    if (!data.endDate.trim()) newErrors.endDate = "La date de fin est obligatoire";
    
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    
    if (editingReservation) {
      // Mise à jour d'une réservation existante
      setReservations(prev => prev.map(item => 
        item.id === editingReservation.id ? { ...data, id: item.id } : item
      ));
      setEditingReservation(null);
    } else {
      // Ajout d'une nouvelle réservation
      setReservations(prev => [...prev, { ...data, id: prev.length + 1 }]);
    }
    setNewReservation({ client: '', vehicle: '', startDate: '', endDate: '', statut: 'en_attente', extra: '' });
    setErrors({});
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    // Préremplir le formulaire avec les données de la réservation
    const reservationData = {
      client: reservation.client,
      vehicle: reservation.vehicle,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      statut: reservation.statut,
      extra: reservation.extra || ''
    };
    // Ouvrir le dialogue d'ajout/édition avec les données préremplies
    const event = new CustomEvent('edit-reservation', { detail: reservationData });
    document.dispatchEvent(event);
    // Ouvrir le dialogue
    document.querySelector('button[data-action="add-reservation-client"]')?.click();
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      setReservations(prev => prev.filter(item => item.id !== confirmDeleteId));
      setOpenDeleteDialog(false);
      setConfirmDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setConfirmDeleteId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrer les réservations en fonction du terme de recherche
  const filteredReservations = reservations.filter(res => 
    res.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.startDate.includes(searchTerm) ||
    res.endDate.includes(searchTerm)
  );

  useEffect(() => {
    // TODO: fetch reservations via API
    setReservations([]);
  }, []);

  // Composant pour afficher le statut avec un style visuel
  const ReservationStatus = ({ status }) => {
    let color = '#FFC107';
    let icon = <AccessTimeIcon fontSize="small" />;
    let label = 'En attente';

    if (status === 'confirmee') {
      color = '#4CAF50';
      icon = <CheckCircleIcon fontSize="small" />;
      label = 'Confirmée';
    } else if (status === 'annulee') {
      color = '#F44336';
      icon = <CancelIcon fontSize="small" />;
      label = 'Annulée';
    }

    return (
      <Chip 
        icon={icon}
        label={label}
        size="small"
        sx={{ 
          backgroundColor: color + '20', 
          color: color,
          fontWeight: 'bold',
          '& .MuiChip-icon': {
            color: color
          }
        }}
      />
    );
  };

  return (
    <ReservationClientLayout onAddReservation={(data) => {
      // Ajouter directement la réservation sans ouvrir un nouveau dialogue
      handleSave(data);
    }} onAddClient={() => window.location.href = '/admin/clients'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gestion des réservations</Typography>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Rechercher une réservation"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        sx={{ mb: 3, width: 300 }}
      />

      <Paper elevation={3} sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{
            minWidth: 650,
            '& .MuiTableRow-root:nth-of-type(odd)': { backgroundColor: 'action.hover' },
            '& .MuiTableRow-root:hover': { backgroundColor: 'grey.200' },
          }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Voiture</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Date Début</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Date Fin</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Extra</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map(res => (
                  <TableRow key={res.id}>
                    <TableCell>{res.id}</TableCell>
                    <TableCell>{res.vehicle}</TableCell>
                    <TableCell>{res.client}</TableCell>
                    <TableCell>{res.startDate}</TableCell>
                    <TableCell>{res.endDate}</TableCell>
                    <TableCell><ReservationStatus status={res.statut} /></TableCell>
                    <TableCell>{res.extra || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(res)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDeleteClick(res.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {searchTerm ? "Aucune réservation ne correspond à votre recherche" : "Aucune réservation trouvée"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#000', color: '#FFD700' }}>
          {"Confirmer la suppression"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#000', color: 'white', pt: 2 }}>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000', p: 2 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: '#FFD700' }}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </ReservationClientLayout>
  );
};

export default Reservations;
