import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Chip, 
  Autocomplete, 
  IconButton, 
  Snackbar, 
  Alert,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  Grow,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Search, 
  Close, 
  Check, 
  ArrowBack,
  Refresh
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import axios from 'axios';
//import renderView from '../../components/D1/renderView';

// Configuration du thème avec les couleurs spécifiées
const theme = createTheme({
  palette: {
    primary: {
      main: '#50C878', // Esmeralda
    },
    secondary: {
      main: '#F5F5DC', // Bege
    },
    background: {
      default: '#F5F5F5', // Off-white
    },
  },
});

// Composant stylisé pour les cartes
const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 24px 0 rgba(0,0,0,0.15)',
  },
}));

// Composant principal
const D1 = () => {
  const [domaines, setDomaines] = useState([]);
  const [postes, setPostes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [appartenances, setAppartenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // États pour les modals
  const [openDomaineModal, setOpenDomaineModal] = useState(false);
  const [openPosteModal, setOpenPosteModal] = useState(false);
  const [openCompetenceModal, setOpenCompetenceModal] = useState(false);
  const [openAppartenanceModal, setOpenAppartenanceModal] = useState(false);
  
  // États pour les formulaires
  const [currentDomaine, setCurrentDomaine] = useState({ id: null, nom_domaine: '' });
  const [currentPoste, setCurrentPoste] = useState({ id: null, nom_poste: '', domaine: '' });
  const [currentCompetence, setCurrentCompetence] = useState({ id: null, nom_competence: '' });
  const [currentAppartenance, setCurrentAppartenance] = useState({ 
    id: null, 
    poste: '', 
    competence: '', 
    coefficient: 1.0,
    newCompetence: false,
    newCompetenceName: ''
  });
  
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [view, setView] = useState('domaines'); // 'domaines', 'postes', 'competences'
  
  // Charger les données depuis l'API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [domainesRes, competencesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`),
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`)
      ]);
      
      setDomaines(domainesRes.data);
      setCompetences(competencesRes.data);
      
      // Extraire les postes et appartenances
      const allPostes = [];
      const allAppartenances = [];
      
      domainesRes.data.forEach(domaine => {
        domaine.postes.forEach(poste => {
          allPostes.push({
            id: poste.id,
            nom_poste: poste.nom_poste,
            domaine: domaine.id
          });
          
          poste.competences.forEach(competence => {
            allAppartenances.push({
              id: competence.id,
              poste: poste.id,
              competence: competence.id_comp,
              coefficient: competence.coefficient
            });
          });
        });
      });
      
      setPostes(allPostes);
      setAppartenances(allAppartenances);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Gestion des erreurs et succès
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };
  
  // Fonctions CRUD pour Domaines
  const handleAddDomaine = () => {
    setCurrentDomaine({ id: null, nom_domaine: '' });
    setOpenDomaineModal(true);
  };
  
  const handleEditDomaine = (domaine) => {
    setCurrentDomaine(domaine);
    setOpenDomaineModal(true);
  };
  
  const handleDeleteDomaine = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/domaines/${id}/`);
      setSuccess('Domaine supprimé avec succès');
      fetchData();
    } catch (err) {
      setError('Erreur lors de la suppression du domaine');
    }
  };
  
  const handleSubmitDomaine = async () => {
    try {
      if (currentDomaine.id) {
        await axios.put(`${process.env.REACT_APP_BACK_URL}/api/domaines/${currentDomaine.id}/`, currentDomaine);
        setSuccess('Domaine mis à jour avec succès');
      } else {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/domaines/`, currentDomaine);
        setSuccess('Domaine ajouté avec succès');
      }
      setOpenDomaineModal(false);
      fetchData();
    } catch (err) {
      setError('Erreur lors de la sauvegarde du domaine');
    }
  };
  
  // Fonctions CRUD pour Postes
  const handleAddPoste = () => {
    setCurrentPoste({ id: null, nom_poste: '', domaine: '' });
    setOpenPosteModal(true);
  };
  
  const handleEditPoste = (poste) => {
    setCurrentPoste(poste);
    setOpenPosteModal(true);
  };
  
  const handleDeletePoste = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/postes/${id}/`);
      setSuccess('Poste supprimé avec succès');
      fetchData();
    } catch (err) {
      setError('Erreur lors de la suppression du poste');
    }
  };
  
  const handleSubmitPoste = async () => {
    try {
      if (currentPoste.id) {
        await axios.put(`${process.env.REACT_APP_BACK_URL}/api/postes/${currentPoste.id}/`, currentPoste);
        setSuccess('Poste mis à jour avec succès');
      } else {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/postes/`, currentPoste);
        setSuccess('Poste ajouté avec succès');
      }
      setOpenPosteModal(false);
      fetchData();
    } catch (err) {
      setError('Erreur lors de la sauvegarde du poste');
    }
  };
  
  // Fonctions CRUD pour Compétences
  const handleAddCompetence = () => {
    setCurrentCompetence({ id: null, nom_competence: '' });
    setOpenCompetenceModal(true);
  };
  
  const handleEditCompetence = (competence) => {
    setCurrentCompetence(competence);
    setOpenCompetenceModal(true);
  };
  
  const handleDeleteCompetence = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/competences/${id}/`);
      setSuccess('Compétence supprimée avec succès');
      fetchData();
    } catch (err) {
      setError('Erreur lors de la suppression de la compétence');
    }
  };
  
  const handleSubmitCompetence = async () => {
    try {
      if (currentCompetence.id) {
        await axios.put(`${process.env.REACT_APP_BACK_URL}/api/competences/${currentCompetence.id}/`, currentCompetence);
        setSuccess('Compétence mise à jour avec succès');
      } else {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/competences/`, currentCompetence);
        setSuccess('Compétence ajoutée avec succès');
      }
      setOpenCompetenceModal(false);
      fetchData();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la compétence');
    }
  };
  
  // Fonctions CRUD pour AppartenanceCompétencePoste
  const handleAddAppartenance = (posteId) => {
    setCurrentAppartenance({ 
      id: null, 
      poste: posteId, 
      competence: '', 
      coefficient: 1.0,
      newCompetence: false,
      newCompetenceName: ''
    });
    setOpenAppartenanceModal(true);
  };
  
  const handleEditAppartenance = (appartenance) => {
    setCurrentAppartenance({ 
      ...appartenance,
      newCompetence: false,
      newCompetenceName: ''
    });
    setOpenAppartenanceModal(true);
  };
  
  const handleDeleteAppartenance = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/appartenances/${id}/`);
      setSuccess('Association supprimée avec succès');
      fetchData();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'association');
    }
  };
  
  const handleSubmitAppartenance = async () => {
    try {
      let competenceId = currentAppartenance.competence;
      
      // Si c'est une nouvelle compétence
      if (currentAppartenance.newCompetence && currentAppartenance.newCompetenceName) {
        const newCompetence = {
          nom_competence: currentAppartenance.newCompetenceName
        };
        
        const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/competences/`, newCompetence);
        competenceId = response.data.id;
      }
      
      const appartenanceData = {
        poste: currentAppartenance.poste,
        id_comp:competenceId,
        competence: competenceId,
        coefficient: currentAppartenance.coefficient
      };
      
      if (currentAppartenance.id) {
        await axios.put(`${process.env.REACT_APP_BACK_URL}/api/appartenances/${currentAppartenance.id}/`, appartenanceData);
        setSuccess('Association mise à jour avec succès');
      } else {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`, appartenanceData);
        setSuccess('Association ajoutée avec succès');
      }
      
      setOpenAppartenanceModal(false);
      fetchData();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'association');
    }
  };
  
  // Filtrage des données
  const filteredDomaines = domaines.filter(domaine => 
    domaine.nom_domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPostes = postes.filter(poste => {
    const matchesSearch = poste.nom_poste.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomaine = selectedDomaine ? poste.domaine == selectedDomaine : true;
    return matchesSearch && matchesDomaine;
  });
  
  const filteredCompetences = competences.filter(competence => 
    competence.nom_competence.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Rendu conditionnel basé sur la vue
  const renderView = () => {
    switch (view) {
      case 'domaines':
        return (
          <Fade in={true} timeout={500}>
            <div>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary">Gestion des Domaines</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Add />}
                  onClick={handleAddDomaine}
                >
                  Ajouter un domaine
                </Button>
              </Box>
              
              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <TableContainer component={StyledCard}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>ID</TableCell> */}
                        <TableCell>Nom du domaine</TableCell>
                        <TableCell>Nombre de postes</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDomaines.map((domaine) => (
                        <TableRow key={domaine.id}>
                          {/* <TableCell>{domaine.id}</TableCell> */}
                          <TableCell>{domaine.nom_domaine}</TableCell>
                          <TableCell>{domaine.postes.length}</TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Tooltip title="Voir les postes">
                                <IconButton 
                                  color="primary" 
                                  onClick={() => {
                                    setSelectedDomaine(domaine.id);
                                    setView('postes');
                                  }}
                                >
                                  <Search />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Modifier">
                                <IconButton 
                                  color="secondary" 
                                  onClick={() => handleEditDomaine(domaine)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleDeleteDomaine(domaine.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </Fade>
        );
        
      case 'postes':
        return (
          <Fade in={true} timeout={500}>
            <div>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton onClick={() => setView('domaines')}>
                    <ArrowBack />
                  </IconButton>
                  <Typography variant="h4" color="primary">
                    Gestion des Postes
                    {selectedDomaine && ` - ${domaines.find(d => d.id == selectedDomaine)?.nom_domaine}`}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Add />}
                  onClick={handleAddPoste}
                >
                  Ajouter un poste
                </Button>
              </Box>
              
              <Box mb={3}>
                <FormControl fullWidth>
                  <InputLabel>Filtrer par domaine</InputLabel>
                  <Select
                    value={selectedDomaine}
                    onChange={(e) => setSelectedDomaine(e.target.value)}
                    label="Filtrer par domaine"
                  >
                    <MenuItem value="">Tous les domaines</MenuItem>
                    {domaines.map((domaine) => (
                      <MenuItem key={domaine.id} value={domaine.id}>
                        {domaine.nom_domaine}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <TableContainer component={StyledCard}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>ID</TableCell> */}
                        <TableCell>Nom du poste</TableCell>
                        <TableCell>Domaine</TableCell>
                        <TableCell>Compétences</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPostes.map((poste) => {
                        const domaine = domaines.find(d => d.id == poste.domaine);
                        const posteDetails = domaine?.postes.find(p => p.id == poste.id);
                        
                        return (
                          <TableRow key={poste.id}>
                            {/* <TableCell>{poste.id}</TableCell> */}
                            <TableCell>{poste.nom_poste}</TableCell>
                            <TableCell>{domaine?.nom_domaine}</TableCell>
                            <TableCell>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                {posteDetails?.competences.map(comp => (
                                  <Chip 
                                    key={comp.id}
                                    label={`${comp.competence_nom} (${comp.coefficient})`}
                                    color="primary"
                                    size="small"
                                  />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" gap={1}>
                                <Tooltip title="Voir les compétences">
                                  <IconButton 
                                    color="primary" 
                                    onClick={() => {
                                      setCurrentPoste(poste);
                                      setView('competences');
                                    }}
                                  >
                                    <Search />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Modifier">
                                  <IconButton 
                                    color="secondary" 
                                    onClick={() => handleEditPoste(poste)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                  <IconButton 
                                    color="error" 
                                    onClick={() => handleDeletePoste(poste.id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Ajouter une compétence">
                                  <IconButton 
                                    color="primary" 
                                    onClick={() => handleAddAppartenance(poste.id)}
                                  >
                                    <Add />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </Fade>
        );
        
      case 'competences':
        return (
          <Fade in={true} timeout={500}>
            <div>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton onClick={() => setView('postes')}>
                    <ArrowBack />
                  </IconButton>
                  <Typography variant="h4" color="primary">
                    Compétences pour le poste: {currentPoste.nom_poste}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Add />}
                  onClick={() => handleAddAppartenance(currentPoste.id)}
                >
                  Ajouter une compétence
                </Button>
              </Box>
              
              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <TableContainer component={StyledCard}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>ID</TableCell> */}
                        <TableCell>Compétence</TableCell>
                        <TableCell>Coefficient</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appartenances
                        .filter(a => a.poste == currentPoste.id)
                        
                        .map((appartenance) => {
                          const competence = competences.find(c => c.id == appartenance.competence);
                          console.log(`a`)
                          //console.log(competences)
                          //console.log(appartenance)
                          //console.log(appartenances)
                          return (
                            <TableRow key={appartenance.id}>
                              {/* <TableCell>{appartenance.id}</TableCell> */}
                              <TableCell>{competence?.nom_competence}</TableCell>
                              <TableCell>{appartenance.coefficient}</TableCell>
                              <TableCell>
                                <Box display="flex" gap={1}>
                                  <Tooltip title="Modifier">
                                    <IconButton 
                                      color="secondary" 
                                      onClick={() => handleEditAppartenance(appartenance)}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Supprimer">
                                    <IconButton 
                                      color="error" 
                                      onClick={() => handleDeleteAppartenance(appartenance.id)}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </Fade>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Barre de recherche */}
          <Box mb={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                  }}
                />
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<Refresh />}
                  onClick={fetchData}
                >
                  Actualiser
                </Button>
              </Box>
            </Paper>
          </Box>
          
          {/* Contenu principal */}
          {renderView()}
          
          {/* Modals */}
          {/* Modal Domaine */}
          <Dialog 
            open={openDomaineModal} 
            onClose={() => setOpenDomaineModal(false)}
            TransitionComponent={Slide}
          >
            <DialogTitle>
              {currentDomaine.id ? 'Modifier Domaine' : 'Ajouter un Domaine'}
            </DialogTitle>
            <DialogContent>
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Nom du domaine"
                  value={currentDomaine.nom_domaine}
                  onChange={(e) => setCurrentDomaine({ ...currentDomaine, nom_domaine: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDomaineModal(false)}>Annuler</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitDomaine}
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Modal Poste */}
          <Dialog 
            open={openPosteModal} 
            onClose={() => setOpenPosteModal(false)}
            TransitionComponent={Slide}
          >
            <DialogTitle>
              {currentPoste.id ? 'Modifier Poste' : 'Ajouter un Poste'}
            </DialogTitle>
            <DialogContent>
              <Box mt={2} mb={3}>
                <TextField
                  fullWidth
                  label="Nom du poste"
                  value={currentPoste.nom_poste}
                  onChange={(e) => setCurrentPoste({ ...currentPoste, nom_poste: e.target.value })}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel>Domaine</InputLabel>
                <Select
                  value={currentPoste.domaine}
                  onChange={(e) => setCurrentPoste({ ...currentPoste, domaine: e.target.value })}
                  label="Domaine"
                >
                  {domaines.map((domaine) => (
                    <MenuItem key={domaine.id} value={domaine.id}>
                      {domaine.nom_domaine}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPosteModal(false)}>Annuler</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitPoste}
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Modal Compétence */}
          <Dialog 
            open={openCompetenceModal} 
            onClose={() => setOpenCompetenceModal(false)}
            TransitionComponent={Slide}
          >
            <DialogTitle>
              {currentCompetence.id ? 'Modifier Compétence' : 'Ajouter une Compétence'}
            </DialogTitle>
            <DialogContent>
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Nom de la compétence"
                  value={currentCompetence.nom_competence}
                  onChange={(e) => setCurrentCompetence({ ...currentCompetence, nom_competence: e.target.value })}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCompetenceModal(false)}>Annuler</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitCompetence}
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Modal Appartenance Compétence-Poste */}
          <Dialog 
            open={openAppartenanceModal} 
            onClose={() => setOpenAppartenanceModal(false)}
            TransitionComponent={Slide}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {currentAppartenance.id ? 'Modifier Association' : 'Ajouter une Association'}
            </DialogTitle>
            <DialogContent>
              <Box mt={2} mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Poste: {postes.find(p => p.id == currentAppartenance.poste)?.nom_poste}
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box mb={3}>
                  <FormControl fullWidth>
                    <InputLabel>Type de compétence</InputLabel>
                    <Select
                      value={currentAppartenance.newCompetence ? 'new' : 'existing'}
                      onChange={(e) => setCurrentAppartenance({ 
                        ...currentAppartenance, 
                        newCompetence: e.target.value === 'new',
                        competence: ''
                      })}
                      label="Type de compétence"
                    >
                      <MenuItem value="existing">Compétence existante</MenuItem>
                      <MenuItem value="new">Nouvelle compétence</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {currentAppartenance.newCompetence ? (
                  <TextField
                    fullWidth
                    label="Nom de la nouvelle compétence"
                    value={currentAppartenance.newCompetenceName}
                    onChange={(e) => setCurrentAppartenance({ 
                      ...currentAppartenance, 
                      newCompetenceName: e.target.value 
                    })}
                  />
                ) : (
                  <Autocomplete
                    options={competences}
                    getOptionLabel={(option) => option.nom_competence}
                    value={competences.find(c => c.id == currentAppartenance.competence) || null}
                    onChange={(_, newValue) => setCurrentAppartenance({ 
                      ...currentAppartenance, 
                      competence: newValue?.id || '' 
                    })}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Sélectionner une compétence" 
                        fullWidth 
                      />
                    )}
                  />
                )}
                
                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Coefficient"
                    type="number"
                    inputProps={{ min: 0.1, step: 0.1 }}
                    value={currentAppartenance.coefficient}
                    onChange={(e) => setCurrentAppartenance({ 
                      ...currentAppartenance, 
                      coefficient: parseFloat(e.target.value) || 0 
                    })}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAppartenanceModal(false)}>Annuler</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitAppartenance}
                disabled={
                  (currentAppartenance.newCompetence && !currentAppartenance.newCompetenceName) ||
                  (!currentAppartenance.newCompetence && !currentAppartenance.competence)
                }
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Notifications */}
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
          
          <Snackbar 
            open={!!success} 
            autoHideDuration={6000} 
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default D1;