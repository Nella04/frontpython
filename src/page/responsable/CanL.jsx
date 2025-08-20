import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Chip, IconButton, Tooltip, CircularProgress, Fade, Zoom, Divider, Avatar,
  Accordion, AccordionSummary, AccordionDetails, InputAdornment, Badge
} from '@mui/material';
import {
  Search, ExpandMore, Person, Work, Category, Star, FilterAlt, Refresh,
  ArrowBack, ArrowForward, CheckCircle, Pending,Close
} from '@mui/icons-material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import axios from 'axios';
import CandidatActionButton from '../../components/CandidatActionButton';

// Configuration du thème
const theme = createTheme({
  palette: {
    primary: { main: '#007bff' },    // bleu
    secondary: { main: '#20c997' },  // vert menthe
    background: { default: '#F5F5F5' } // off-white
  },
});

// Composants stylisés
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:before': { display: 'none' }
}));

const CandidateCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '10px',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
  }
}));

const CanL = () => {
  const [domaines, setDomaines] = useState([]);
  const [candidats, setCandidats] = useState([]);
  const [candidatPostes, setCandidatPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [selectedCompetence, setSelectedCompetence] = useState(null);
  const [expandedDomaine, setExpandedDomaine] = useState(null);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [domainesRes, candidatsRes, candidatPostesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`)
        ]);
        
        setDomaines(domainesRes.data);
        setCandidats(candidatsRes.data);
        setCandidatPostes(candidatPostesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur de chargement', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrage des candidats
  const filteredCandidats = candidats.filter(candidat => {
    const matchesSearch = `${candidat.prenom} ${candidat.nom} ${candidat.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par domaine
    const matchesDomaine = !selectedDomaine || 
      candidatPostes.some(cp => 
        cp.candidat_id == candidat.id && 
        domaines.some(d => 
          d.id == selectedDomaine && 
          d.postes.some(p => p.id == cp.poste_id)
        )
      );
    
    // Filtre par poste
    const matchesPoste = !selectedPoste || 
      candidatPostes.some(cp => 
        cp.candidat_id == candidat.id && 
        cp.poste_id == selectedPoste
      );
    
    // Filtre par compétence (implémentation simplifiée)
    const matchesCompetence = !selectedCompetence || true; // À compléter selon votre modèle
    
    return matchesSearch && matchesDomaine && matchesPoste && matchesCompetence;
  });

  // Gestion des accordéons
  const handleDomaineClick = (domaineId) => {
    setExpandedDomaine(expandedDomaine === domaineId ? null : domaineId);
    setSelectedDomaine(domaineId === selectedDomaine ? null : domaineId);
    setSelectedPoste(null);
    setSelectedCompetence(null);
  };

  const handlePosteClick = (posteId, domaineId) => {
    setSelectedDomaine(domaineId);
    setSelectedPoste(posteId === selectedPoste ? null : posteId);
    setSelectedCompetence(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedDomaine(null);
    setSelectedPoste(null);
    setSelectedCompetence(null);
    setSearchTerm('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        backgroundColor: 'background.default', 
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, md: 4 }
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          {/* En-tête */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              Gestion des Candidats
            </Typography>
            
            <TextField
              size="small"
              placeholder="Rechercher candidat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: 250,
                backgroundColor: 'white',
                borderRadius: '8px'
              }}
            />
          </Box>

          {/* Filtres actifs */}
          {(selectedDomaine || selectedPoste || selectedCompetence) && (
            <Fade in={true}>
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {selectedDomaine && (
                  <Chip
                    label={`Domaine: ${domaines.find(d => d.id === selectedDomaine)?.nom_domaine}`}
                    onDelete={() => setSelectedDomaine(null)}
                    color="primary"
                    variant="outlined"
                    deleteIcon={<Close />}
                  />
                )}
                {selectedPoste && (
                  <Chip
                    label={`Poste: ${domaines.flatMap(d => d.postes).find(p => p.id === selectedPoste)?.nom_poste}`}
                    onDelete={() => setSelectedPoste(null)}
                    color="secondary"
                    variant="outlined"
                    deleteIcon={<Close />}
                  />
                )}
                {selectedCompetence && (
                  <Chip
                    label={`Compétence: ${selectedCompetence}`}
                    onDelete={() => setSelectedCompetence(null)}
                    color="info"
                    variant="outlined"
                    deleteIcon={<Close />}
                  />
                )}
                <Button 
                  size="small" 
                  onClick={resetFilters}
                  startIcon={<FilterAlt />}
                  sx={{ ml: 1 }}
                >
                  Réinitialiser
                </Button>
              </Box>
            </Fade>
          )}

          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Panneau latéral - Filtres */}
            <Paper sx={{ 
              p: 3, 
              borderRadius: '12px', 
              flex: { xs: 1, lg: 0.3 },
              minWidth: 300,
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category color="primary" /> Domaines
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                domaines.map((domaine) => (
                  <StyledAccordion 
                    key={domaine.id}
                    expanded={expandedDomaine === domaine.id}
                    onChange={() => handleDomaineClick(domaine.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge 
                          badgeContent={domaine.postes.length} 
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <Work color="action" />
                        </Badge>
                        <Typography>{domaine.nom_domaine}</Typography>
                      </Box>
                    </AccordionSummary>
                    
                    <AccordionDetails sx={{ pt: 0, pl: 4 }}>
                      {domaine.postes.map((poste) => (
                        <Box key={poste.id} sx={{ mb: 2 }}>
                          <Button
                            fullWidth
                            startIcon={<Work />}
                            endIcon={
                              <Badge 
                                badgeContent={
                                  candidatPostes.filter(cp => cp.poste_id == poste.id).length
                                } 
                                color="secondary"
                              />
                            }
                            sx={{
                              justifyContent: 'space-between',
                              textTransform: 'none',
                              backgroundColor: selectedPoste === poste.id ? 'rgba(32, 201, 151, 0.1)' : 'transparent'
                            }}
                            onClick={() => handlePosteClick(poste.id, domaine.id)}
                          >
                            {poste.nom_poste}
                          </Button>
                          
                          {/* Compétences du poste */}
                          {poste.competences.length > 0 && (
                            <Box sx={{ ml: 2, mt: 1 }}>
                              {poste.competences.map((comp) => (
                                <Chip
                                  key={comp.id}
                                  label={`${comp.competence_nom} (${comp.coefficient})`}
                                  size="small"
                                  sx={{ mr: 1, mb: 1 }}
                                  onClick={() => setSelectedCompetence(comp.competence_nom)}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </StyledAccordion>
                ))
              )}
            </Paper>

            {/* Contenu principal - Liste des candidats */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 3, borderRadius: '12px', minHeight: '70vh' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3 
                }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" /> 
                    {selectedDomaine || selectedPoste || selectedCompetence 
                      ? 'Candidats filtrés' 
                      : 'Tous les candidats'}
                    <Chip 
                      label={`${filteredCandidats.length} trouvés`} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  </Typography>
                  
                  <Button 
                    startIcon={<Refresh />} 
                    onClick={resetFilters}
                    size="small"
                  >
                    Actualiser
                  </Button>
                </Box>

                {loading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={40} />
                  </Box>
                ) : filteredCandidats.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography color="textSecondary">
                      Aucun candidat trouvé avec ces critères
                    </Typography>
                    <Button 
                      onClick={resetFilters}
                      sx={{ mt: 2 }}
                      variant="outlined"
                    >
                      Voir tous les candidats
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredCandidats.map((candidat) => {
                      const postesCandidat = candidatPostes.filter(cp => cp.candidat_id == candidat.id);
                      
                      return (
                        <Zoom in={true} key={candidat.id}>
                          <CandidateCard elevation={2}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 3,
                              flexWrap: 'wrap'
                            }}>
                                {/* ty atokana */}
                              <Avatar sx={{ 
                                bgcolor: candidat.teste ? 'secondary.main' : 'primary.main',
                                width: 56, 
                                height: 56 
                              }}>
                                {candidat.prenom.charAt(0)}{candidat.nom.charAt(0)}
                              </Avatar>
                              
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6">
                                  {candidat.prenom} {candidat.nom}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {candidat.email}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1
                              }}>
                                {candidat.teste ? (
                                  <Chip 
                                    icon={<CheckCircle fontSize="small" />} 
                                    label="Testé" 
                                    color="success" 
                                    size="small" 
                                  />
                                ) : (
                                  <Chip 
                                    icon={<Pending fontSize="small" />} 
                                    label="Non testé" 
                                    color="warning" 
                                    size="small" 
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            {postesCandidat.length > 0 && (
                              <>
                                <Divider sx={{ my: 2 }} />
                                  <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mb: 1
                                    }}>
                                        <Typography variant="subtitle2">
                                        Postes associés:
                                        </Typography>
                                        
                                        {/* Bouton déplacé ici */}
                                        <CandidatActionButton candidatId={candidat.id} />
                                    </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {postesCandidat.map((cp) => {
                                    const domaine = domaines.find(d => 
                                      d.postes.some(p => p.id == cp.poste_id)
                                    );
                                    
                                    return (
                                      <Tooltip 
                                        key={cp.id} 
                                        title={`Domaine: ${domaine?.nom_domaine || 'Inconnu'}`}
                                      >
                                        <Chip
                                          label={cp.poste_nom}
                                          color="primary"
                                          variant="outlined"
                                          size="small"
                                        />
                                      </Tooltip>
                                    );
                                  })}
                                </Box>
                              </>
                            )}
                              {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <CandidatActionButton candidatId={candidat.id} />
                            </Box> */}
                          </CandidateCard>
                        </Zoom>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CanL;