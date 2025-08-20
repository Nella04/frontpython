import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  Tabs,
  Tab,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search,
  Event,
  Work,
  Psychology,
  ExpandMore,
  Person,
  CalendarToday,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { blue, green } from '@mui/material/colors';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import styled from '@emotion/styled';

// Styles personnalisés
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 123, 255, 0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 123, 255, 0.15)'
  },
  background: 'white',
}));

const SkillLevelBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: value >= 70 ? green[500] : value >= 40 ? blue[500] : theme.palette.warning.main,
  },
}));

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const TestHistoryView = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPoste, setFilterPoste] = useState('');
  const [filterCompetence, setFilterCompetence] = useState('');
  const [availablePostes, setAvailablePostes] = useState([]);
  const [availableCompetences, setAvailableCompetences] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Récupérer l'ID du candidat depuis localStorage
  useEffect(() => {
    const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
    const idcanlocal = userLocalapi?.idpersonnelocal;
    
    if (!idcanlocal) {
      setError("Aucun utilisateur connecté trouvé");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Récupérer les tests du candidat
        const testsResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/tests?candidat_id=${idcanlocal}&_sort=date_test&_order=desc`);
        const testsData = await testsResponse.json();

        // Pour chaque test, récupérer les détails supplémentaires
        const enrichedTests = await Promise.all(testsData.map(async test => {
          // Récupérer le responsable
          const respResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/responsables/${test.id_responsable}`);
          const respData = await respResponse.json();

          // Récupérer les résultats du test
          const resultsResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/resultats?id_test=${test.id_test}`);
          const resultsData = await resultsResponse.json();

          // Pour chaque résultat, récupérer la compétence et les postes associés
          const enrichedResults = await Promise.all(resultsData.map(async result => {
            const compResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/${result.id_competence}`);
            const compData = await compResponse.json();

            const postesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenances?id_competence=${result.id_competence}`);
            const postesData = await postesResponse.json();

            const postesDetails = await Promise.all(postesData.map(async p => {
              const posteResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/postes/${p.id_poste}`);
              return await posteResponse.json();
            }));

            return {
              ...result,
              competence: compData,
              postes: postesDetails
            };
          }));

          return {
            ...test,
            responsable: respData,
            results: enrichedResults
          };
        }));

        setTests(enrichedTests);
        setFilteredTests(enrichedTests);

        // Extraire les postes et compétences uniques pour les filtres
        const postes = [];
        const competences = [];

        enrichedTests.forEach(test => {
          test.results.forEach(result => {
            result.postes.forEach(poste => {
              if (!postes.some(p => p.id_poste === poste.id_poste)) {
                postes.push(poste);
              }
            });
            if (!competences.some(c => c.id_competence === result.competence.id_competence)) {
              competences.push(result.competence);
            }
          });
        });

        setAvailablePostes(postes);
        setAvailableCompetences(competences);
        setLoading(false);

      } catch (err) {
        setError("Erreur lors du chargement des données");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Filtrer les tests
  useEffect(() => {
    let filtered = [...tests];

    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.responsable.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.responsable.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(test => 
        format(new Date(test.date_test), 'yyyy-MM-dd') === filterDate
      );
    }

    if (filterPoste) {
      filtered = filtered.filter(test => 
        test.results.some(result => 
          result.postes.some(poste => poste.id_poste.toString() === filterPoste)
        )
      );
    }

    if (filterCompetence) {
      filtered = filtered.filter(test => 
        test.results.some(result => 
          result.id_competence.toString() === filterCompetence
        )
      );
    }

    setFilteredTests(filtered);
  }, [searchTerm, filterDate, filterPoste, filterCompetence, tests]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} sx={{ color: blue[500] }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 4, background: '#F5F5F5', minHeight: '100vh' }}>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: blue[800] }}>
          Historique des Tests
        </Typography>

        {/* Filtres */}
        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rechercher par responsable..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Poste</InputLabel>
                  <Select
                    value={filterPoste}
                    onChange={(e) => setFilterPoste(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Work sx={{ color: 'action.active', mr: 1 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">Tous les postes</MenuItem>
                    {availablePostes.map(poste => (
                      <MenuItem key={poste.id_poste} value={poste.id_poste}>
                        {poste.nom_poste}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Compétence</InputLabel>
                  <Select
                    value={filterCompetence}
                    onChange={(e) => setFilterCompetence(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Psychology sx={{ color: 'action.active', mr: 1 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">Toutes les compétences</MenuItem>
                    {availableCompetences.map(comp => (
                      <MenuItem key={comp.id_competence} value={comp.id_competence}>
                        {comp.nom_competence}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        {/* Résultats */}
        {filteredTests.length === 0 ? (
          <StyledCard>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                Aucun test trouvé avec ces critères
              </Typography>
            </CardContent>
          </StyledCard>
        ) : (
          <Grid container spacing={3}>
            {filteredTests.map((test, index) => (
              <Grid item xs={12} key={test.id_test}>
                <motion.div
                  variants={slideUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: blue[100], color: blue[800], mr: 2 }}>
                            <Event />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="medium">
                              Test du {format(new Date(test.date_test), 'PPP', { locale: fr })}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Évalué par {test.responsable.prenom} {test.responsable.nom}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={`${test.results.length} compétences évaluées`} 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Postes concernés */}
                      <Box mb={3}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                          <Work sx={{ mr: 1, color: blue[500] }} /> Postes concernés
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {Array.from(new Set(test.results.flatMap(result => result.postes))).map(poste => (
                            <Chip 
                              key={poste.id_poste} 
                              label={poste.nom_poste} 
                              sx={{ bgcolor: blue[50], color: blue[700] }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Compétences évaluées */}
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                        <Psychology sx={{ mr: 1, color: blue[500] }} /> Compétences évaluées
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {test.results.map((result, idx) => (
                          <Grid item xs={12} sm={6} md={4} key={`${test.id_test}-${result.id_competence}`}>
                            <Accordion sx={{ boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, borderRadius: '8px!important' }}>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box width="100%">
                                  <Typography fontWeight="medium">{result.competence.nom_competence}</Typography>
                                  <Box display="flex" alignItems="center" mt={1}>
                                    <Star sx={{ fontSize: 16, color: green[500], mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ mr: 2 }}>
                                      Niveau: {result.niveau_evalué}/10
                                    </Typography>
                                    <SkillLevelBar 
                                      variant="determinate" 
                                      value={result.niveau_evalué * 10} 
                                      sx={{ width: '60px', ml: 'auto' }}
                                    />
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Postes associés:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                  {result.postes.map(poste => (
                                    <Chip 
                                      key={poste.id_poste} 
                                      label={poste.nom_poste} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Box>
  );
};

export default TestHistoryView;