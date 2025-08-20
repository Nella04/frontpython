// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Grid, 
//   Typography, 
//   Button, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   Divider, 
//   Paper,
//   TextField,
//   InputAdornment,
//   Avatar,
//   Chip,
//   CircularProgress,
//   Collapse,
//   Fade,
//   Slide
// } from '@mui/material';
// import { 
//   Search as SearchIcon, 
//   DateRange as DateRangeIcon,
//   Person as PersonIcon,
//   Work as WorkIcon,
//   Star as StarIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon
// } from '@mui/icons-material';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: '#F5F5F5',
//     minHeight: '100vh',
//     padding: theme.spacing(3),
//   },
//   leftPanel: {
//     backgroundColor: 'white',
//     borderRadius: theme.shape.borderRadius,
//     padding: theme.spacing(2),
//     height: '100%',
//     boxShadow: theme.shadows[2],
//   },
//   rightPanel: {
//     backgroundColor: 'white',
//     borderRadius: theme.shape.borderRadius,
//     padding: theme.spacing(3),
//     height: '100%',
//     boxShadow: theme.shadows[2],
//   },
//   testButton: {
//     marginBottom: theme.spacing(1),
//     justifyContent: 'space-between',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       transform: 'translateX(5px)',
//       backgroundColor: '#20c997',
//       color: 'white',
//     },
//   },
//   activeTest: {
//     backgroundColor: '#007bff !important',
//     color: 'white !important',
//   },
//   searchSection: {
//     marginBottom: theme.spacing(3),
//   },
//   posteTitle: {
//     backgroundColor: '#20c997',
//     color: 'white',
//     padding: theme.spacing(1, 2),
//     borderRadius: theme.shape.borderRadius,
//     marginBottom: theme.spacing(2),
//   },
//   competenceItem: {
//     paddingLeft: theme.spacing(4),
//     transition: 'all 0.2s ease',
//     '&:hover': {
//       backgroundColor: '#f0f0f0',
//     },
//   },
//   niveauChip: {
//     marginLeft: theme.spacing(1),
//   },
//   progressBar: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#e0e0e0',
//     marginTop: theme.spacing(1),
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 4,
//     backgroundColor: '#007bff',
//   },
// }));

// const HistoriqueTests = () => {
//   const classes = useStyles();
//   const [tests, setTests] = useState([]);
//   const [filteredTests, setFilteredTests] = useState([]);
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [responsables, setResponsables] = useState([]);
//   const [postes, setPostes] = useState([]);
//   const [competences, setCompetences] = useState([]);
//   const [resultats, setResultats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchResponsable, setSearchResponsable] = useState('');
//   const [dateDebut, setDateDebut] = useState('');
//   const [dateFin, setDateFin] = useState('');
//   const [expandedPostes, setExpandedPostes] = useState({});

//   // Récupérer l'ID du candidat depuis localStorage
//   const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
//   const id_candidat = userLocalapi?.idpersonnelocal;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Récupérer tous les tests
//         const testsResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/tests/`);
//         const testsData = await testsResponse.json();
        
//         // Filtrer les tests pour ne garder que ceux du candidat
//         const candidatTests = testsData.filter(test => test.candidat === id_candidat);
        
//         // Trier par date (du plus récent au plus ancien)
//         const sortedTests = candidatTests.sort((a, b) => 
//           new Date(b.date_test) - new Date(a.date_test)
//         );
        
//         setTests(sortedTests);
//         setFilteredTests(sortedTests);
        
//         // Si des tests existent, sélectionner le premier par défaut
//         if (sortedTests.length > 0) {
//           setSelectedTest(sortedTests[0].id);
//         }
        
//         // Récupérer les responsables
//         const responsablesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/responsables/`);
//         const responsablesData = await responsablesResponse.json();
//         setResponsables(responsablesData);
        
//         // Récupérer les compétences
//         const competencesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`);
//         const competencesData = await competencesResponse.json();
//         setCompetences(competencesData);
        
//         // Récupérer les résultats de tests
//         const resultatsResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/resultats/`);
//         const resultatsData = await resultatsResponse.json();
//         setResultats(resultatsData);
        
//         // Récupérer les appartenances compétences-postes
//         const appartenancesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`);
//         const appartenancesData = await appartenancesResponse.json();
        
//         // Extraire les postes uniques
//         const uniquePostes = [...new Set(appartenancesData.map(item => item.poste_nom))];
//         setPostes(uniquePostes);
        
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
    
//     if (id_candidat) {
//       fetchData();
//     }
//   }, [id_candidat]);

//   // Gérer la sélection d'un test
//   const handleTestSelect = (testId) => {
//     setSelectedTest(testId);
//   };

//   // Filtrer les tests par responsable
//   const handleResponsableSearch = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearchResponsable(searchTerm);
    
//     if (searchTerm === '') {
//       setFilteredTests(tests);
//     } else {
//       const filtered = tests.filter(test => {
//         const responsable = responsables.find(r => r.id === test.responsable);
//         return responsable && (
//           responsable.nom.toLowerCase().includes(searchTerm) || 
//           responsable.prenom.toLowerCase().includes(searchTerm)
//         );
//       });
//       setFilteredTests(filtered);
//     }
//   };

//   // Filtrer les tests par date
//   const handleDateFilter = () => {
//     if (!dateDebut || !dateFin) return;
    
//     const filtered = tests.filter(test => {
//       const testDate = new Date(test.date_test);
//       const startDate = new Date(dateDebut);
//       const endDate = new Date(dateFin);
      
//       return testDate >= startDate && testDate <= endDate;
//     });
    
//     setFilteredTests(filtered);
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setFilteredTests(tests);
//     setSearchResponsable('');
//     setDateDebut('');
//     setDateFin('');
//   };

//   // Toggle l'expansion des postes
//   const togglePosteExpansion = (poste) => {
//     setExpandedPostes(prev => ({
//       ...prev,
//       [poste]: !prev[poste]
//     }));
//   };

//   // Récupérer les compétences évaluées pour un test sélectionné
//   const getCompetencesForSelectedTest = () => {
//     if (!selectedTest) return [];
    
//     return resultats
//       .filter(resultat => resultat.test === selectedTest)
//       .map(resultat => {
//         const competence = competences.find(c => c.id === resultat.competence);
//         return {
//           ...resultat,
//           nom_competence: competence ? competence.nom_competence : 'Inconnue'
//         };
//       });
//   };

//   // Récupérer les informations du responsable d'un test
//   const getResponsableForTest = (testId) => {
//     const test = tests.find(t => t.id === testId);
//     if (!test) return null;
    
//     return responsables.find(r => r.id === test.responsable);
//   };

//   // Formater la date
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleDateString('fr-FR', options);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   if (tests.length === 0) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <Typography variant="h6">Aucun test passé pour le moment</Typography>
//       </Box>
//     );
//   }

//   return (
//     <div className={classes.root}>
//       <Typography variant="h4" gutterBottom style={{ color: '#007bff', marginBottom: 24 }}>
//         Historique de mes tests
//       </Typography>
      
//       <Grid container spacing={3}>
//         {/* Panel gauche - Liste des tests */}
//         <Grid item xs={12} md={4}>
//           <Paper className={classes.leftPanel}>
//             <div className={classes.searchSection}>
//               <Typography variant="h6" gutterBottom style={{ color: '#007bff' }}>
//                 Recherche
//               </Typography>
              
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Rechercher par responsable"
//                 value={searchResponsable}
//                 onChange={handleResponsableSearch}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <PersonIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//                 margin="normal"
//               />
              
//               <Box display="flex" alignItems="center" mt={2} mb={2}>
//                 <DateRangeIcon color="action" style={{ marginRight: 8 }} />
//                 <TextField
//                   type="date"
//                   label="Date début"
//                   variant="outlined"
//                   value={dateDebut}
//                   onChange={(e) => setDateDebut(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   style={{ marginRight: 16 }}
//                 />
//                 <TextField
//                   type="date"
//                   label="Date fin"
//                   variant="outlined"
//                   value={dateFin}
//                   onChange={(e) => setDateFin(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Box>
              
//               <Box display="flex" justifyContent="space-between">
//                 <Button 
//                   variant="contained" 
//                   color="primary"
//                   onClick={handleDateFilter}
//                   disabled={!dateDebut || !dateFin}
//                 >
//                   Filtrer
//                 </Button>
//                 <Button 
//                   variant="outlined" 
//                   color="secondary"
//                   onClick={resetFilters}
//                 >
//                   Réinitialiser
//                 </Button>
//               </Box>
//             </div>
            
//             <Divider style={{ margin: '16px 0' }} />
            
//             <Typography variant="h6" gutterBottom style={{ color: '#007bff' }}>
//               Mes tests ({filteredTests.length})
//             </Typography>
            
//             <List>
//               {filteredTests.map((test) => {
//                 const responsable = getResponsableForTest(test.id);
//                 return (
//                   <Slide key={test.id} direction="up" in timeout={500}>
//                     <ListItem
//                       button
//                       className={`${classes.testButton} ${selectedTest === test.id ? classes.activeTest : ''}`}
//                       onClick={() => handleTestSelect(test.id)}
//                     >
//                       <ListItemText
//                         primary={formatDate(test.date_test)}
//                         secondary={responsable ? `${responsable.prenom} ${responsable.nom}` : 'Responsable inconnu'}
//                       />
//                       {selectedTest === test.id && <StarIcon />}
//                     </ListItem>
//                   </Slide>
//                 );
//               })}
//             </List>
//           </Paper>
//         </Grid>
        
//         {/* Panel droit - Détails du test sélectionné */}
//         <Grid item xs={12} md={8}>
//           <Fade in={!!selectedTest} timeout={500}>
//             <Paper className={classes.rightPanel}>
//               {selectedTest ? (
//                 <>
//                   <Box display="flex" alignItems="center" mb={3}>
//                     <Avatar style={{ backgroundColor: '#007bff', marginRight: 16 }}>
//                       <WorkIcon />
//                     </Avatar>
//                     <div>
//                       <Typography variant="h5">
//                         Test du {formatDate(tests.find(t => t.id === selectedTest).date_test)}
//                       </Typography>
//                       <Typography variant="subtitle1" color="textSecondary">
//                         Responsable: {(() => {
//                           const responsable = getResponsableForTest(selectedTest);
//                           return responsable ? `${responsable.prenom} ${responsable.nom}` : 'Inconnu';
//                         })()}
//                       </Typography>
//                     </div>
//                   </Box>
                  
//                   <Divider style={{ marginBottom: 24 }} />
                  
//                   <Typography variant="h6" gutterBottom style={{ color: '#007bff' }}>
//                     Postes évalués
//                   </Typography>
                  
//                   {postes.map((poste) => (
//                     <Box key={poste} mb={3}>
//                       <Paper 
//                         elevation={2} 
//                         className={classes.posteTitle}
//                         onClick={() => togglePosteExpansion(poste)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <Box display="flex" justifyContent="space-between" alignItems="center">
//                           <Typography variant="subtitle1">
//                             {poste}
//                           </Typography>
//                           {expandedPostes[poste] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                         </Box>
//                       </Paper>
                      
//                       <Collapse in={expandedPostes[poste]}>
//                         <List>
//                           {getCompetencesForSelectedTest()
//                             .filter(comp => {
//                               // Ici vous devriez vérifier si la compétence appartient au poste
//                               // Pour simplifier, nous affichons toutes les compétences
//                               return true;
//                             })
//                             .map((competence) => (
//                               <React.Fragment key={competence.id}>
//                                 <ListItem className={classes.competenceItem}>
//                                   <ListItemText
//                                     primary={competence.nom_competence}
//                                     secondary={
//                                       <Box>
//                                         <Box display="flex" alignItems="center">
//                                           Niveau évalué: 
//                                           <Chip
//                                             label={competence.niveau_evalue}
//                                             color="primary"
//                                             size="small"
//                                             className={classes.niveauChip}
//                                           />
//                                         </Box>
//                                         <div className={classes.progressBar}>
//                                           <div 
//                                             className={classes.progressFill} 
//                                             style={{ width: `${(competence.niveau_evalue / 10) * 100}%` }}
//                                           />
//                                         </div>
//                                       </Box>
//                                     }
//                                   />
//                                 </ListItem>
//                                 <Divider variant="inset" component="li" />
//                               </React.Fragment>
//                             ))}
//                         </List>
//                       </Collapse>
//                     </Box>
//                   ))}
//                 </>
//               ) : (
//                 <Typography variant="body1">Sélectionnez un test pour voir les détails</Typography>
//               )}
//             </Paper>
//           </Fade>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default HistoriqueTests;


import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Paper,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  CircularProgress,
  Collapse,
  Fade,
  Slide,
  styled
} from '@mui/material';
import { 
  Search as SearchIcon, 
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

// Composants stylisés
const RootContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  minHeight: '100vh',
  padding: theme.spacing(3),
}));

const LeftPanel = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  height: '100%',
  boxShadow: theme.shadows[2],
}));

const RightPanel = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  height: '100%',
  boxShadow: theme.shadows[2],
}));

const TestButton = styled(ListItem)(({ theme, selected }) => ({
  marginBottom: theme.spacing(1),
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  backgroundColor: selected ? '#007bff !important' : 'inherit',
  color: selected ? 'white !important' : 'inherit',
  '&:hover': {
    transform: 'translateX(5px)',
    backgroundColor: selected ? '#007bff' : '#20c997',
    color: selected ? 'white' : 'white',
  },
}));

const PosteTitle = styled(Paper)(({ theme }) => ({
  backgroundColor: '#20c997',
  color: 'white',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
}));

const CompetenceItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e0e0e0',
  marginTop: theme.spacing(1),
}));

const ProgressFill = styled(Box)(({ theme, niveau }) => ({
  height: '100%',
  borderRadius: 4,
  backgroundColor: '#007bff',
  width: `${(niveau / 10) * 100}%`,
}));

const HistoriqueTests = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [responsables, setResponsables] = useState([]);
  const [postes, setPostes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResponsable, setSearchResponsable] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [expandedPostes, setExpandedPostes] = useState({});

  // Récupérer l'ID du candidat depuis localStorage
  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const id_candidat = userLocalapi?.idpersonnelocal;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const testsResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/tests/`);
        const testsData = await testsResponse.json();
        const candidatTests = testsData.filter(test => test.candidat === id_candidat);
        const sortedTests = candidatTests.sort((a, b) => 
          new Date(b.date_test) - new Date(a.date_test)
        );
        
        setTests(sortedTests);
        setFilteredTests(sortedTests);
        
        if (sortedTests.length > 0) {
          setSelectedTest(sortedTests[0].id);
        }
        
        const responsablesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/responsables/`);
        const responsablesData = await responsablesResponse.json();
        setResponsables(responsablesData);
        
        const competencesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`);
        const competencesData = await competencesResponse.json();
        setCompetences(competencesData);
        
        const resultatsResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/resultats/`);
        const resultatsData = await resultatsResponse.json();
        setResultats(resultatsData);
        
        const appartenancesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`);
        const appartenancesData = await appartenancesResponse.json();
        const uniquePostes = [...new Set(appartenancesData.map(item => item.poste_nom))];
        setPostes(uniquePostes);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (id_candidat) {
      fetchData();
    }
  }, [id_candidat]);

  const handleTestSelect = (testId) => {
    setSelectedTest(testId);
  };

  const handleResponsableSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchResponsable(searchTerm);
    
    if (searchTerm === '') {
      setFilteredTests(tests);
    } else {
      const filtered = tests.filter(test => {
        const responsable = responsables.find(r => r.id === test.responsable);
        return responsable && (
          responsable.nom.toLowerCase().includes(searchTerm) || 
          responsable.prenom.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredTests(filtered);
    }
  };

  const handleDateFilter = () => {
    if (!dateDebut || !dateFin) return;
    
    const filtered = tests.filter(test => {
      const testDate = new Date(test.date_test);
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      
      return testDate >= startDate && testDate <= endDate;
    });
    
    setFilteredTests(filtered);
  };

  const resetFilters = () => {
    setFilteredTests(tests);
    setSearchResponsable('');
    setDateDebut('');
    setDateFin('');
  };

  const togglePosteExpansion = (poste) => {
    setExpandedPostes(prev => ({
      ...prev,
      [poste]: !prev[poste]
    }));
  };

  const getCompetencesForSelectedTest = () => {
    if (!selectedTest) return [];
    
    return resultats
      .filter(resultat => resultat.test === selectedTest)
      .map(resultat => {
        const competence = competences.find(c => c.id === resultat.competence);
        return {
          ...resultat,
          nom_competence: competence ? competence.nom_competence : 'Inconnue'
        };
      });
  };

  const getResponsableForTest = (testId) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return null;
    
    return responsables.find(r => r.id === test.responsable);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (tests.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">Aucun test passé pour le moment</Typography>
      </Box>
    );
  }

  return (
    <RootContainer>
      <Typography variant="h4" gutterBottom style={{ color: '#007bff', marginBottom: 24 }}>
        Historique de mes tests
      </Typography>
      
      <Grid container spacing={3}>
        {/* Panel gauche - Liste des tests */}
        <Grid item xs={12} md={4}>
          <LeftPanel>
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom style={{ color: '#007bff' }}>
                Recherche
              </Typography>
              
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par responsable"
                value={searchResponsable}
                onChange={handleResponsableSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                margin="normal"
              />
              
              <Box display="flex" alignItems="center" mt={2} mb={2}>
                <DateRangeIcon color="action" style={{ marginRight: 8 }} />
                <TextField
                  type="date"
                  label="Date début"
                  variant="outlined"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  style={{ marginRight: 16 }}
                />
                <TextField
                  type="date"
                  label="Date fin"
                  variant="outlined"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              
              <Box display="flex" justifyContent="space-between">
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleDateFilter}
                  disabled={!dateDebut || !dateFin}
                >
                  Filtrer
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </Button>
              </Box>
            </Box>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Typography variant="h6" gutterBottom style={{ color: '#007bff' }}>
              Mes tests ({filteredTests.length})
            </Typography>
            
            <List>
              {filteredTests.map((test) => {
                const responsable = getResponsableForTest(test.id);
                return (
                  <Slide key={test.id} direction="up" in timeout={500}>
                    <TestButton
                      selected={selectedTest === test.id}
                      onClick={() => handleTestSelect(test.id)}
                    >
                      <ListItemText
                        primary={formatDate(test.date_test)}
                        secondary={responsable ? `${responsable.prenom} ${responsable.nom}` : 'Responsable inconnu'}
                      />
                      {selectedTest === test.id && <StarIcon />}
                    </TestButton>
                  </Slide>
                );
              })}
            </List>
          </LeftPanel>
        </Grid>
        
        {/* Panel droit - Détails du test sélectionné */}
        <Grid item xs={12} md={8}>
          <Fade in={!!selectedTest} timeout={500}>
            <RightPanel>
              {selectedTest ? (
                <>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar style={{ backgroundColor: '#007bff', marginRight: 16 }}>
                      <WorkIcon />
                    </Avatar>
                    <div>
                      <Typography variant="h5">
                        Test du {formatDate(tests.find(t => t.id === selectedTest).date_test)}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Responsable: {(() => {
                          const responsable = getResponsableForTest(selectedTest);
                          return responsable ? `${responsable.prenom} ${responsable.nom}` : 'Inconnu';
                        })()}
                      </Typography>
                    </div>
                  </Box>
                  
                  <Divider style={{ marginBottom: 24 }} />
                  
                  <Typography variant="h6" gutterBottom style={{ color: '#007bff' }}>
                    Postes évalués
                  </Typography>
                  
                  {postes.map((poste) => (
                    <Box key={poste} mb={3}>
                      <PosteTitle onClick={() => togglePosteExpansion(poste)}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1">
                            {poste}
                          </Typography>
                          {expandedPostes[poste] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Box>
                      </PosteTitle>
                      
                      <Collapse in={expandedPostes[poste]}>
                        <List>
                          {getCompetencesForSelectedTest()
                            .map((competence) => (
                              <React.Fragment key={competence.id}>
                                <CompetenceItem>
                                  <ListItemText
                                    primary={competence.nom_competence}
                                    secondary={
                                      <Box>
                                        <Box display="flex" alignItems="center">
                                          Niveau évalué: 
                                          <Chip
                                            label={competence.niveau_evalue}
                                            color="primary"
                                            size="small"
                                            sx={{ marginLeft: 1 }}
                                          />
                                        </Box>
                                        <ProgressBar>
                                          <ProgressFill niveau={competence.niveau_evalue} />
                                        </ProgressBar>
                                      </Box>
                                    }
                                  />
                                </CompetenceItem>
                                <Divider variant="inset" component="li" />
                              </React.Fragment>
                            ))}
                        </List>
                      </Collapse>
                    </Box>
                  ))}
                </>
              ) : (
                <Typography variant="body1">Sélectionnez un test pour voir les détails</Typography>
              )}
            </RightPanel>
          </Fade>
        </Grid>
      </Grid>
    </RootContainer>
  );
};

export default HistoriqueTests;