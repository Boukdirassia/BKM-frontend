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
  MenuItem,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ 
    marque: '', 
    modele: '', 
    annee: '', 
    immatriculation: '',
    type: '',
    photo: '',
    disponible: true
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrors({}); };
  const handleChange = (e) => {
    const value = e.target.name === 'disponible' ? e.target.checked : e.target.value;
    setNewVehicle({ ...newVehicle, [e.target.name]: value });
  };

  const handleSave = () => {
    const newErrors = {};
    if (!newVehicle.marque.trim()) newErrors.marque = "La marque est obligatoire";
    if (!newVehicle.modele.trim()) newErrors.modele = "Le modèle est obligatoire";
    if (!newVehicle.annee.trim()) newErrors.annee = "L'année est obligatoire";
    if (!newVehicle.immatriculation.trim()) newErrors.immatriculation = "L'immatriculation est obligatoire";
    if (!newVehicle.type.trim()) newErrors.type = "Le type est obligatoire";
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    
    // Si un nouveau fichier photo a été sélectionné, utiliser son URL
    const vehicleToSave = { 
      ...newVehicle,
      photo: photoFile ? photoPreview : newVehicle.photo 
    };
    
    if (editingVehicle) {
      // Mise à jour d'un véhicule existant
      setVehicles(prev => prev.map(item => 
        item.id === editingVehicle.id ? { ...vehicleToSave, id: item.id } : item
      ));
      setEditingVehicle(null);
    } else {
      // Ajout d'un nouveau véhicule
      setVehicles(prev => [...prev, { ...vehicleToSave, id: prev.length + 1 }]);
    }
    
    setNewVehicle({ 
      marque: '', 
      modele: '', 
      annee: '', 
      immatriculation: '',
      type: '',
      photo: '',
      disponible: true
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setErrors({});
    handleClose();
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      marque: vehicle.marque,
      modele: vehicle.modele,
      annee: vehicle.annee,
      immatriculation: vehicle.immatriculation,
      type: vehicle.type,
      photo: vehicle.photo,
      disponible: vehicle.disponible
    });
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      setVehicles(prev => prev.filter(item => item.id !== confirmDeleteId));
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

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setPhotoModalOpen(true);
  };

  const handlePhotoModalClose = () => {
    setPhotoModalOpen(false);
  };

  // Filtrer les véhicules en fonction du terme de recherche
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.annee.toString().includes(searchTerm) ||
    vehicle.immatriculation.toLowerCase().includes(searchTerm) ||
    vehicle.type.toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    // TODO: fetch vehicles via API
    setVehicles([]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gestion des véhicules</Typography>
        <Button onClick={handleOpen} variant="contained" color="primary" startIcon={<AddIcon />}>
          Ajouter un véhicule
        </Button>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Rechercher un véhicule"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        sx={{ mb: 3, width: 300 }}
      />

      <Paper elevation={3} sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table
            sx={{
              minWidth: 650,
              '& .MuiTableRow-root:nth-of-type(odd)': { backgroundColor: 'action.hover' },
              '& .MuiTableRow-root:hover': { backgroundColor: 'grey.200' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Marque</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Modèle</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Année</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Immatriculation</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Disponibilité</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.id}</TableCell>
                    <TableCell>
                      {vehicle.photo ? (
                        <Box
                          component="img"
                          src={vehicle.photo}
                          alt={`${vehicle.marque} ${vehicle.modele}`}
                          onClick={() => handlePhotoClick(vehicle.photo)}
                          sx={{
                            width: 60,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f0f0f0',
                            borderRadius: 1,
                            border: '1px solid #ddd'
                          }}
                        >
                          <DirectionsCarIcon color="disabled" />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{vehicle.marque}</TableCell>
                    <TableCell>{vehicle.modele}</TableCell>
                    <TableCell>{vehicle.annee}</TableCell>
                    <TableCell>{vehicle.immatriculation}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={vehicle.disponible ? "Disponible" : "Non disponible"} 
                        color={vehicle.disponible ? "success" : "error"} 
                        size="small"
                        sx={{
                          backgroundColor: vehicle.disponible ? '#FFD700' : '#ff4444',
                          color: vehicle.disponible ? '#000000' : '#ffffff',
                          fontWeight: 'bold',
                          '& .MuiChip-label': {
                            px: 2
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleEdit(vehicle)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDeleteClick(vehicle.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {searchTerm ? "Aucun véhicule ne correspond à votre recherche" : "Aucun véhicule trouvé"}
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
          <DirectionsCarIcon /> {editingVehicle ? 'Modifier un véhicule' : 'Ajouter un véhicule'}
        </DialogTitle>
        <DialogContent
          sx={{
            px: 4,
            py: 4,
            backgroundColor: '#000000',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Marque</Typography>
                <TextField
                  name="marque"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.marque}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: 'white',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Modèle</Typography>
                <TextField
                  name="modele"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.modele}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: 'white',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Année</Typography>
                <TextField
                  name="annee"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.annee}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: 'white',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Immatriculation</Typography>
                <TextField
                  name="immatriculation"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.immatriculation}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: 'white',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Type</Typography>
                <TextField
                  name="type"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.type}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: 'white',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Photo</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    border: '2px dashed #FFD700',
                    borderRadius: 2,
                    backgroundColor: '#222222',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#333333',
                      borderColor: '#FFE44D',
                    }
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="vehicle-photo-upload"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPhotoFile(e.target.files[0]);
                        setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                        // Mettre à jour le nom du fichier dans l'état du véhicule
                        setNewVehicle({
                          ...newVehicle,
                          photo: e.target.files[0].name
                        });
                      }
                    }}
                  />
                  <label htmlFor="vehicle-photo-upload" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>
                    {photoPreview ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={photoPreview}
                          alt="Aperçu du véhicule"
                          sx={{
                            width: 120,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mb: 1
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#FFD700' }}>
                          {photoFile ? photoFile.name : 'Changer la photo'}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <DirectionsCarIcon sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          Cliquez pour ajouter une photo
                        </Typography>
                      </Box>
                    )}
                  </label>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Disponibilité</Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#222222',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid #444444'
                  }}
                >
                  <Button
                    variant={newVehicle.disponible ? "contained" : "outlined"}
                    onClick={() => setNewVehicle({ ...newVehicle, disponible: true })}
                    sx={{
                      flex: 1,
                      mr: 1,
                      backgroundColor: newVehicle.disponible ? '#FFD700' : 'transparent',
                      color: newVehicle.disponible ? '#000000' : '#FFD700',
                      borderColor: '#FFD700',
                      '&:hover': {
                        backgroundColor: newVehicle.disponible ? '#e6c200' : 'rgba(255, 215, 0, 0.1)',
                      }
                    }}
                  >
                    Disponible
                  </Button>
                  <Button
                    variant={!newVehicle.disponible ? "contained" : "outlined"}
                    onClick={() => setNewVehicle({ ...newVehicle, disponible: false })}
                    sx={{
                      flex: 1,
                      ml: 1,
                      backgroundColor: !newVehicle.disponible ? '#ff4444' : 'transparent',
                      color: !newVehicle.disponible ? '#ffffff' : '#ff4444',
                      borderColor: '#ff4444',
                      '&:hover': {
                        backgroundColor: !newVehicle.disponible ? '#cc0000' : 'rgba(255, 68, 68, 0.1)',
                      }
                    }}
                  >
                    Non disponible
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000000', px: 4, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: '#FFD700' }}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#FFD700', color: '#000000', '&:hover': { backgroundColor: '#e6c200' } }}>
            {editingVehicle ? 'Mettre à jour' : 'Enregistrer'}
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
            Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000', p: 2 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: '#FFD700' }}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de la photo */}
      <Dialog
        open={photoModalOpen}
        onClose={handlePhotoModalClose}
        maxWidth="lg"
      >
        <DialogTitle sx={{ backgroundColor: '#000', color: '#FFD700' }}>
          {"Photo du véhicule"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#000', color: 'white', pt: 2 }}>
          <Box
            component="img"
            src={selectedPhoto}
            alt="Photo du véhicule"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000', p: 2 }}>
          <Button onClick={handlePhotoModalClose} sx={{ color: '#FFD700' }}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Vehicles;
