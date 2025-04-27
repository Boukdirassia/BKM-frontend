import React, { useEffect, useState } from 'react';
import {
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
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Assistants = () => {
  const [assistants, setAssistants] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAssistant, setNewAssistant] = useState({ name: '', prenom: '', email: '', password: '', telephone: '', role: 'assistant' });
  const [editingAssistant, setEditingAssistant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    if (editingAssistant) {
      setEditingAssistant(null);
      setNewAssistant({ name: '', prenom: '', email: '', password: '', telephone: '', role: 'assistant' });
    }
  };
  const handleChange = (e) => setNewAssistant({ ...newAssistant, [e.target.name]: e.target.value });
  const handleSave = () => {
    // Validation des champs
    const newErrors = {};
    if (!newAssistant.name.trim()) newErrors.name = "Le nom est obligatoire";
    if (!newAssistant.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire";
    if (!newAssistant.email.trim()) newErrors.email = "L'email est obligatoire";
    if (!newAssistant.password.trim() && !editingAssistant) newErrors.password = "Le mot de passe est obligatoire";
    if (!newAssistant.telephone.trim()) newErrors.telephone = "Le téléphone est obligatoire";
    
    // Vérifier si des erreurs existent
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Si pas d'erreurs, procéder à l'enregistrement
    if (editingAssistant) {
      // Mise à jour d'un assistant existant
      setAssistants(prev => prev.map(item => 
        item.id === editingAssistant.id ? { ...newAssistant, id: item.id, password: newAssistant.password || item.password } : item
      ));
      setEditingAssistant(null);
    } else {
      // Ajout d'un nouvel assistant
      setAssistants(prev => [...prev, { ...newAssistant, id: prev.length + 1 }]);
    }
    // Réinitialiser le formulaire après enregistrement
    setNewAssistant({ name: '', prenom: '', email: '', password: '', telephone: '', role: 'assistant' });
    setErrors({});
    handleClose();
  };

  const handleEdit = (assistant) => {
    setEditingAssistant(assistant);
    setNewAssistant({
      name: assistant.name,
      prenom: assistant.prenom,
      email: assistant.email,
      password: '', // Ne pas afficher le mot de passe actuel pour des raisons de sécurité
      telephone: assistant.telephone,
      role: assistant.role
    });
    setOpen(true);
  };
  
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      setAssistants(prev => prev.filter(item => item.id !== confirmDeleteId));
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
  
  // Filtrer les assistants en fonction du terme de recherche
  const filteredAssistants = assistants.filter(assistant => 
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // TODO: récupérer les données depuis l'API
    setAssistants([]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Gestion des assistants
          </Typography>
          <Button onClick={handleOpen} variant="contained" color="primary" startIcon={<AddIcon />}>
            Ajouter un assistant
          </Button>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Rechercher un assistant"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
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
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Prénom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Téléphone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Role</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssistants.length > 0 ? (
                  filteredAssistants.map((assistant) => (
                    <TableRow key={assistant.id}>
                      <TableCell>{assistant.id}</TableCell>
                      <TableCell>{assistant.name}</TableCell>
                      <TableCell>{assistant.prenom}</TableCell>
                      <TableCell>{assistant.email}</TableCell>
                      <TableCell>{assistant.telephone}</TableCell>
                      <TableCell>{assistant.role}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" size="small" onClick={() => handleEdit(assistant)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDeleteClick(assistant.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {searchTerm ? "Aucun assistant ne correspond à votre recherche" : "Aucun assistant trouvé"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs" 
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
          }
        }}
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            width: '500px',
            maxWidth: '95vw',
            margin: 'auto',
            backgroundColor: '#000000',
            overflow: 'hidden'
          } 
        }}
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
          <PersonIcon /> {editingAssistant ? 'Modifier un assistant' : 'Ajouter un assistant'}
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            px: 4, 
            py: 4, 
            backgroundColor: '#000000',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#FFD700' }} /> Nom
            </Typography>
            <TextField
              name="name"
              fullWidth
              variant="outlined"
              value={newAssistant.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222222',
                  color: 'white',
                  '& fieldset': { borderColor: '#444444' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#f44336',
                  marginLeft: 0
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#FFD700' }} /> Prénom
            </Typography>
            <TextField
              name="prenom"
              fullWidth
              variant="outlined"
              value={newAssistant.prenom}
              onChange={handleChange}
              error={!!errors.prenom}
              helperText={errors.prenom}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222222',
                  color: 'white',
                  '& fieldset': { borderColor: '#444444' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#f44336',
                  marginLeft: 0
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: '#FFD700' }} /> Email
            </Typography>
            <TextField
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={newAssistant.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222222',
                  color: 'white',
                  '& fieldset': { borderColor: '#444444' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#f44336',
                  marginLeft: 0
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon sx={{ color: '#FFD700' }} /> Mot de passe
              {editingAssistant && <Typography variant="caption" sx={{ color: 'gray' }}>(Laisser vide pour conserver l'actuel)</Typography>}
            </Typography>
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              value={newAssistant.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#FFD700' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222222',
                  color: 'white',
                  '& fieldset': { borderColor: '#444444' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#f44336',
                  marginLeft: 0
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ color: '#FFD700' }} /> Téléphone
            </Typography>
            <TextField
              name="telephone"
              fullWidth
              variant="outlined"
              value={newAssistant.telephone}
              onChange={handleChange}
              error={!!errors.telephone}
              helperText={errors.telephone}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222222',
                  color: 'white',
                  '& fieldset': { borderColor: '#444444' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiFormHelperText-root': {
                  color: '#f44336',
                  marginLeft: 0
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon sx={{ color: '#FFD700' }} /> Role
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                name="role"
                value={newAssistant.role}
                onChange={handleChange}
                sx={{ 
                  backgroundColor: '#222222', 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444444' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
                  '& .MuiSvgIcon-root': { color: '#FFD700' },
                  '& .MuiSelect-select': { backgroundColor: '#222222' }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { 
                      backgroundColor: '#000000',
                      color: 'white',
                      '& .MuiMenuItem-root': { 
                        '&:hover': { backgroundColor: '#333333' },
                        '&.Mui-selected': { backgroundColor: '#444444' },
                        '&.Mui-selected:hover': { backgroundColor: '#555555' }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="assistant" sx={{ color: '#FFD700' }}>Assistant</MenuItem>
                <MenuItem value="admin" sx={{ color: '#FFD700' }}>Administrateur</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          backgroundColor: '#000000', 
          borderTop: '1px solid #333333',
          px: 4, 
          py: 3 
        }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              color: '#FFD700',
              '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.08)' }
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
              padding: '8px 20px',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#E6C200' }
            }}
          >
            {editingAssistant ? 'Mettre à jour' : 'Enregistrer'}
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
            Êtes-vous sûr de vouloir supprimer cet assistant ? Cette action est irréversible.
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

export default Assistants;
