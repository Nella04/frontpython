import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  Fade,
  Zoom,
  Slide,
  Chip,
  Avatar,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search, 
  DateRange, 
  Person, 
  Today, 
  ExpandMore, 
  ExpandLess,
  FilterList,
  Refresh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useCallback } from 'react';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px 0 rgba(0,0,0,0.15)'
  }
}));

const TestButton = styled(Button)(({ theme, selected }) => ({
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: 8,
  textTransform: 'none',
  backgroundColor: selected ? '#20c997' : '#F5F5F5',
  color: selected ? 'white' : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? '#1aa179' : '#e0e0e0'
  },
  transition: 'all 0.3s ease'
}));

const CompetenceChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: '#e3f2fd',
  color: '#007bff'
}));

const TestHistoryViewer = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [responsables, setResponsables] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [appartenances, setAppartenances] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: null, end: null });
  const [responsableFilter, setResponsableFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
const [postesForTest, setPostesForTest] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const id_candidat = userLocalapi?.idpersonnelocal;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all necessary data
        const [testsRes, responsablesRes, competencesRes, appartenancesRes, resultatsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACK_URL}/api/tests/`).then(res => res.json()),
          fetch(`${process.env.REACT_APP_BACK_URL}/api/responsables/`).then(res => res.json()),
          fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`).then(res => res.json()),
          fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`).then(res => res.json()),
          fetch(`${process.env.REACT_APP_BACK_URL}/api/resultats/`).then(res => res.json())
        ]);
        
        // Filter tests for the current candidate and sort by date (newest first)
        const candidateTests = testsRes
          .filter(test => test.candidat === parseInt(id_candidat))
          .sort((a, b) => new Date(b.date_test) - new Date(a.date_test));
        
        setTests(candidateTests);
        setFilteredTests(candidateTests);
        setResponsables(responsablesRes);
        setCompetences(competencesRes);
        setAppartenances(appartenancesRes);
        setResultats(resultatsRes);
        
        // Select the most recent test by default
        if (candidateTests.length > 0) {
          setSelectedTest(candidateTests[0].id);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id_candidat]);

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...tests];
    
    // Filter by search term (date or responsable name)
    if (searchTerm) {
      filtered = filtered.filter(test => {
        const responsable = responsables.find(r => r.id === test.responsable);
        const responsableName = responsable ? `${responsable.prenom} ${responsable.nom}`.toLowerCase() : '';
        const testDate = format(new Date(test.date_test), 'dd MMMM yyyy HH:mm', { locale: fr }).toLowerCase();
        
        return (
          responsableName.includes(searchTerm.toLowerCase()) ||
          testDate.includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Filter by date range
    if (dateFilter.start && dateFilter.end) {
      filtered = filtered.filter(test => {
        const testDate = new Date(test.date_test);
        return (
          testDate >= new Date(dateFilter.start) &&
          testDate <= new Date(dateFilter.end)
        );
      });
    }
    
    // Filter by responsable
    if (responsableFilter) {
      filtered = filtered.filter(test => test.responsable === parseInt(responsableFilter));
    }
    
    setFilteredTests(filtered);
  }, [tests, searchTerm, dateFilter, responsableFilter, responsables]);

  const handleTestSelect = (testId) => {
    setSelectedTest(testId);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilter({ start: null, end: null });
    setResponsableFilter('');
    setFilteredTests(tests);
  };

  const getResponsableInfo = (responsableId) => {
    return responsables.find(r => r.id === responsableId) || {};
  };

  const getCompetencesForTest = (testId) => {
    const testResultats = resultats.filter(r => r.test === testId);
    return testResultats.map(resultat => {
      const competence = competences.find(c => c.id === resultat.competence);
      return {
        ...resultat,
        nom_competence: competence ? competence.nom_competence : 'Compétence inconnue'
      };
    });
  };

//   const getPostesForTest = () => {
//     // This would need to be implemented based on your actual data structure
//     // For now, returning a mock response
//     return ['Développeur Frontend', 'Designer UX'];
    
//   };// Dans votre composant

const getPostesForTest = useCallback(async (testId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`);

    return response.data
      .filter(item => 
        item.candidat_id === id_candidat && 
        item.tester === true
      )
      .map(item => item.poste_nom);
  } catch (error) {
    console.error("Erreur récupération postes:", error);
    return [];
  }
}, [tests, id_candidat]);

useEffect(() => {
  if (selectedTest) {
    const loadPostes = async () => {
      const postes = await getPostesForTest(selectedTest);
      setPostesForTest(postes);
    };
    loadPostes();
  }
}, [selectedTest, getPostesForTest]);

useEffect(() => {
  if (selectedTest) {
    const loadPostes = async () => {
      const postes = await getPostesForTest(selectedTest);
      setPostesForTest(postes);
    };
    loadPostes();
  }
}, [selectedTest, getPostesForTest]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm:ss', { locale: fr });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} style={{ color: '#20c997' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold', mb: 3 }}>
        Historique des Tests
      </Typography>
      
      {/* Search and Filters */}
      <StyledPaper sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher par date ou responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            color="primary"
            sx={{ ml: 2 }}
          >
            <FilterList />
          </IconButton>
          
          <IconButton 
            onClick={handleResetFilters}
            color="secondary"
          >
            <Refresh />
          </IconButton>
        </Box>
        
        <Collapse in={showFilters}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date de début"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dateFilter.start || ''}
                  onChange={(e) => setDateFilter({...dateFilter, start: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date de fin"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dateFilter.end || ''}
                  onChange={(e) => setDateFilter({...dateFilter, end: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Filtrer par responsable"
                  value={responsableFilter}
                  onChange={(e) => setResponsableFilter(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <option value="">Tous les responsables</option>
                  {responsables.map((responsable) => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.prenom} {responsable.nom}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </StyledPaper>
      
      <Grid container spacing={3}>
        {/* Left Panel - Test List */}
        <Grid item xs={12} md={5}>
          <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                Tests Passés ({filteredTests.length})
              </Typography>
              
              {filteredTests.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                  Aucun test trouvé
                </Typography>
              ) : (
                <List>
                  {filteredTests.map((test) => {
                    const responsable = getResponsableInfo(test.responsable);
                    return (
                      <React.Fragment key={test.id}>
                        <TestButton
                          fullWidth
                          selected={selectedTest === test.id}
                          onClick={() => handleTestSelect(test.id)}
                          startIcon={<Today />}
                          endIcon={selectedTest === test.id ? <ExpandLess /> : <ExpandMore />}
                        >
                          <Box sx={{ textAlign: 'left', width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {formatDate(test.date_test)}
                            </Typography>
                            <Typography variant="body2">
                              Responsable: {responsable.prenom} {responsable.nom}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              {responsable.email}
                            </Typography>
                          </Box>
                        </TestButton>
                        <Divider sx={{ my: 1 }} />
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </StyledPaper>
          </Slide>
        </Grid>
        
        {/* Right Panel - Test Details */}
        <Grid item xs={12} md={7}>
          <Fade in={!loading && selectedTest !== null}>
            <div>
              {selectedTest ? (
                <StyledPaper>
                  {filteredTests.filter(t => t.id === selectedTest).map(test => {
                    const responsable = getResponsableInfo(test.responsable);
                    const testCompetences = getCompetencesForTest(test.id);
                    const testPostes = getPostesForTest(id_candidat);
                    
                    return (
                      <Box key={test.id}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                          Détails du Test
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Date: {formatDate(test.date_test)}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Responsable: {responsable.prenom} {responsable.nom}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Email: {responsable.email}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        Postes concernés
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {postesForTest.length > 0 ? (
                            postesForTest.map((poste, index) => (
                            <Zoom in key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                                <Chip 
                                label={poste} 
                                color="primary" 
                                variant="outlined"
                                avatar={<Avatar sx={{ bgcolor: '#007bff10' }}>{index + 1}</Avatar>}
                                />
                            </Zoom>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                            Aucun poste trouvé pour ce test
                            </Typography>
                        )}
                        </Box>
                        
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Compétences évaluées
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {testCompetences.map((competence) => (
                            <Zoom in key={competence.id}>
                              <CompetenceChip
                                label={`${competence.nom_competence}: ${competence.niveau_evalue}/10`}
                              />
                            </Zoom>
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </StyledPaper>
              ) : (
                <StyledPaper>
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                    Sélectionnez un test pour voir les détails
                  </Typography>
                </StyledPaper>
              )}
            </div>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestHistoryViewer;