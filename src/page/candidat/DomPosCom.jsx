import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Checkbox,
  Slider,
  Chip,
  Avatar,
  Collapse,
  Fade,
  Slide,
  Zoom,
  Tooltip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Search,
  ExpandMore,
  ExpandLess,
  Work,
  Category,
  Star,
  StarBorder,
  FilterList,
  CheckCircle,
  CheckCircleOutline
} from '@mui/icons-material';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Close from '@mui/icons-material/Close'; 

import creercanpos from './canpost/Creat';
import supprimercanpos from './canpost/Delete';
import CheckCan from '../../components/session/Checkcan';

// Couleurs personnalisées
const colors = {
  primary: '#007bff',
  secondary: '#F5F5DC',
  background: '#F5F5F5'
};

// Styles personnalisés
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: colors.background,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)'
  },
}));

const DomainHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: colors.primary,
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s',
  '&:hover': {
    // backgroundColor: '#2d2c73'
    backgroundColor: '#20c997'
  }
}));

const PosteHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  backgroundColor: colors.secondary,
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: '#e0e0c2'
  }
}));

const CompetenceItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: 'white',
  borderRadius: '6px',
  borderLeft: `4px solid ${colors.primary}`
}));

const ImportanceSlider = styled(Slider)(({ theme }) => ({
  color: colors.primary,
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${colors.primary}20`
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px ${colors.primary}20`
    }
  }
}));



export default function DomainesPostesCompetences() {
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDomaines, setExpandedDomaines] = useState([]);
  const [expandedPostes, setExpandedPostes] = useState([]);
  const [selectedPostes, setSelectedPostes] = useState([]);
  const [searchDomaine, setSearchDomaine] = useState('');
  const [searchPoste, setSearchPoste] = useState('');
  const [searchCompetence, setSearchCompetence] = useState('');

  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const idcanlocal = userLocalapi?.id;

  const navigate = useNavigate(); 

  // //const [selectedPostes, setSelectedPostes] = useState([]);
  const [candidatId, setCandidatId] = useState(); // À récupérer depuis votre contexte/auth
  // setCandidatId(idcanlocal);
  useEffect(() => {
  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const idcanlocal = userLocalapi?.idpersonnelocal;
  setCandidatId(idcanlocal);
  }, []);





  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        const data = await response.json();
        setDomaines(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur de chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion de l'expansion des domaines
  const toggleDomaine = (domaineId) => {
    setExpandedDomaines(prev =>
      prev.includes(domaineId)
        ? prev.filter(id => id !== domaineId)
        : [...prev, domaineId]
    );
  };

  // Gestion de l'expansion des postes
  const togglePoste = (posteId) => {
    setExpandedPostes(prev =>
      prev.includes(posteId)
        ? prev.filter(id => id !== posteId)
        : [...prev, posteId]
    );
  };

  // Gestion de la sélection des postes
  const togglePosteSelection = (posteId) => {
    setSelectedPostes(prev =>
      prev.includes(posteId)
        ? prev.filter(id => id !== posteId)
        : [...prev, posteId]
    );
  };

  // Filtrer les domaines
  const filteredDomaines = domaines.filter(domaine => {
    const matchesDomaine = domaine.nom_domaine.toLowerCase().includes(searchDomaine.toLowerCase());
    const matchesPoste = domaine.postes.some(poste => 
      poste.nom_poste.toLowerCase().includes(searchPoste.toLowerCase())
    );
    const matchesCompetence = domaine.postes.some(poste => 
      poste.competences.some(comp => 
        comp.competence_nom.toLowerCase().includes(searchCompetence.toLowerCase())
      )
    );

    if (searchDomaine && searchPoste && searchCompetence) {
      return matchesDomaine && matchesPoste && matchesCompetence;
    } else if (searchDomaine && searchPoste) {
      return matchesDomaine && matchesPoste;
    } else if (searchDomaine && searchCompetence) {
      return matchesDomaine && matchesCompetence;
    } else if (searchPoste && searchCompetence) {
      return matchesPoste && matchesCompetence;
    } else if (searchDomaine) {
      return matchesDomaine;
    } else if (searchPoste) {
      return matchesPoste;
    } else if (searchCompetence) {
      return matchesCompetence;
    }
    return true;
  });

  // Trier les compétences par coefficient (décroissant)
  const sortCompetences = (competences) => {
    return [...competences].sort((a, b) => b.coefficient - a.coefficient);
  };

  // Afficher les postes sélectionnés dans la console
  useEffect(() => {
    console.log('Postes sélectionnés:', selectedPostes);
  }, [selectedPostes]);

  

//////////////////////////////////////////////////////////////////////////
const handleCheckboxChange = async (posteId) => {
    // Vérification de la session 
  const userLocal = JSON.parse(localStorage.getItem("userlocal"));
  

  if (!userLocal || userLocal.rolelocal !== "candidat") {
    // Création d'une notification stylée au lieu de alert()
    const shouldRedirect = window.confirm(
      'Vous devez être connecté en tant que candidat pour cette action.\n\n' +
      'Souhaitez-vous être redirigé vers la page de connexion?'
    );
    
    if (shouldRedirect) {
      navigate('/candidat/connexion', {
        state: { 
          from: window.location.pathname,
          message: 'Veuillez vous connecter pour sélectionner des postes'
        }
      });
    }
    return;
  }
  if (!candidatId) {
    console.error('ID candidat non défini');
    return;
  }

  const isChecked = selectedPostes.includes(posteId);
  
  try {
    let success;
    if (isChecked) {
      //verifie si il y a candidat ou pas avec import de checkcan
      
      success = await supprimercanpos(candidatId, posteId);
    } else {
      success = await creercanpos(candidatId, posteId);
    }

    if (success) {
      setSelectedPostes(prev =>
        isChecked
          ? prev.filter(id => id !== posteId)
          : [...prev, posteId]
      );
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  }
};

////////////////////////////////////////////////////




  return (
    // <Container maxWidth="lg" sx={{ py: 4 , backgroundColor: colors.background, minHeight: '100vh' }}>
    <Box sx={{ 
  width: '94vw',
  minHeight: '100vh',
  backgroundColor: colors.background,
  py: 4,
  px: { xs: 2, sm: 3, md: 4 } // Padding responsive
}}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: colors.primary,
          textAlign: 'center',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
        }}>
          Catalogue des Compétences
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Explorez les domaines, postes et compétences disponibles puis selectionnez votre poste(s)
        </Typography>
      </Box>

<Paper sx={{ 
  p: 3, 
  mb: 4, 
  borderRadius: '12px', 
  backgroundColor: 'white',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
}}>
  <Grid container spacing={3} justifyContent="space-between">
    {/* Recherche Domaine - Aligné à gauche */}
    <Grid item xs={12} md={3.8} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <TextField
        fullWidth
        label="Rechercher un domaine"
        variant="outlined"
        value={searchDomaine}
        onChange={(e) => setSearchDomaine(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Category sx={{ color: colors.primary }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 400 }} // Limite la largeur maximale
      />
    </Grid>

    {/* Recherche Poste - Centré */}
    <Grid item xs={12} md={3.8} sx={{ display: 'flex', justifyContent: 'center' }}>
      <TextField
        fullWidth
        label="Rechercher un poste"
        variant="outlined"
        value={searchPoste}
        onChange={(e) => setSearchPoste(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Work sx={{ color: colors.primary }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 400 }} // Limite la largeur maximale
      />
    </Grid>

    {/* Recherche Compétence - Aligné à droite */}
    <Grid item xs={12} md={3.8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <TextField
        fullWidth
        label="Rechercher une compétence"
        variant="outlined"
        value={searchCompetence}
        onChange={(e) => setSearchCompetence(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Star sx={{ color: colors.primary }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 400 }} // Limite la largeur maximale
      />
    </Grid>
  </Grid>
</Paper>

{/* Indicateur de recherche amélioré */}
{(searchDomaine || searchPoste || searchCompetence) && (
  <Fade in={true}>
    <Box sx={{ 
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}>
      <Chip
        label={`${filteredDomaines.length} résultat(s) trouvé(s)`}
        color="primary"
        icon={<FilterList />}
        sx={{ 
          fontWeight: 'bold',
          fontSize: '0.875rem',
          height: '32px',
          '& .MuiChip-icon': {
            color: 'inherit'
          }
        }}
      />
      <Button 
        variant="text" 
        size="small"
        startIcon={<Close fontSize="small" />}
        onClick={() => {
          setSearchDomaine('');
          setSearchPoste('');
          setSearchCompetence('');
        }}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'transparent',
            color: colors.primary
          }
        }}
      >
        Réinitialiser
      </Button>
    </Box>
  </Fade>
)}





      {/* Contenu principal */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} sx={{ color: colors.primary }} />
        </Box>
      ) : filteredDomaines.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Aucun résultat trouvé</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Essayez de modifier vos critères de recherche
          </Typography>
        </Paper>
      ) : (
        <Box>
          {filteredDomaines.map((domaine) => (
            <Slide key={domaine.id} direction="up" in={true} mountOnEnter unmountOnExit>
              <StyledPaper elevation={3}>
                <DomainHeader onClick={() => toggleDomaine(domaine.id)}>
                  <Box display="flex" alignItems="center" flexGrow={1}>
                    {/* <Category sx={{ mr: 2, fontSize: '2rem' }} /> */}
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      {domaine.nom_domaine}
                    </Typography>
                  </Box>
                  <IconButton sx={{ color: 'white' }}>
                    {expandedDomaines.includes(domaine.id) ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </DomainHeader>

                <Collapse in={expandedDomaines.includes(domaine.id)}>
                  <Box sx={{ mt: 2 }}>
                    {domaine.postes.length === 0 ? (
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 2, ml: 4 }}>
                        Aucun poste défini pour ce domaine
                      </Typography>
                    ) : (
                      <List sx={{ width: '100%' }}>
                        {domaine.postes.map((poste) => (
                          <React.Fragment key={poste.id}>
                            <PosteHeader onClick={() => togglePoste(poste.id)}>
                              {/* <Checkbox
                                checked={selectedPostes.includes(poste.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  togglePosteSelection(poste.id);
                                }}
                                icon={<CheckCircleOutline />}
                                checkedIcon={<CheckCircle sx={{ color: colors.primary }} />}
                                sx={{ mr: 1 }}
                              /> */}
                              <Checkbox
                                checked={selectedPostes.includes(poste.id)}
                                onChange={() => handleCheckboxChange(poste.id)}
                                icon={<CheckCircleOutline />}
                                checkedIcon={<CheckCircle sx={{ color: colors.primary }} />}
                                sx={{ mr: 1 }}
                              />
                              <Box display="flex" alignItems="center" flexGrow={1}>
                                <Work sx={{ mr: 2, color: colors.primary }} />
                                <ListItemText 
                                  primary={poste.nom_poste} 
                                  primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
                                />
                                <Badge
                                  badgeContent={poste.competences.length}
                                  color="primary"
                                  sx={{ mr: 2 }}
                                />
                              </Box>
                              <IconButton>
                                {expandedPostes.includes(poste.id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </PosteHeader>

                            <Collapse in={expandedPostes.includes(poste.id)}>
                              <Box sx={{ pl: 6, pr: 2, pt: 1 }}>
                                {poste.competences.length === 0 ? (
                                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                    Aucune compétence définie pour ce poste
                                  </Typography>
                                ) : (
                                  <Grid container spacing={2}>
                                    {sortCompetences(poste.competences).map((competence) => (
                                      <Grid item xs={12} sm={6} key={competence.id}>
                                        <Zoom in={true}>
                                          <CompetenceItem elevation={0}>
                                            <Box display="flex" justifyContent="space-between">
                                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {competence.competence_nom}
                                              </Typography>
                                              <Chip 
                                                label={`Coeff: ${competence.coefficient}`}
                                                size="small"
                                                sx={{ backgroundColor: colors.primary, color: 'white' }}
                                              />
                                            </Box>
                                            <Box sx={{ mt: 2 }}>
                                              <Typography variant="caption" color="text.secondary">
                                                Niveau d'importance:
                                              </Typography>
                                              <ImportanceSlider
                                                value={competence.coefficient}
                                                min={0}
                                                max={10}
                                                step={0.5}
                                                marks
                                                valueLabelDisplay="auto"
                                                disabled
                                                sx={{ mt: 1 }}
                                              />
                                            </Box>
                                          </CompetenceItem>
                                        </Zoom>
                                      </Grid>
                                    ))}
                                  </Grid>
                                )}
                              </Box>
                            </Collapse>
                            <Divider sx={{ my: 1 }} />
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Box>
                </Collapse>
              </StyledPaper>
            </Slide>
          ))}
        </Box>
      )}

      {/* Badge pour les postes sélectionnés (flottant en bas à droite) */}
      {selectedPostes.length > 0 && (
        <Tooltip title={`${selectedPostes.length} poste(s) sélectionné(s)`} arrow>
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Zoom in={true}>
              <Avatar
                sx={{
                  bgcolor: colors.primary,
                  width: 56,
                  height: 56,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                <Badge
                  badgeContent={selectedPostes.length}
                  color="secondary"
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Work sx={{ fontSize: 28 }} />
                </Badge>
              </Avatar>
            </Zoom>
          </Box>
        </Tooltip>
      )}
    {/* </Container> */}
    </Box>
  );
}