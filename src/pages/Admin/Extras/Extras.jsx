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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Extras = () => {
  const [extras, setExtras] = useState([]);
  const [open, setOpen] = useState(false);
  const [newExtra, setNewExtra] = useState({ 
    nom: '', 
    description: '', 
    prix: '' 
  });
  const [editingExtra, setEditingExtra] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrors({}); };
  const handleChange = (e) => setNewExtra({ ...newExtra, [e.target.name]: e.target.value });

  const handleSave = () => {
    const newErrors = {};
    if (!newExtra.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!newExtra.description.trim()) newErrors.description = "La description est obligatoire";
    if (!newExtra.prix.trim()) newErrors.prix = "Le prix est obligatoire";
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    
    if (editingExtra) {
      // Mise à jour d'un extra existant
      setExtras(prev => prev.map(item => 
        item.id === editingExtra.id ? { ...newExtra, id: item.id } : item
      ));
      setEditingExtra(null);
    } else {
      // Ajout d'un nouvel extra
      setExtras(prev => [...prev, { ...newExtra, id: prev.length + 1 }]);
    }
    setNewExtra({ 
      nom: '', 
      description: '', 
      prix: '' 
    });
    setErrors({});
    handleClose();
  };

  const handleEdit = (extra) => {
    setEditingExtra(extra);
    setNewExtra({
      nom: extra.nom,
      description: extra.description,
      prix: extra.prix
    });
    setOpen(true);
  };
  
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      setExtras(prev => prev.filter(item => item.id !== confirmDeleteId));
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
  
  // Filtrer les extras en fonction du terme de recherche
  const filteredExtras = extras.filter(extra => 
    extra.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extra.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extra.prix.toString().includes(searchTerm)
  );

  useEffect(() => {
    // TODO: fetch extras via API
    setExtras([]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gestion des extras</Typography>
        <Button onClick={handleOpen} variant="contained" color="primary" startIcon={<AddIcon />}>
          Ajouter un extra
        </Button>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Rechercher un extra"
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
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>ExtraID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Prix</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExtras.length > 0 ? (
                filteredExtras.map(extra => (
                  <TableRow key={extra.id}>
                    <TableCell>{extra.id}</TableCell>
                    <TableCell>{extra.nom}</TableCell>
                    <TableCell>{extra.description}</TableCell>
                    <TableCell>{extra.prix} DH</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(extra)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDeleteClick(extra.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {searchTerm ? "Aucun extra ne correspond à votre recherche" : "Aucun extra trouvé"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' } }}
        PaperProps={{ sx: { borderRadius: 3, width: '500px', maxWidth: '95vw', margin: 'auto', backgroundColor: '#000000', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ backgroundColor: '#FFD700', color: '#000000', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 3, fontSize: '1.3rem' }}>
          <AddShoppingCartIcon /> {editingExtra ? 'Modifier un extra' : 'Ajouter un extra'}
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 4, backgroundColor: '#000000', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddShoppingCartIcon sx={{ color: '#FFD700' }} /> Nom
                </Typography>
                <TextField 
                  name="nom" 
                  variant="outlined" 
                  fullWidth 
                  value={newExtra.nom} 
                  onChange={handleChange} 
                  error={!!errors.nom} 
                  helperText={errors.nom} 
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
                  <DescriptionIcon sx={{ color: '#FFD700' }} /> Description
                </Typography>
                <TextField 
                  name="description" 
                  variant="outlined" 
                  fullWidth 
                  multiline
                  rows={3}
                  value={newExtra.description} 
                  onChange={handleChange} 
                  error={!!errors.description} 
                  helperText={errors.description} 
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
                  <MonetizationOnIcon sx={{ color: '#FFD700' }} /> Prix (DH)
                </Typography>
                <TextField 
                  name="prix" 
                  variant="outlined" 
                  fullWidth 
                  type="number"
                  value={newExtra.prix} 
                  onChange={handleChange} 
                  error={!!errors.prix} 
                  helperText={errors.prix} 
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
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000000', px: 4, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: '#FFD700' }}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#FFD700', color: '#000000', '&:hover': { backgroundColor: '#e6c200' } }}>
            {editingExtra ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

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
            Êtes-vous sûr de vouloir supprimer cet extra ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000', p: 2 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: '#FFD700' }}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Extras;
