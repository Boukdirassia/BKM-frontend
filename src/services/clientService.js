import api from './api';

const clientService = {
  // Récupérer tous les clients
  getAllClients: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  // Récupérer un client par son ID
  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw error;
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      // Préparer les données pour inclure les informations utilisateur
      const dataToSend = { ...clientData };
      
      // Si des informations utilisateur sont fournies, les inclure dans la requête
      if (clientData.email || clientData.telephone || clientData.nom_complet || clientData.password) {
        // Extraire le nom et prénom du nom complet si fourni
        let nom = '';
        let prenom = '';
        
        if (clientData.nom_complet) {
          const nameParts = clientData.nom_complet.split(' ');
          if (nameParts.length > 1) {
            nom = nameParts[0];
            prenom = nameParts.slice(1).join(' ');
          } else {
            nom = clientData.nom_complet;
          }
        }
        
        // Préparer les données utilisateur
        dataToSend.utilisateur = {
          Email: clientData.email,
          Telephone: clientData.telephone,
          Nom: nom,
          Prenom: prenom
        };
        
        // N'inclure le mot de passe que s'il est fourni et non vide
        if (clientData.password && clientData.password.trim() !== '') {
          dataToSend.utilisateur.Password = clientData.password;
        }
      }
      
      const response = await api.put(`/clients/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du client ${id}:`, error);
      throw error;
    }
  }
};

export default clientService;
