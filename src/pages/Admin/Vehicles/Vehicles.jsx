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
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Tooltip,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  IconButton,
  TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { voitureService } from '../../../services';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ 
    Marque: '', 
    Modele: '', 
    Annee: '', 
    Immatriculation: '',
    Categorie: 'Citadine',
    Type: 'Essence',
    Photo: '',
    Disponibilite: true,
    Prix: ''
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
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrors({}); };
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = name === 'Disponibilite' ? checked : value;
    setNewVehicle({ ...newVehicle, [name]: newValue });
  };

  const handleSave = async () => {

    
    // Vérification des champs obligatoires
    const newErrors = {};
    if (!newVehicle.Marque || !newVehicle.Marque.trim()) newErrors.Marque = "La marque est obligatoire";
    if (!newVehicle.Modele || !newVehicle.Modele.trim()) newErrors.Modele = "Le modèle est obligatoire";
    if (!newVehicle.Annee) newErrors.Annee = "L'année est obligatoire";
    if (!newVehicle.Immatriculation || !newVehicle.Immatriculation.trim()) newErrors.Immatriculation = "L'immatriculation est obligatoire";
    if (!newVehicle.Categorie || !newVehicle.Categorie.trim()) newErrors.Categorie = "La catégorie est obligatoire";
    if (!newVehicle.Prix) newErrors.Prix = "Le prix est obligatoire";
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    
    try {
      // Préparer les données pour le backend
      const vehicleToSave = {
        Marque: newVehicle.Marque ? newVehicle.Marque.trim() : '',
        Modele: newVehicle.Modele ? newVehicle.Modele.trim() : '',
        Annee: newVehicle.Annee ? String(newVehicle.Annee) : '',
        Immatriculation: newVehicle.Immatriculation ? newVehicle.Immatriculation.trim() : '',
        Categorie: newVehicle.Categorie ? newVehicle.Categorie.trim() : '',
        Type: newVehicle.Type ? newVehicle.Type.trim() : '',
        Prix: parseFloat(newVehicle.Prix) || 0,
        Disponibilite: newVehicle.Disponibilite ? 1 : 0,
        Photo: newVehicle.Photo || ''
      };
      
      let response, vehicleId;
      
      // ÉTAPE 1: Créer/Mettre à jour le véhicule sur le serveur
      if (editingVehicle) {
        // Mise à jour d'un véhicule existant
        vehicleId = editingVehicle.VoitureID;
        response = await voitureService.updateVoiture(vehicleId, vehicleToSave);
      } else {
        // Ajout d'un nouveau véhicule
        response = await voitureService.createVoiture(vehicleToSave);
        vehicleId = response.id || response.VoitureID || response.insertId;
      }
      
      // ÉTAPE 2: Gérer le téléchargement de la photo si nécessaire
      let photoURL = newVehicle.Photo;
      if (photoFile) {
        await voitureService.uploadVoiturePhoto(vehicleId, photoFile);
        const timestamp = Date.now();
        // Utiliser l'URL de base de l'API sans dépendre de process.env qui n'est pas disponible dans le navigateur
        photoURL = `http://localhost:3000/uploads/vehicules/${vehicleId}.jpg?t=${timestamp}`;
      }
      
      // ÉTAPE 3: Préparer le nouvel objet véhicule pour l'affichage immédiat
      const updatedVehicle = {
        VoitureID: vehicleId,
        Marque: vehicleToSave.Marque,
        Modele: vehicleToSave.Modele,
        Annee: vehicleToSave.Annee,
        Immatriculation: vehicleToSave.Immatriculation,
        Categorie: vehicleToSave.Categorie,
        Type: vehicleToSave.Type,
        Prix: vehicleToSave.Prix,
        Disponibilite: Boolean(vehicleToSave.Disponibilite),
        Photo: photoURL,
        _photoTimestamp: Date.now()
      };
      
      // ÉTAPE 4: Mettre à jour l'état local IMMÉDIATEMENT
      if (editingVehicle) {
        // Si c'est une modification, remplacer le véhicule existant
        const updatedVehicles = vehicles.map(v => 
          v.VoitureID === vehicleId ? updatedVehicle : v
        );
        setVehicles(updatedVehicles);
      } else {
        // Si c'est un nouvel ajout, l'ajouter au début (tri par ID décroissant)
        setVehicles([updatedVehicle, ...vehicles]);
      }
      
      // Afficher la notification de succès
      setSnackbar({
        open: true,
        message: editingVehicle ? 'Véhicule mis à jour avec succès' : 'Véhicule ajouté avec succès',
        severity: 'success'
      });
      
      // Réinitialiser le formulaire et fermer la boîte de dialogue
      setNewVehicle({ 
        Marque: '', 
        Modele: '', 
        Annee: '', 
        Immatriculation: '',
        Categorie: '',
        Type: '',
        Photo: '',
        Disponibilite: true,
        Prix: ''
      });
      setPhotoFile(null);
      setPhotoPreview('');
      setErrors({});
      setEditingVehicle(null);
      handleClose();
      
      // Actualiser également depuis le serveur en arrière-plan (après un délai)
      setTimeout(() => {
        fetchVehicles().catch(() => {/* Erreur gérée par les notifications UI */});
      }, 1000);
    } catch (error) {
      // Erreur gérée par les notifications UI
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'enregistrement du véhicule',
        severity: 'error'
      });
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      Marque: vehicle.Marque,
      Modele: vehicle.Modele,
      Annee: vehicle.Annee,
      Immatriculation: vehicle.Immatriculation,
      Categorie: vehicle.Categorie,
      Type: vehicle.Type,
      Photo: vehicle.Photo,
      Disponibilite: vehicle.Disponibilite,
      Prix: vehicle.Prix
    });
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (confirmDeleteId) {
      try {
        await voitureService.deleteVoiture(confirmDeleteId);
        setSnackbar({
          open: true,
          message: 'Véhicule supprimé avec succès',
          severity: 'success'
        });
        fetchVehicles();
      } catch (error) {
        // Erreur gérée par les notifications UI
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression du véhicule',
          severity: 'error'
        });
      }
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
    setPage(0); // Réinitialiser la page lors d'une nouvelle recherche
  };

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setPhotoModalOpen(true);
  };

  const handlePhotoModalClose = () => {
    setPhotoModalOpen(false);
  };

  // Gestionnaires d'événements pour la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrer les véhicules en fonction du terme de recherche
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.Marque.toLowerCase().includes(searchLower) ||
      vehicle.Modele.toLowerCase().includes(searchLower) ||
      vehicle.Immatriculation.toLowerCase().includes(searchLower) ||
      vehicle.Categorie.toLowerCase().includes(searchLower) ||
      vehicle.Type.toLowerCase().includes(searchLower) ||
      vehicle.Annee.toString().includes(searchLower) ||
      vehicle.Prix.toString().includes(searchLower)
    );
  });

  // Appliquer la pagination aux véhicules filtrés
  const paginatedVehicles = filteredVehicles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await voitureService.getAllVoitures();
      
      // Transformation des données pour s'assurer que tous les champs sont présents
      // et pour gérer les différences de noms entre la base de données et le frontend
      const formattedData = data.map(vehicle => {
        return {
          VoitureID: vehicle.VoitureID,
          Marque: vehicle.Marque || '',
          Modele: vehicle['Modèle'] || vehicle.Modele || '',  // Gestion de l'accent dans le nom du champ
          Annee: vehicle.Annee || '',
          Immatriculation: vehicle.Immatriculation || '',
          Categorie: vehicle.Categorie || '',
          Type: vehicle.Type || '',
          Prix: vehicle.Prix || 0,
          Disponibilite: vehicle['Disponibilité'] !== undefined ? vehicle['Disponibilité'] : (vehicle.Disponibilite !== undefined ? vehicle.Disponibilite : false),  // Gestion de l'accent
          Photo: vehicle.Photo || ''
        };
      });
      
      // Trier les véhicules par ordre décroissant d'ID (les derniers ajoutés en premier)
      const sortedData = [...formattedData].sort((a, b) => b.VoitureID - a.VoitureID);
      setVehicles(sortedData);
    } catch (error) {
      // Erreur gérée par les notifications UI
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des véhicules',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: { xs: 2, sm: 3 }, 
        gap: { xs: 1, sm: 2 } 
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          mb: { xs: 1, sm: 0 },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          Gestion des véhicules
        </Typography>
        <Button 
          onClick={handleOpen} 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          fullWidth={window.innerWidth < 600}
          sx={{ height: { xs: 40, sm: 'auto' } }}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      <Box sx={{ 
        mb: { xs: 2, sm: 3 }, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: { xs: 1, sm: 2 } 
      }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un véhicule"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
      </Box>

      {/* Vue mobile (affichée uniquement sur les petits écrans) */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <Paper 
              key={vehicle.VoitureID} 
              elevation={3} 
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 2,
                borderLeft: vehicle.Disponibilite ? '5px solid #4caf50' : '5px solid #f44336',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4} sm={3}>
                  {vehicle.Photo ? (
                    <Box
                      component="img"
                      src={`http://localhost:4000/uploads/vehicules/${vehicle.Photo}.jpg`}
                      alt={`${vehicle.Marque} ${vehicle.Modele}`}
                      onClick={() => handlePhotoClick(`http://localhost:4000/uploads/vehicules/${vehicle.Photo}.jpg`)}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                      }}
                      onError={(e) => {
                        const currentSrc = e.target.src;
                        if (currentSrc.endsWith('.jpg')) {
                          e.target.src = currentSrc.replace('.jpg', '.png');
                        } else if (currentSrc.endsWith('.png')) {
                          e.target.src = currentSrc.replace('.png', '.jpeg');
                        } else if (currentSrc.endsWith('.jpeg')) {
                          e.target.src = `https://ui-avatars.com/api/?name=${vehicle.Marque}+${vehicle.Modele}&background=random&color=fff&size=150`;
                        }
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f0f0f0',
                        borderRadius: 1,
                        border: '1px solid #ddd'
                      }}
                    >
                      <DirectionsCarIcon sx={{ fontSize: 40 }} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {vehicle.Marque} {vehicle.Modele}
                    </Typography>
                    <Chip 
                      label={vehicle.Disponibilite ? "Disponible" : "Non disponible"} 
                      color={vehicle.Disponibilite ? "success" : "error"} 
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Année: <span style={{ color: 'text.primary', fontWeight: 'medium' }}>{vehicle.Annee}</span></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Prix: <span style={{ color: 'text.primary', fontWeight: 'medium' }}>{vehicle.Prix} DH/jour</span></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Immatriculation: <span style={{ color: 'text.primary', fontWeight: 'medium' }}>{vehicle.Immatriculation}</span></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Catégorie: <span style={{ color: 'text.primary', fontWeight: 'medium' }}>{vehicle.Categorie}</span></Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton color="primary" size="small" onClick={() => handleEdit(vehicle)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDeleteClick(vehicle.VoitureID)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            {searchTerm ? "Aucun véhicule ne correspond à votre recherche" : "Aucun véhicule trouvé"}
          </Paper>
        )}
      </Box>

      {/* Vue bureau (affichée uniquement sur les grands écrans) */}
      <Paper elevation={3} sx={{ mb: 3, p: 2, borderRadius: 2, display: { xs: 'none', md: 'block' } }}>
        <TableContainer sx={{ borderRadius: 2, overflow: 'auto', maxWidth: '100%' }}>
          <Table
            sx={{
              minWidth: 650,
              tableLayout: 'fixed',
              '& .MuiTableRow-root:nth-of-type(odd)': { backgroundColor: 'action.hover' },
              '& .MuiTableRow-root:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
              '& .MuiTableCell-root': { padding: '16px 8px', borderSpacing: '2px' },
              borderCollapse: 'separate',
              borderSpacing: '0 8px'
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width="80px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>Photo</TableCell>
                <TableCell width="100px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white' }}>Marque</TableCell>
                <TableCell width="100px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white' }}>Modèle</TableCell>
                <TableCell width="80px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white' }}>Année</TableCell>
                <TableCell width="120px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white' }}>Immatriculation</TableCell>
                <TableCell width="100px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white' }}>Catégorie</TableCell>
                <TableCell width="80px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white' }}>Type</TableCell>
                <TableCell width="100px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white', textAlign: 'center' }}>Prix (DH/jour)</TableCell>
                <TableCell width="100px" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: 'white', textAlign: 'center' }}>Disponibilité</TableCell>
                <TableCell width="120px" align="center" sx={{ fontWeight: 'bold', backgroundColor: '#000', color: '#FFFFFF', position: 'sticky', right: 0, zIndex: 2, borderTopRightRadius: 4, borderBottomRightRadius: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((vehicle, index) => (
                  <TableRow key={vehicle.VoitureID} sx={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                  }}>
                    <TableCell sx={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
                      {vehicle.Photo ? (
                        <Box
                          component="img"
                          src={`http://localhost:4000/uploads/vehicules/voiture-${vehicle.VoitureID}${vehicle._photoTimestamp ? `?t=${vehicle._photoTimestamp}` : ''}`}
                          alt={`${vehicle.Marque} ${vehicle.Modele}`}
                          onClick={() => handlePhotoClick(`http://localhost:4000/uploads/vehicules/voiture-${vehicle.VoitureID}${vehicle._photoTimestamp ? `?t=${vehicle._photoTimestamp}` : ''}`)}
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
                          onError={(e) => {
                            // Essayer avec d'autres extensions si l'image ne se charge pas
                            const currentSrc = e.target.src;
                            const baseUrl = currentSrc.split('?')[0]; // Enlever les paramètres de requête
                            
                            // Vérifier si l'URL contient déjà une extension
                            if (!baseUrl.match(/\.(jpg|jpeg|png)$/i)) {
                              // Essayer d'abord avec .jpg
                              e.target.src = `${baseUrl}.jpg${currentSrc.includes('?') ? currentSrc.substring(currentSrc.indexOf('?')) : ''}`;
                            } else if (baseUrl.endsWith('.jpg')) {
                              e.target.src = baseUrl.replace('.jpg', '.png') + (currentSrc.includes('?') ? currentSrc.substring(currentSrc.indexOf('?')) : '');
                            } else if (baseUrl.endsWith('.png')) {
                              e.target.src = baseUrl.replace('.png', '.jpeg') + (currentSrc.includes('?') ? currentSrc.substring(currentSrc.indexOf('?')) : '');
                            } else if (baseUrl.endsWith('.jpeg')) {
                              // Si toutes les extensions échouent, utiliser l'avatar générique
                              e.target.src = `https://ui-avatars.com/api/?name=${vehicle.Marque}+${vehicle.Modele}&background=FFD700&color=000&size=150`;
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
                    <TableCell>{vehicle.Marque}</TableCell>
                    <TableCell>{vehicle.Modele}</TableCell>
                    <TableCell>{vehicle.Annee}</TableCell>
                    <TableCell>{vehicle.Immatriculation}</TableCell>
                    <TableCell>{vehicle.Categorie}</TableCell>
                    <TableCell>{vehicle.Type}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{vehicle.Prix} DH/jour</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={vehicle.Disponibilite ? "Disponible" : "Non disponible"} 
                        color={vehicle.Disponibilite ? "success" : "error"} 
                        size="small"
                        sx={{
                          backgroundColor: vehicle.Disponibilite ? '#FFD700' : '#ff4444',
                          color: vehicle.Disponibilite ? '#000000' : '#ffffff',
                          fontWeight: 'bold',
                          '& .MuiChip-label': {
                            px: 2
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ position: 'sticky', right: 0, zIndex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleEdit(vehicle)}
                          size="small"
                          sx={{ 
                            p: 0,
                            '&:hover': { 
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Avatar sx={{ width: 30, height: 30, bgcolor: '#FFD700' }}>
                            <EditIcon fontSize="small" sx={{ color: '#000' }} />
                          </Avatar>
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteClick(vehicle.VoitureID)}
                          size="small"
                          sx={{ 
                            p: 0,
                            '&:hover': { 
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Avatar sx={{ width: 30, height: 30, bgcolor: '#ff4444' }}>
                            <DeleteIcon fontSize="small" sx={{ color: '#FFF' }} />
                          </Avatar>
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    {searchTerm ? "Aucun véhicule ne correspond à votre recherche" : "Aucun véhicule trouvé"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredVehicles.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          sx={{
            '.MuiTablePagination-selectLabel': { marginBottom: 0 },
            '.MuiTablePagination-displayedRows': { marginBottom: 0 },
            '.MuiTablePagination-select': { paddingTop: 0, paddingBottom: 0 },
            '.MuiTablePagination-selectIcon': { top: 0 },
            color: '#000',
            backgroundColor: '#f5f5f5',
            borderRadius: '0 0 8px 8px'
          }}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' } }}
        PaperProps={{ 
          sx: { 
            borderRadius: { xs: 2, md: 3 }, 
            maxWidth: { xs: '95vw', sm: '90vw', md: '800px' }, 
            margin: 'auto', 
            backgroundColor: '#000000', 
            overflow: 'hidden',
            height: { xs: 'auto', sm: 'auto' } // Assurer que la hauteur s'adapte au contenu sur mobile
          } 
        }}
      >
        <DialogTitle sx={{ 
            backgroundColor: '#FFD700', 
            color: '#000000', 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 1, 
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            fontWeight: 'bold' 
          }}>
          <DirectionsCarIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }} /> 
          {editingVehicle ? 'Modifier un véhicule' : 'Ajouter un véhicule'}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: '#000000',
            color: '#ffffff',
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            overflowY: 'auto',
            maxHeight: { xs: 'calc(100vh - 170px)', sm: 'calc(100vh - 200px)' }
          }}
        >
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {/* Message responsive pour l'upload de photo */}
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#aaaaaa', textAlign: 'center', mb: 1, display: { xs: 'block', sm: 'none' } }}>
                Remplissez les informations du véhicule et sélectionnez une photo
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Marque</Typography>
                <TextField
                  name="Marque"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.Marque}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                  error={!!errors.Marque}
                  helperText={errors.Marque}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Modèle</Typography>
                <TextField
                  name="Modele"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.Modele}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                  error={!!errors.Modele}
                  helperText={errors.Modele}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Année</Typography>
                <TextField
                  name="Annee"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.Annee}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                  error={!!errors.Annee}
                  helperText={errors.Annee}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Immatriculation</Typography>
                <TextField
                  name="Immatriculation"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.Immatriculation}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                  error={!!errors.Immatriculation}
                  helperText={errors.Immatriculation}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Catégorie</Typography>
                <FormControl fullWidth>
                  <Select
                    name="Categorie"
                    value={newVehicle.Categorie}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444444' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                      '& .MuiSelect-icon': { color: '#FFD700' }
                    }}
                  >
                    <MenuItem value="Citadine">Citadine</MenuItem>
                    <MenuItem value="Compacte">Compacte</MenuItem>
                    <MenuItem value="Berline">Berline</MenuItem>
                    <MenuItem value="Économique">Économique</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Crossover">Crossover</MenuItem>
                    <MenuItem value="4x4 / Tout-terrain">4x4 / Tout-terrain</MenuItem>
                    <MenuItem value="Break">Break</MenuItem>
                    <MenuItem value="Coupé">Coupé</MenuItem>
                    <MenuItem value="Cabriolet / Décapotable">Cabriolet / Décapotable</MenuItem>
                    <MenuItem value="Monospace">Monospace</MenuItem>
                    <MenuItem value="Minibus">Minibus</MenuItem>
                    <MenuItem value="Utilitaire">Utilitaire</MenuItem>
                    <MenuItem value="Pick-up">Pick-up</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Type</Typography>
                <FormControl fullWidth>
                  <Select
                    name="Type"
                    value={newVehicle.Type}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444444' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                      '& .MuiSelect-icon': { color: '#FFD700' }
                    }}
                  >
                    <MenuItem value="Essence">Essence</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Hybride">Hybride</MenuItem>
                    <MenuItem value="Hybride rechargeable (Plug-in)">Hybride rechargeable (Plug-in)</MenuItem>
                    <MenuItem value="Électrique">Électrique</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>Prix par jour (DH)</Typography>
                <TextField
                  name="Prix"
                  variant="outlined"
                  fullWidth
                  value={newVehicle.Prix}
                  onChange={handleChange}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#444444' },
                      '&:hover fieldset': { borderColor: '#FFD700' },
                      '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">DH</InputAdornment>,
                  }}
                  error={!!errors.Prix}
                  helperText={errors.Prix}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
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
                          Photo: e.target.files[0].name
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
            <Grid item xs={12} sm={6}>
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
                    variant={newVehicle.Disponibilite ? "contained" : "outlined"}
                    onClick={() => setNewVehicle({ ...newVehicle, Disponibilite: true })}
                    sx={{
                      flex: 1,
                      mr: 1,
                      backgroundColor: newVehicle.Disponibilite ? '#FFD700' : 'transparent',
                      color: newVehicle.Disponibilite ? '#000000' : '#FFD700',
                      borderColor: '#FFD700',
                      '&:hover': {
                        backgroundColor: newVehicle.Disponibilite ? '#e6c200' : 'rgba(255, 215, 0, 0.1)',
                      }
                    }}
                  >
                    Disponible
                  </Button>
                  <Button
                    variant={!newVehicle.Disponibilite ? "contained" : "outlined"}
                    onClick={() => setNewVehicle({ ...newVehicle, Disponibilite: false })}
                    sx={{
                      flex: 1,
                      ml: 1,
                      backgroundColor: !newVehicle.Disponibilite ? '#ff4444' : 'transparent',
                      color: !newVehicle.Disponibilite ? '#ffffff' : '#ff4444',
                      borderColor: '#ff4444',
                      '&:hover': {
                        backgroundColor: !newVehicle.Disponibilite ? '#cc0000' : 'rgba(255, 68, 68, 0.1)',
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
        <DialogActions sx={{ 
            backgroundColor: '#000000', 
            p: { xs: 2, sm: 3 }, 
            pt: { xs: 1, sm: 1 }, 
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
          <Button 
            onClick={handleClose} 
            color="inherit" 
            variant="outlined" 
            fullWidth={window.innerWidth < 600}
            sx={{ 
              borderColor: '#555555', 
              color: '#ffffff',
              mb: { xs: 1, sm: 0 },
              order: { xs: 2, sm: 1 }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            fullWidth={window.innerWidth < 600}
            sx={{ 
              backgroundColor: '#FFD700', 
              color: '#000000', 
              '&:hover': { backgroundColor: '#e6c200' },
              order: { xs: 1, sm: 2 },
              mb: { xs: 1, sm: 0 }
            }}
          >
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

      {/* Dialogue pour afficher les photos en plein écran */}
      <Dialog
        open={photoModalOpen}
        onClose={handlePhotoModalClose}
        maxWidth="lg"
        PaperProps={{ 
          sx: { 
            borderRadius: 2, 
            bgcolor: 'black',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#000', color: '#FFD700' }}>
          {"Photo du véhicule"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#000', color: 'white', pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            component="img"
            src={selectedPhoto}
            alt="Photo du véhicule"
            sx={{
              maxWidth: '90%',
              maxHeight: '70vh',
              objectFit: 'contain',
            }}
            onError={(e) => {
              // Essayer avec d'autres extensions si l'image ne se charge pas
              const currentSrc = e.target.src;
              const baseUrl = currentSrc.split('?')[0]; // Enlever les paramètres de requête
              
              // Vérifier si l'URL contient déjà une extension
              if (!baseUrl.match(/\.(jpg|jpeg|png)$/i)) {
                // Essayer d'abord avec .jpg
                e.target.src = `${baseUrl}.jpg${currentSrc.includes('?') ? currentSrc.substring(currentSrc.indexOf('?')) : ''}`;
              } else if (baseUrl.endsWith('.jpg')) {
                e.target.src = baseUrl.replace('.jpg', '.png') + (currentSrc.includes('?') ? currentSrc.substring(currentSrc.indexOf('?')) : '');
              } else if (baseUrl.endsWith('.png')) {
                e.target.src = baseUrl.replace('.png', '.jpeg') + (currentSrc.includes('?') ? currentSrc.substring(currentSrc.indexOf('?')) : '');
              } else if (baseUrl.endsWith('.jpeg')) {
                // Si toutes les extensions échouent, utiliser l'avatar générique
                const vehicleName = currentSrc.split('/').pop().split('.')[0];
                e.target.src = `https://ui-avatars.com/api/?name=${vehicleName}&background=FFD700&color=000&size=250`;
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#000', p: 2 }}>
          <Button onClick={handlePhotoModalClose} sx={{ color: '#FFD700' }}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Vehicles;
