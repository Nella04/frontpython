import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Fade,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  Work as WorkIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterAlt as FilterAltIcon,
  FilterAltOff as FilterAltOffIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedCard = styled(Card)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-out`,
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8]
  }
}));

const TestsHistory = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    poste: '',
    competence: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTest, setExpandedTest] = useState(null);

  // Récupérer l'ID du candidat depuis localStorage
  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const idcanlocal = userLocalapi?.idpersonnelocal;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Récupérer les tests du candidat (les plus récents d'abord)
        const testsResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/tests/?id_candidat=${idcanlocal}`);
        let testsData = testsResponse.data;
        
        // Trier par date décroissante (si le backend ne le fait pas)
        testsData.sort((a, b) => new Date(b.date_test) - new Date(a.date_test));
        
        // 2. Récupérer tous les données nécessaires
        const [resultatsResponse, responsablesResponse, competencesResponse, postesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/resultats/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/responsables/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/postes/`)
        ]);
        
        const resultats = resultatsResponse.data;
        const responsables = responsablesResponse.data;
        const competences = competencesResponse.data;
        const postes = postesResponse.data;
        
        // Créer des maps pour accès rapide
        const responsablesMap = responsables.reduce((acc, resp) => {
          acc[resp.id_responsable] = resp;
          return acc;
        }, {});
        
        const competencesMap = competences.reduce((acc, comp) => {
          acc[comp.id_competence] = comp;
          return acc;
        }, {});
        
        const postesMap = postes.reduce((acc, poste) => {
          acc[poste.id_poste] = poste;
          return acc;
        }, {});
        
        // 3. Enrichir les données des tests
        const enrichedTests = testsData.map(test => {
          // Trouver le responsable
          const responsable = responsablesMap[test.id_responsable] || {};
          
          // Trouver les résultats du test
          const resultatsTest = resultats
            .filter(res => res.id_test === test.id_test)
            .map(res => ({
              ...res,
              ...competencesMap[res.id_competence]
            }));
          
          // Trouver les postes concernés (via les compétences évaluées)
          const postesConcernes = [...new Set(
            resultatsTest
              .map(res => {
                const appartenance = postes.find(p => 
                  p.id_poste === res.id_poste
                );
                return appartenance ? appartenance.id_poste : null;
              })
              .filter(Boolean)
          )].map(id => postesMap[id]);
          
          return {
            ...test,
            responsable_nom: `${responsable.prenom} ${responsable.nom}`,
            resultats: resultatsTest,
            postes: postesConcernes
          };
        });
        
        setTests(enrichedTests);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idcanlocal) {
      fetchData();
    }
  }, [idcanlocal]);

  const handleExpandTest = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      date: '',
      poste: '',
      competence: ''
    });
    setSearchTerm('');
  };

  const filteredTests = tests.filter(test => {
    // Filtre par recherche globale
    const matchesSearch = 
      searchTerm === '' ||
      test.responsable_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.postes.some(poste => 
        poste.nom_poste.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      test.resultats.some(res => 
        res.nom_competence.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Filtres avancés
    const matchesDate = 
      filters.date === '' || 
      format(new Date(test.date_test), 'yyyy-MM-dd') === filters.date;
    
    const matchesPoste = 
      filters.poste === '' ||
      test.postes.some(poste => 
        poste.nom_poste.toLowerCase().includes(filters.poste.toLowerCase())
      );
    
    const matchesCompetence = 
      filters.competence === '' ||
      test.resultats.some(res => 
        res.nom_competence.toLowerCase().includes(filters.competence.toLowerCase())
      );
    
    return matchesSearch && matchesDate && matchesPoste && matchesCompetence;
  });

  const renderStars = (niveau) => {
    const stars = [];
    const filledStars = Math.floor(niveau / 2);
    const hasHalfStar = niveau % 2 >= 1;
    
    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(<StarIcon key={i} color="primary" />);
      } else if (i === filledStars && hasHalfStar) {
        stars.push(<StarIcon key={i} color="primary" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<StarBorderIcon key={i} color="primary" />);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={500}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Historique des Tests
            </Typography>
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              color="primary"
              sx={{ ml: 2 }}
            >
              {showFilters ? <FilterAltOffIcon /> : <FilterAltIcon />}
            </IconButton>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher par responsable, poste ou compétence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Collapse in={showFilters}>
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Filtrer par date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Filtrer par poste"
                    value={filters.poste}
                    onChange={(e) => handleFilterChange('poste', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Filtrer par compétence"
                    value={filters.competence}
                    onChange={(e) => handleFilterChange('competence', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StarIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box textAlign="right" mt={2}>
                <Chip
                  label="Réinitialiser les filtres"
                  onClick={resetFilters}
                  color="secondary"
                  variant="outlined"
                  clickable
                />
              </Box>
            </Paper>
          </Collapse>

          {filteredTests.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              {tests.length === 0 
                ? "Aucun test trouvé dans votre historique." 
                : "Aucun test ne correspond à vos critères de recherche."}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredTests.map((test) => (
                <Grid item xs={12} key={test.id_test}>
                  <AnimatedCard>
                    <CardContent>
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleExpandTest(test.id_test)}
                      >
                        <Box>
                          <Typography variant="h6" component="h2">
                            Test #{test.id_test}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(test.date_test), 'PPPP', { locale: fr })}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              Évalué par: {test.responsable_nom}
                            </Typography>
                            <Typography variant="body2">
                              {test.postes.length} poste(s) concerné(s)
                            </Typography>
                          </Box>
                          <ExpandMoreIcon 
                            sx={{ 
                              transform: expandedTest === test.id_test ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                              ml: 2
                            }} 
                          />
                        </Box>
                      </Box>

                      <Collapse in={expandedTest === test.id_test}>
                        <Box mt={3}>
                          <Divider sx={{ mb: 3 }} />
                          
                          <Typography variant="subtitle1" gutterBottom>
                            Postes concernés:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                            {test.postes.map(poste => (
                              <Chip 
                                key={poste.id_poste}
                                label={poste.nom_poste}
                                color="secondary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                          
                          <Typography variant="subtitle1" gutterBottom>
                            Résultats par compétence:
                          </Typography>
                          <Grid container spacing={2}>
                            {test.resultats.map(resultat => (
                              <Grid item xs={12} sm={6} md={4} key={`${test.id_test}-${resultat.id_competence}`}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                  <Typography variant="subtitle2">
                                    {resultat.nom_competence}
                                  </Typography>
                                  <Box display="flex" alignItems="center" mt={1} mb={1}>
                                    <Typography variant="body2" sx={{ mr: 2 }}>
                                      Niveau: {resultat.niveau_evalue}/10
                                    </Typography>
                                    <Box>
                                      {renderStars(resultat.niveau_evalue)}
                                    </Box>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={resultat.niveau_evalue * 10}
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: 
                                          resultat.niveau_evalue >= 8 ? '#20c997' : 
                                          resultat.niveau_evalue >= 5 ? '#007bff' : '#f44336'
                                      }
                                    }}
                                  />
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default TestsHistory;