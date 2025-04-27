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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import AdminTabs from '../../../components/Admin/Navigation/AdminTabs';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ReservationClientLayout from '../Shared/ReservationClientLayout';

const Clients = () => {
  const [clients, setClients] = useState([]);
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
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setNewClient({ ...newClient, [e.target.name]: e.target.value });

  const handleSave = (clientData) => {
    const newErrors = {};
    if (!clientData.civilite.trim()) newErrors.civilite = "La civilité est obligatoire";
    if (!clientData.nom_complet.trim()) newErrors.nom_complet = "Le nom complet est obligatoire";
    if (!clientData.telephone.trim()) newErrors.telephone = "Le numéro de téléphone est obligatoire";
    if (!clientData.cin_passport.trim()) newErrors.cin_passport = "CIN/Passport est obligatoire";
    if (!clientData.dateNaissance.trim()) newErrors.dateNaissance = "La date de naissance est obligatoire";
    if (!clientData.numPermis.trim()) newErrors.numPermis = "Le numéro de permis est obligatoire";
    if (!clientData.dateDelivrancePermis.trim()) newErrors.dateDelivrancePermis = "La date de délivrance du permis est obligatoire";
    if (!clientData.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire";
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    
    if (editingClient) {
      // Mise à jour d'un client existant
      setClients(prev => prev.map(item => 
        item.id === editingClient.id ? { ...clientData, id: item.id } : item
      ));
      setEditingClient(null);
    } else {
      // Ajout d'un nouveau client
      setClients(prev => [...prev, { ...clientData, id: prev.length + 1 }]);
    }
    setNewClient({ 
      civilite: '', 
      nom_complet: '',
      telephone: '',
      cin_passport: '', 
      dateNaissance: '', 
      numPermis: '', 
      dateDelivrancePermis: '',
      adresse: '' 
    });
    setErrors({});
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    // Préremplir le formulaire avec les données du client
    const clientData = { ...client };
    // Ouvrir le dialogue d'ajout/édition avec les données préremplies
    const event = new CustomEvent('edit-client', { detail: clientData });
    document.dispatchEvent(event);
    
    // Déclencher l'ouverture du dialogue de réservation/client
    const dialogOpenEvent = new CustomEvent('open-reservation-client-dialog');
    document.dispatchEvent(dialogOpenEvent);
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      setClients(prev => prev.filter(item => item.id !== confirmDeleteId));
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

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(client => 
    client.civilite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cin_passport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // TODO: fetch clients via API
    setClients([]);
  }, []);

  return (
    <ReservationClientLayout onAddReservation={() => window.location.href = '/admin/reservations'} onAddClient={(clientData) => {
      // Ajouter directement le client sans ouvrir un nouveau dialogue
      handleSave(clientData);
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gestion des clients</Typography>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Rechercher un client"
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
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Civilité</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Nom Complet</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Téléphone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>CIN/Passport</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Date Naissance</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Num Permis</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Date Délivrance Permis</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Adresse</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.civilite}</TableCell>
                    <TableCell>{client.nom_complet}</TableCell>
                    <TableCell>{client.telephone}</TableCell>
                    <TableCell>{client.cin_passport}</TableCell>
                    <TableCell>{client.dateNaissance}</TableCell>
                    <TableCell>{client.numPermis}</TableCell>
                    <TableCell>{client.dateDelivrancePermis}</TableCell>
                    <TableCell>{client.adresse}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(client)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDeleteClick(client.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {searchTerm ? "Aucun client ne correspond à votre recherche" : "Aucun client trouvé"}
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
            Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
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

export default Clients;
