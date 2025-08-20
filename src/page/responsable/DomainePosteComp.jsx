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
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  CircularProgress,
  Slide,
  Fade,
  Zoom,
  Collapse,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  ExpandMore,
  ExpandLess,
  Work,
  Code,
  School,
  Construction,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { green, amber, deepPurple } from '@mui/material/colors';

// Styles personnalisés
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  }
}));

const DomainCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#F5F5F5',
  borderRadius: '10px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#e8f5e9'
  }
}));

const CompetenceChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: green[100],
  color: green[800],
  fontWeight: 'bold'
}));

const CoefficientBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -10,
    top: 13,
    backgroundColor: green[500],
    color: 'white',
    fontWeight: 'bold'
  }
}));

const DomainesManager = () => {
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDomaine, setExpandedDomaine] = useState(null);
  const [expandedPoste, setExpandedPoste] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [currentDomaine, setCurrentDomaine] = useState(null);
  const [currentPoste, setCurrentPoste] = useState(null);
  const [currentCompetence, setCurrentCompetence] = useState(null);
  const [newDomaineName, setNewDomaineName] = useState('');
  const [newPosteName, setNewPosteName] = useState('');
  const [newCompetenceName, setNewCompetenceName] = useState('');
  const [newCoefficient, setNewCoefficient] = useState(1);
  const [availableCompetences, setAvailableCompetences] = useState([]);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        const data = await response.json();
        console.log('Données reçues:', data); 
        setDomaines(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Charger les compétences disponibles
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`);
        const data = await response.json();
        setAvailableCompetences(data);
      } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error);
      }
    };

    fetchCompetences();
  }, []);

  // Gérer l'expansion des domaines
  const handleDomaineExpand = (domaineId) => {
    if (expandedDomaine === domaineId) {
      setExpandedDomaine(null);
      setExpandedPoste(null);
    } else {
      setExpandedDomaine(domaineId);
      setExpandedPoste(null);
    }
  };

  // Gérer l'expansion des postes
  const handlePosteExpand = (posteId) => {
    setExpandedPoste(expandedPoste === posteId ? null : posteId);
  };

  // Ouvrir le dialogue pour les actions
  const handleOpenDialog = (action, domaine = null, poste = null, competence = null) => {
    setCurrentAction(action);
    setCurrentDomaine(domaine);
    setCurrentPoste(poste);
    setCurrentCompetence(competence);
    
    if (action === 'edit-domaine' && domaine) {
      setNewDomaineName(domaine.nom_domaine);
    }
    
    if (action === 'edit-poste' && poste) {
      setNewPosteName(poste.nom_poste);
    }
    
    if (action === 'edit-competence' && competence) {
      setNewCompetenceName(competence.competence.nom_competence);
      setNewCoefficient(competence.coefficient);
    }
    
    setOpenDialog(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewDomaineName('');
    setNewPosteName('');
    setNewCompetenceName('');
    setNewCoefficient(1);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    try {
      let response;
      
      if (currentAction === 'add-domaine') {
        response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nom_domaine: newDomaineName })
        });
      } else if (currentAction === 'edit-domaine') {
        response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines/${currentDomaine.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nom_domaine: newDomaineName })
        });
      } else if (currentAction === 'add-poste') {
        response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/postes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            nom_poste: newPosteName,
            domaine: currentDomaine.id
          })
        });
      } else if (currentAction === 'edit-poste') {
        response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/postes/${currentPoste.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            nom_poste: newPosteName,
            domaine: currentDomaine.id
          })
        });
      } else if 


      (currentAction === 'add-competence') {
      // Vérifier si la compétence existe déjà
      const existingCompetence = availableCompetences.find(
        comp => comp.competence_nom.toLowerCase() === newCompetenceName.toLowerCase()
      );

      let competenceId;
      
      if (existingCompetence) {
        // Utiliser l'ID de la compétence existante
        competenceId = existingCompetence.id;
      } else {
        // Créer une nouvelle compétence
        const competenceResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ competence_nom: newCompetenceName })
        });
        
        if (!competenceResponse.ok) throw new Error('Erreur création compétence');
        
        const newCompetence = await competenceResponse.json();
        competenceId = newCompetence.id;
        
        // Mettre à jour la liste des compétences disponibles
        setAvailableCompetences([...availableCompetences, newCompetence]);
      }
      
      // Créer l'association avec le poste
      response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id_poste: currentPoste.id,
          id_competence: competenceId,
          coefficient: newCoefficient
        })
      });
    

      
    //   (currentAction === 'add-competence') {
    //     response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenance-competence-poste/`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ 
    //         id_poste: currentPoste.id,
    //         id_competence: currentCompetence.id,
    //         coefficient: newCoefficient
    //       })
    //     });


      } else if (currentAction === 'edit-competence') {
        response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenance-competence-poste/${currentCompetence.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            coefficient: newCoefficient
          })
        });
      }
      
      if (response && response.ok) {
        // Recharger les données
        const updatedResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        const updatedData = await updatedResponse.json();
        setDomaines(updatedData);
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
    }
  };

  // Supprimer un élément
  const handleDelete = async (type, id) => {
    try {
      let endpoint = '';
      
      if (type === 'domaine') {
        endpoint = `${process.env.REACT_APP_BACK_URL}/api/domaines/${id}/`;
      } else if (type === 'poste') {
        endpoint = `${process.env.REACT_APP_BACK_URL}/api/postes/${id}/`;
      } else if (type === 'competence') {
        endpoint = `${process.env.REACT_APP_BACK_URL}/api/appartenance-competence-poste/${id}/`;
      }
      
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Recharger les données
        const updatedResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        const updatedData = await updatedResponse.json();
        setDomaines(updatedData);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Filtrer les domaines en fonction du terme de recherche
  const filteredDomaines = domaines.filter(domaine =>
    domaine.nom_domaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domaine.postes.some(poste =>
      poste.nom_poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poste.competences.some(comp =>
        comp.competence.competence_nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  // Obtenir l'icône appropriée pour le domaine
  const getDomaineIcon = (domaineName) => {
    switch (domaineName.toLowerCase()) {
      case 'informatique':
        return <Code color="primary" fontSize="large" />;
      case 'batiment':
        return <Construction color="primary" fontSize="large" />;
      case 'education':
        return <School color="primary" fontSize="large" />;
      default:
        return <Work color="primary" fontSize="large" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} style={{ color: green[500] }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: green[800],
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            Gestion des Domaines, Postes et Compétences
          </Typography>
          
          {/* Barre de recherche et bouton d'ajout */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <TextField
              variant="outlined"
              placeholder="Rechercher un domaine, poste ou compétence..."
              fullWidth
              sx={{ maxWidth: '600px', mr: 2 }}
              InputProps={{
                startAdornment: <Search color="primary" sx={{ mr: 1 }} />
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleOpenDialog('add-domaine')}
              sx={{ 
                borderRadius: '8px',
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              Ajouter Domaine
            </Button>
          </Box>
          
          {/* Liste des domaines */}
          <StyledPaper elevation={3}>
            {filteredDomaines.length === 0 ? (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                Aucun domaine trouvé. Essayez de modifier votre recherche ou ajoutez un nouveau domaine.
              </Typography>
            ) : (
              <List>
                {filteredDomaines.map((domaine) => (
                  <Zoom in={true} key={domaine.id}>
                    <DomainCard elevation={0}>
                      <ListItem 
                        button 
                        onClick={() => handleDomaineExpand(domaine.id)}
                        sx={{ px: 0 }}
                      >
                        <Avatar sx={{ 
                          bgcolor: green[100], 
                          color: green[800],
                          mr: 2,
                          width: 56,
                          height: 56
                        }}>
                          {getDomaineIcon(domaine.nom_domaine)}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {domaine.nom_domaine}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              {domaine.postes.length} poste(s) associé(s)
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Modifier">
                              <IconButton 
                                edge="end" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog('edit-domaine', domaine);
                                }}
                              >
                                <Edit color="primary" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                edge="end" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete('domaine', domaine.id);
                                }}
                              >
                                <Delete color="error" />
                              </IconButton>
                            </Tooltip>
                            <IconButton edge="end">
                              {expandedDomaine === domaine.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <Collapse in={expandedDomaine === domaine.id} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 8, pr: 2, pt: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2
                          }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Postes associés
                            </Typography>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => handleOpenDialog('add-poste', domaine)}
                              sx={{ borderRadius: '20px' }}
                            >
                              Ajouter Poste
                            </Button>
                          </Box>
                          
                          {domaine.postes.length === 0 ? (
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              Aucun poste associé à ce domaine.
                            </Typography>
                          ) : (
                            <List sx={{ py: 0 }}>
                              {domaine.postes.map((poste) => (
                                <Slide direction="up" in={true} key={poste.id}>
                                  <Paper elevation={2} sx={{ mb: 2, borderRadius: '8px' }}>
                                    <ListItem 
                                      button 
                                      onClick={() => handlePosteExpand(poste.id)}
                                      sx={{ borderRadius: '8px' }}
                                    >
                                      <ListItemText
                                        primary={
                                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            {poste.nom_poste}
                                          </Typography>
                                        }
                                        secondary={
                                          <Typography variant="body2" color="textSecondary">
                                            {poste.competences.length} compétence(s) requise(s)
                                          </Typography>
                                        }
                                      />
                                      <ListItemSecondaryAction>
                                        <Box display="flex" gap={1}>
                                          <Tooltip title="Modifier">
                                            <IconButton 
                                              edge="end" 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDialog('edit-poste', domaine, poste);
                                              }}
                                            >
                                              <Edit color="primary" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Supprimer">
                                            <IconButton 
                                              edge="end" 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete('poste', poste.id);
                                              }}
                                            >
                                              <Delete color="error" />
                                            </IconButton>
                                          </Tooltip>
                                          <IconButton edge="end">
                                            {expandedPoste === poste.id ? <ExpandLess /> : <ExpandMore />}
                                          </IconButton>
                                        </Box>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                                    
                                    <Collapse in={expandedPoste === poste.id} timeout="auto" unmountOnExit>
                                      <Box sx={{ pl: 4, pr: 2, py: 2 }}>
                                        <Box sx={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center',
                                          mb: 2
                                        }}>
                                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            Compétences requises
                                          </Typography>
                                          <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<Add />}
                                            onClick={() => handleOpenDialog('add-competence', domaine, poste)}
                                            sx={{ borderRadius: '20px' }}
                                          >
                                            Ajouter Compétence
                                          </Button>
                                        </Box>
                                        
                                        {poste.competences.length === 0 ? (
                                          <Typography variant="body2" color="textSecondary">
                                            Aucune compétence requise pour ce poste.
                                          </Typography>
                                        ) : (
                                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {poste.competences.map((comp, index) => (
                                              <CoefficientBadge 
                                                key={index} 
                                                badgeContent={comp.coefficient} 
                                                anchorOrigin={{
                                                  vertical: 'top',
                                                  horizontal: 'right'
                                                }}
                                              >
                                                <CompetenceChip
                                                  label={comp.competence_nom}
                                                  onDelete={() => handleDelete('competence', comp.id)}
                                                  onClick={() => handleOpenDialog('edit-competence', domaine, poste, comp)}
                                                  deleteIcon={<Edit fontSize="small" />}
                                                  variant="outlined"
                                                />
                                              </CoefficientBadge>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>
                                    </Collapse>
                                  </Paper>
                                </Slide>
                              ))}
                            </List>
                          )}
                        </Box>
                      </Collapse>
                    </DomainCard>
                  </Zoom>
                ))}
              </List>
            )}
          </StyledPaper>
        </Box>
      </Fade>
      
      {/* Dialogue pour les actions */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Slide}
      >
        <DialogTitle sx={{ 
          backgroundColor: green[50],
          color: green[800],
          fontWeight: 'bold',
          borderBottom: `1px solid ${green[100]}`
        }}>
          {currentAction === 'add-domaine' && 'Ajouter un nouveau domaine'}
          {currentAction === 'edit-domaine' && 'Modifier le domaine'}
          {currentAction === 'add-poste' && 'Ajouter un nouveau poste'}
          {currentAction === 'edit-poste' && 'Modifier le poste'}
          {currentAction === 'add-competence' && 'Ajouter une compétence au poste'}
          {currentAction === 'edit-competence' && 'Modifier la compétence'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {(currentAction === 'add-domaine' || currentAction === 'edit-domaine') && (
            <TextField
              autoFocus
              margin="dense"
              label="Nom du domaine"
              type="text"
              fullWidth
              variant="outlined"
              value={newDomaineName}
              onChange={(e) => setNewDomaineName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          
          {(currentAction === 'add-poste' || currentAction === 'edit-poste') && (
            <TextField
              autoFocus
              margin="dense"
              label="Nom du poste"
              type="text"
              fullWidth
              variant="outlined"
              value={newPosteName}
              onChange={(e) => setNewPosteName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          
          {/* {(currentAction === 'add-competence') && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Compétence</InputLabel>
              <Select
                value={newCompetenceName}
                onChange={(e) => setNewCompetenceName(e.target.value)}
                label="Compétence"
              >
                {availableCompetences.map((comp) => (
                  <MenuItem key={comp.id} value={comp.id}>
                    {comp.nom_competence}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )} */}
             {(currentAction === 'add-competence') && (
                <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="competence-input">Compétence</InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                        id="competence-input"
                        label="Compétence"
                        fullWidth
                        variant="outlined"
                        value={newCompetenceName}
                        onChange={(e) => setNewCompetenceName(e.target.value)}
                        inputProps={{
                            list: "competences-list",
                            autoComplete: "off"
                        }}
                        />
                        <datalist id="competences-list">
                        {availableCompetences.map((comp) => (
                            <option key={comp.id} value={comp.nom_competence} />
                        ))}
                        </datalist>
                    </Box>
                    </FormControl>
                    
                    <TextField
                    margin="dense"
                    label="Coefficient d'importance"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={newCoefficient}
                    onChange={(e) => setNewCoefficient(parseFloat(e.target.value))}
                    inputProps={{ min: 0.1, max: 5, step: 0.1 }}
                    sx={{ mb: 2 }}
                    />
                </>
                )}
          
          {(currentAction === 'add-competence' || currentAction === 'edit-competence') && (
            <TextField
              margin="dense"
              label="Coefficient d'importance"
              type="number"
              fullWidth
              variant="outlined"
              value={newCoefficient}
              onChange={(e) => setNewCoefficient(parseFloat(e.target.value))}
              inputProps={{ min: 0.1, max: 5, step: 0.1 }}
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${green[100]}` }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            variant="contained"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DomainesManager;