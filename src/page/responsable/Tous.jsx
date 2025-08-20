import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  createFilterOptions,
  Chip,
  Avatar,
  Collapse,
  Fade,
  Slide,
  Zoom,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  Search,
  Close,
  Check,
  Work,
  Category,
  Star,
  StarBorder
} from '@mui/icons-material';
import { styled } from '@mui/system';
// import { green, beige, lightBackground } from './theme';
import { green, beige, lightBackground } from './theme';

// Styles personnalisés
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)'
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: green[500],
  color: 'white',
  '&:hover': {
    backgroundColor: green[700],
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: beige[500],
  color: 'black',
  '&:hover': {
    backgroundColor: beige[700],
  },
}));

// Composant principal
export default function GestionCompetences() {
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDomaine, setCurrentDomaine] = useState(null);
  const [currentPoste, setCurrentPoste] = useState(null);
  const [newCompetence, setNewCompetence] = useState('');
  const [coefficient, setCoefficient] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedDomaine, setExpandedDomaine] = useState(null);
  const [expandedPoste, setExpandedPoste] = useState(null);
  const [competencesList, setCompetencesList] = useState([]);

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        if (!response.ok) throw new Error('Erreur de chargement des données');
        const data = await response.json();
        setDomaines(data);
        
        // Récupérer toutes les compétences existantes pour l'autocomplete
        const competencesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`);
        const competencesData = await competencesResponse.json();
        setCompetencesList(competencesData);
      } catch (err) {
        setError(err.message);
        showSnackbar(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Gestionnaire de snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Gestion de l'expansion des domaines/postes
  const handleExpandDomaine = (domaineId) => {
    setExpandedDomaine(expandedDomaine === domaineId ? null : domaineId);
  };

  const handleExpandPoste = (posteId) => {
    setExpandedPoste(expandedPoste === posteId ? null : posteId);
  };

  // Filtrage des données
  const filteredDomaines = domaines.filter(domaine => {
    const matchesSearch = domaine.nom_domaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domaine.postes.some(poste => 
        poste.nom_poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poste.competences.some(comp => 
          comp.competence_nom.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    
    return matchesSearch;
  });

  // Gestion de l'ajout de compétence
  const handleAddCompetence = async () => {
    try {
      let competenceId;
      
      // Vérifier si la compétence existe déjà
      const existingCompetence = competencesList.find(c => 
        c.nom_competence.toLowerCase() === newCompetence.toLowerCase()
      );
      
      if (!existingCompetence) {
        // Créer une nouvelle compétence
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom_competence: newCompetence })
        });
        
        if (!response.ok) throw new Error('Erreur lors de la création de la compétence');
        const newComp = await response.json();
        competenceId = newComp.id;
        
        // Mettre à jour la liste des compétences
        setCompetencesList([...competencesList, newComp]);
      } else {
        competenceId = existingCompetence.id;
      }
      
      // Ajouter la compétence au poste
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poste: currentPoste.id,
          competence: competenceId,
          coefficient: coefficient
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'association de la compétence');
      
      // Mettre à jour l'état local
      const updatedDomaines = domaines.map(domaine => {
        if (domaine.id === currentDomaine.id) {
          const updatedPostes = domaine.postes.map(poste => {
            if (poste.id === currentPoste.id) {
              return {
                ...poste,
                competences: [
                  ...poste.competences,
                  {
                    id: competenceId,
                    poste_nom: poste.nom_poste,
                    competence_nom: newCompetence,
                    coefficient: coefficient
                  }
                ]
              };
            }
            return poste;
          });
          return { ...domaine, postes: updatedPostes };
        }
        return domaine;
      });
      
      setDomaines(updatedDomaines);
      setOpenDialog(false);
      setNewCompetence('');
      setCoefficient(1);
      showSnackbar('Compétence ajoutée avec succès!');
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  // Gestion de la suppression d'une compétence
  const handleDeleteCompetence = async (domaineId, posteId, competenceId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenance-competence-poste/?poste=${posteId}&competence=${competenceId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression de la compétence');
      
      // Mettre à jour l'état local
      const updatedDomaines = domaines.map(domaine => {
        if (domaine.id === domaineId) {
          const updatedPostes = domaine.postes.map(poste => {
            if (poste.id === posteId) {
              return {
                ...poste,
                competences: poste.competences.filter(comp => comp.id !== competenceId)
              };
            }
            return poste;
          });
          return { ...domaine, postes: updatedPostes };
        }
        return domaine;
      });
      
      setDomaines(updatedDomaines);
      showSnackbar('Compétence supprimée avec succès!');
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  // Options pour l'autocomplete
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => option.nom_competence,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: green[700] }}>
          Gestion des Compétences
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gérez les domaines, postes et compétences associées
        </Typography>
      </Box>
      
      {/* Barre de recherche */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un domaine, poste ou compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <PrimaryButton fullWidth startIcon={<Add />}>
              Ajouter un domaine
            </PrimaryButton>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Contenu principal */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} sx={{ color: green[500] }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {filteredDomaines.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Aucun résultat trouvé</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Essayez de modifier vos critères de recherche
              </Typography>
            </Paper>
          ) : (
            filteredDomaines.map((domaine) => (
              <Slide key={domaine.id} direction="up" in={true} mountOnEnter unmountOnExit>
                <StyledPaper elevation={3}>
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleExpandDomaine(domaine.id)}
                  >
                    <Box display="flex" alignItems="center">
                      <Category sx={{ mr: 2, color: green[500], fontSize: '2rem' }} />
                      <Typography variant="h5" component="h2">
                        {domaine.nom_domaine}
                      </Typography>
                    </Box>
                    <IconButton>
                      {expandedDomaine === domaine.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                  
                  <Collapse in={expandedDomaine === domaine.id}>
                    <Box sx={{ mt: 2 }}>
                      {domaine.postes.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, ml: 6 }}>
                          Aucun poste défini pour ce domaine
                        </Typography>
                      ) : (
                        <List sx={{ width: '100%' }}>
                          {domaine.postes.map((poste) => (
                            <React.Fragment key={poste.id}>
                              <ListItem 
                                sx={{ 
                                  pl: 6,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleExpandPoste(poste.id)}
                              >
                                <Box display="flex" alignItems="center">
                                  <Work sx={{ mr: 2, color: green[500] }} />
                                  <ListItemText 
                                    primary={poste.nom_poste} 
                                    primaryTypographyProps={{ variant: 'h6' }}
                                  />
                                </Box>
                                <Box display="flex" alignItems="center">
                                  <Tooltip title="Nombre de compétences">
                                    <Chip 
                                      label={poste.competences.length} 
                                      size="small" 
                                      sx={{ mr: 1 }}
                                      avatar={<Avatar sx={{ bgcolor: green[100], color: green[800] }}>{poste.competences.length}</Avatar>}
                                    />
                                  </Tooltip>
                                  <IconButton>
                                    {expandedPoste === poste.id ? <ExpandLess /> : <ExpandMore />}
                                  </IconButton>
                                </Box>
                              </ListItem>
                              
                              <Collapse in={expandedPoste === poste.id}>
                                <Box sx={{ pl: 12, pr: 2, pt: 1 }}>
                                  {poste.competences.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                      Aucune compétence définie pour ce poste
                                    </Typography>
                                  ) : (
                                    <Grid container spacing={2}>
                                      {poste.competences.map((competence) => (
                                        <Grid item xs={12} sm={6} md={4} key={competence.id}>
                                          <Paper sx={{ p: 2, position: 'relative' }}>
                                            <Box display="flex" justifyContent="space-between">
                                              <Typography variant="subtitle1">
                                                {competence.competence_nom}
                                              </Typography>
                                              <IconButton 
                                                size="small" 
                                                sx={{ color: 'error.main' }}
                                                onClick={() => handleDeleteCompetence(domaine.id, poste.id, competence.id)}
                                              >
                                                <Delete fontSize="small" />
                                              </IconButton>
                                            </Box>
                                            <Box display="flex" alignItems="center" mt={1}>
                                              {[...Array(5)].map((_, i) => (
                                                <Star 
                                                  key={i} 
                                                  sx={{ 
                                                    color: i < competence.coefficient ? green[500] : 'action.disabled',
                                                    fontSize: '1rem'
                                                  }} 
                                                />
                                              ))}
                                              <Typography variant="caption" sx={{ ml: 1 }}>
                                                (Coefficient: {competence.coefficient})
                                              </Typography>
                                            </Box>
                                          </Paper>
                                        </Grid>
                                      ))}
                                    </Grid>
                                  )}
                                  
                                  <Box sx={{ mt: 2 }}>
                                    <Button
                                      variant="outlined"
                                      startIcon={<Add />}
                                      onClick={() => {
                                        setCurrentDomaine(domaine);
                                        setCurrentPoste(poste);
                                        setOpenDialog(true);
                                      }}
                                    >
                                      Ajouter une compétence
                                    </Button>
                                  </Box>
                                </Box>
                              </Collapse>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                      
                      <Box sx={{ mt: 2, ml: 6 }}>
                        <PrimaryButton startIcon={<Add />}>
                          Ajouter un poste
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </Collapse>
                </StyledPaper>
              </Slide>
            ))
          )}
        </Box>
      )}
      
      {/* Dialog pour ajouter une compétence */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Work sx={{ mr: 1, color: green[500] }} />
            <Typography variant="h6">
              Ajouter une compétence au poste: {currentPoste?.nom_poste}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              freeSolo
              options={competencesList}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.nom_competence}
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Compétence" 
                  variant="outlined" 
                  fullWidth 
                  helperText="Sélectionnez une compétence existante ou entrez une nouvelle"
                />
              )}
              value={newCompetence}
              onChange={(event, newValue) => {
                setNewCompetence(typeof newValue === 'string' ? newValue : newValue?.nom_competence || '');
              }}
              inputValue={newCompetence}
              onInputChange={(event, newInputValue) => {
                setNewCompetence(newInputValue);
              }}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Coefficient d'importance</Typography>
            <Box display="flex" alignItems="center">
              {[1, 2, 3, 4, 5].map((value) => (
                <IconButton
                  key={value}
                  onClick={() => setCoefficient(value)}
                  sx={{ color: coefficient >= value ? green[500] : 'action.disabled' }}
                >
                  {coefficient >= value ? <Star /> : <StarBorder />}
                </IconButton>
              ))}
              <Typography variant="body2" sx={{ ml: 2 }}>
                {coefficient} {coefficient > 1 ? 'étoiles' : 'étoile'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <PrimaryButton 
            onClick={handleAddCompetence} 
            disabled={!newCompetence.trim()}
            startIcon={<Check />}
          >
            Confirmer
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}