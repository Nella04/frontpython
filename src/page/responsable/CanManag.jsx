// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   Container,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   CardHeader,
//   Avatar,
//   Chip,
//   Divider,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   ListItemSecondaryAction,
//   CircularProgress,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Collapse,
//   Fade,
//   Slide,
//   Zoom,
//   Grow
// } from '@mui/material';
// import {
//   Folder as DomainIcon,
//   Work as PosteIcon,
//   People as CandidatIcon,
//   Star as CompetenceIcon,
//   FilterList as FilterIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { green, blue } from '@mui/material/colors';
// import StarIcon from '@mui/icons-material/Star';
// import FolderIcon from '@mui/icons-material/Folder';


// // Configuration axios
// axios.defaults.baseURL = process.env.REACT_APP_BACK_URL;

// // Thème personnalisé
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#007bff',
//     },
//     secondary: {
//       main: '#20c997',
//     },
//     background: {
//       default: '#F5F5F5',
//     },
//   },
// });

// // Styles personnalisés
// const StyledCard = styled(Card)(({ theme }) => ({
//   transition: 'transform 0.3s, box-shadow 0.3s',
//   '&:hover': {
//     transform: 'translateY(-5px)',
//     boxShadow: theme.shadows[8],
//   },
// }));

// const CompetenceChip = styled(Chip)(({ theme, niveau }) => {
//   let color;
//   if (niveau >= 8) color = green[500];
//   else if (niveau >= 5) color = blue[500];
//   else color = theme.palette.grey[500];

//   return {
//     backgroundColor: color,
//     color: theme.palette.common.white,
//     margin: theme.spacing(0.5),
//   };
// });

// const CandidatManagement2 = () => {
//   const [domaines, setDomaines] = useState([]);
//   const [selectedDomaine, setSelectedDomaine] = useState(null);
//   const [selectedPoste, setSelectedPoste] = useState(null);
//   const [candidats, setCandidats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCompetences, setSelectedCompetences] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedDomaine, setExpandedDomaine] = useState(null);
//   const [expandedPoste, setExpandedPoste] = useState(null);

//   useEffect(() => {
//     const fetchDomaines = async () => {
//       try {
//         const response = await axios.get('/api/domaines-details/');
//         setDomaines(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching domaines:', error);
//         setLoading(false);
//       }
//     };

//     fetchDomaines();
//   }, []);

//   useEffect(() => {
//     if (selectedPoste) {
//       const fetchCandidats = async () => {
//         setLoading(true);
//         try {
//           // Récupérer les candidats pour ce poste
//           const candidatsResponse = await axios.get(`/api/candidat-postes/?poste_id=${selectedPoste.id}`);
//           const candidatIds = candidatsResponse.data.map(c => c.candidat_id);
          
//           // Récupérer les compétences des candidats
//           const competencesResponse = await axios.get('/api/candidat-competences/');
//           const filteredCompetences = competencesResponse.data.filter(cc => 
//             candidatIds.includes(cc.candidat)
//           );
//           console.log('zz',filteredCompetences);
          
//           // Calculer les moyennes pour chaque candidat
//           const candidatsAvecMoyennes = candidatsResponse.data.map(candidat => {
//             const competences = filteredCompetences.filter(cc => cc.candidat === parseInt(candidat.candidat_id));
//             const competencesPoste = selectedPoste.competences;
            
//             // Calcul de la moyenne générale pondérée
//             let sumCoeff = 0;
//             let sumNiveauCoeff = 0;
            
//             competences.forEach(cc => {
//               const competencePoste = competencesPoste.find(cp => cp.id_comp === cc.competence);
//               if (competencePoste) {
//                 sumNiveauCoeff += cc.niveau * competencePoste.coefficient;
//                 sumCoeff += competencePoste.coefficient;
//               }
//             });
            
//             const moyenneGenerale = sumCoeff > 0 ? (sumNiveauCoeff / sumCoeff) : 0;
            
//             // Calcul de la moyenne filtrée si des compétences sont sélectionnées
//             let moyenneFiltree = null;
//             if (selectedCompetences.length > 0) {
//               let sumNiveau = 0;
//               let count = 0;
              
//               selectedCompetences.forEach(compId => {
//                 const cc = competences.find(c => c.competence === compId);
//                 if (cc) {
//                   sumNiveau += cc.niveau;
//                   count++;
//                 }
//               });
              
//               moyenneFiltree = count > 0 ? (sumNiveau / count) : 0;
//             }
            
//             return {
//               ...candidat,
//               moyenneGenerale,
//               moyenneFiltree,
//               competences
//             };
//           });
          
//           setCandidats(candidatsAvecMoyennes);
//           setLoading(false);
//         } catch (error) {
//           console.error('Error fetching candidats:', error);
//           setLoading(false);
//         }
//       };

//       fetchCandidats();
//     }
//   }, [selectedPoste, selectedCompetences]);

//   const handleDomaineClick = (domaine) => {
//     setSelectedDomaine(domaine);
//     setSelectedPoste(null);
//     setExpandedDomaine(expandedDomaine === domaine.id ? null : domaine.id);
//   };

//   const handlePosteClick = (poste) => {
//     setSelectedPoste(poste);
//     setExpandedPoste(expandedPoste === poste.id ? null : poste.id);
//   };

//   const handleCompetenceToggle = (competenceId) => {
//     setSelectedCompetences(prev => 
//       prev.includes(competenceId)
//         ? prev.filter(id => id !== competenceId)
//         : [...prev, competenceId]
//     );
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value.toLowerCase());
//   };

//   const filteredDomaines = domaines.filter(domaine => 
//     domaine.nom_domaine.toLowerCase().includes(searchTerm) ||
//     domaine.postes.some(poste => poste.nom_poste.toLowerCase().includes(searchTerm))
//   );

//   const filteredCandidats = candidats
//     .filter(candidat => 
//       selectedCompetences.length === 0 || 
//       candidat.moyenneFiltree > 0)
//     .sort((a, b) => b.moyenneGenerale - a.moyenneGenerale);
//     console.log('aa',selectedCompetences);
//     console.log('bb',candidats);

//   const renderMoyenne = (moyenne) => {
//     let color;
//     if (moyenne >= 8) color = green[500];
//     else if (moyenne >= 5) color = blue[500];
//     else color = 'error.main';

//     return (
//       <Box sx={{ 
//         display: 'inline-flex', 
//         alignItems: 'center',
//         color,
//         fontWeight: 'bold'
//       }}>
//         <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
//         {moyenne.toFixed(1)}
//       </Box>
//     );
//   };

//   if (loading && domaines.length === 0) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
//         <Typography variant="h3" component="h1" gutterBottom sx={{ 
//           fontWeight: 'bold', 
//           color: 'primary.main',
//           mb: 4,
//           textAlign: 'center'
//         }}>
//           Gestion des Candidats
//         </Typography>

//         <Grid container spacing={4}>
//           {/* Colonne Domaines et Postes */}
//           <Grid item xs={12} md={4}>
//             <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
//               <TextField
//                 fullWidth
//                 label="Rechercher domaine ou poste"
//                 variant="outlined"
//                 onChange={handleSearchChange}
//                 sx={{ mb: 3 }}
//               />

//               <Typography variant="h6" gutterBottom sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 color: 'primary.main'
//               }}>
//                 <DomainIcon sx={{ mr: 1 }} />
//                 Domaines
//               </Typography>

//               <Divider sx={{ mb: 2 }} />

//               {filteredDomaines.length === 0 ? (
//                 <Typography variant="body2" color="text.secondary">
//                   Aucun domaine trouvé
//                 </Typography>
//               ) : (
//                 <List>
//                   {filteredDomaines.map((domaine) => (
//                     <Grow in={true} key={domaine.id}>
//                       <div>
//                         <ListItem 
//                           button 
//                           onClick={() => handleDomaineClick(domaine)}
//                           sx={{
//                             backgroundColor: selectedDomaine?.id === domaine.id ? 'action.selected' : 'inherit',
//                             borderRadius: 1,
//                             mb: 1
//                           }}
//                         >
//                           <ListItemAvatar>
//                             <Avatar sx={{ bgcolor: 'primary.main' }}>
//                               <DomainIcon />
//                             </Avatar>
//                           </ListItemAvatar>
//                           <ListItemText 
//                             primary={domaine.nom_domaine} 
//                             secondary={`${domaine.postes.length} poste(s)`} 
//                           />
//                           {expandedDomaine === domaine.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                         </ListItem>

//                         <Collapse in={expandedDomaine === domaine.id} timeout="auto" unmountOnExit>
//                           <List component="div" disablePadding>
//                             {domaine.postes.map((poste) => (
//                               <Slide direction="right" in={expandedDomaine === domaine.id} key={poste.id}>
//                                 <ListItem 
//                                   button 
//                                   onClick={() => handlePosteClick(poste)}
//                                   sx={{ 
//                                     pl: 4,
//                                     backgroundColor: selectedPoste?.id === poste.id ? 'action.hover' : 'inherit',
//                                     borderRadius: 1,
//                                     mb: 0.5
//                                   }}
//                                 >
//                                   <ListItemAvatar>
//                                     <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
//                                       <PosteIcon fontSize="small" />
//                                     </Avatar>
//                                   </ListItemAvatar>
//                                   <ListItemText 
//                                     primary={poste.nom_poste} 
//                                     secondary={`${poste.competences.length} compétence(s)`} 
//                                   />
//                                 </ListItem>
//                               </Slide>
//                             ))}
//                           </List>
//                         </Collapse>
//                       </div>
//                     </Grow>
//                   ))}
//                 </List>
//               )}
//             </Paper>
//           </Grid>

//           {/* Colonne Candidats */}
//           <Grid item xs={12} md={8}>
//             <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
//               {selectedPoste ? (
//                 <>
//                   <Box sx={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                     mb: 3
//                   }}>
//                     <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
//                       <CandidatIcon color="primary" sx={{ mr: 1 }} />
//                       Candidats pour {selectedPoste.nom_poste}
//                       <Chip 
//                         label={`${filteredCandidats.length} candidat(s)`} 
//                         color="primary" 
//                         size="small" 
//                         sx={{ ml: 2 }} 
//                       />
//                     </Typography>

//                     {selectedPoste.competences.length > 0 && (
//                       <Button 
//                         startIcon={<FilterIcon />}
//                         onClick={() => setExpandedPoste(expandedPoste === selectedPoste.id ? null : selectedPoste.id)}
//                       >
//                         Filtres
//                       </Button>
//                     )}
//                   </Box>

//                   <Collapse in={expandedPoste === selectedPoste.id}>
//                     <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
//                       <Typography variant="subtitle1" gutterBottom>
//                         Filtrer par compétences:
//                       </Typography>
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                         {selectedPoste.competences.map((competence) => (
//                           <Fade in={true} key={competence.id_comp}>
//                             <FormControlLabel
//                               control={
//                                 <Checkbox
//                                   checked={selectedCompetences.includes(competence.id_comp)}
//                                   onChange={() => handleCompetenceToggle(competence.id_comp)}
//                                   color="primary"
//                                 />
//                               }
//                               label={`${competence.competence_nom} (coeff: ${competence.coefficient})`}
//                             />
//                           </Fade>
//                         ))}
//                       </Box>
//                     </Paper>
//                   </Collapse>

//                   {loading ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                       <CircularProgress />
//                     </Box>
//                   ) : filteredCandidats.length === 0 ? (
//                     <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
//                       Aucun candidat trouvé pour ce poste
//                     </Typography>
//                   ) : (
//                     <Grid container spacing={3}>
//                       {filteredCandidats.map((candidat, index) => (
//                         <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={candidat.id}>
//                           <Grid item xs={12} sm={6} lg={4}>
//                             <StyledCard elevation={3}>
//                               <CardHeader
//                                 avatar={
//                                   <Avatar sx={{ bgcolor: 'primary.main' }}>
//                                     {candidat.candidat_prenom.charAt(0)}{candidat.candidat_nom.charAt(0)}
//                                   </Avatar>
//                                 }
//                                 title={`${candidat.candidat_prenom} ${candidat.candidat_nom}`}
//                                 subheader={
//                                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                       Moyenne: 
//                                     </Typography>
//                                     {renderMoyenne(candidat.moyenneGenerale)}
//                                     {selectedCompetences.length > 0 && (
//                                       <>
//                                         <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
//                                           |
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                           Filtre: 
//                                         </Typography>
//                                         {renderMoyenne(candidat.moyenneFiltree)}
//                                       </>
//                                     )}
//                                   </Box>
//                                 }
//                               />
//                               <CardContent>
//                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                   Email: {candidat.email}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                   Statut: {candidat.tester ? 
//                                     <Chip label="Testé" size="small" color="success" /> : 
//                                     <Chip label="Non testé" size="small" color="default" />}
//                                 </Typography>

//                                 <Divider sx={{ my: 2 }} />

//                                 <Typography variant="subtitle2" gutterBottom>
//                                   Compétences:
//                                 </Typography>
//                                 <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
//                                   {candidat.competences.map((cc) => {
//                                     const competence = selectedPoste.competences.find(c => c.id_comp === cc.competence);
//                                     return competence ? (
//                                       <CompetenceChip
//                                         key={cc.id}
//                                         niveau={cc.niveau}
//                                         label={`${competence.competence_nom}: ${cc.niveau}/10`}
//                                         size="small"
//                                       />
//                                     ) : null;
//                                   })}
//                                 </Box>
//                               </CardContent>
//                             </StyledCard>
//                           </Grid>
//                         </Zoom>
//                       ))}
//                     </Grid>
//                   )}
//                 </>
//               ) : (
//                 <Box sx={{ 
//                   display: 'flex', 
//                   flexDirection: 'column', 
//                   alignItems: 'center', 
//                   justifyContent: 'center', 
//                   height: '100%',
//                   textAlign: 'center'
//                 }}>
//                   <FolderIcon color="disabled" sx={{ fontSize: 80, mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary">
//                     {selectedDomaine 
//                       ? "Sélectionnez un poste pour voir les candidats" 
//                       : "Sélectionnez un domaine pour commencer"}
//                   </Typography>
//                 </Box>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default CandidatManagement2;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  IconButton,
  CircularProgress,
  Chip,
  Avatar,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Domain as DomainIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';


const CandidateManagement2 = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [expandedPoste, setExpandedPoste] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all necessary data
        const [domainsRes, candidatesRes, competencesRes, candidatCompetencesRes, candidatPostesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`)
        ]);

        // Process data to create a structured hierarchy
        const processedDomains = domainsRes.data.map(domain => {
          const postesWithCandidates = domain.postes.map(poste => {
            // Find candidates for this poste
            const candidatesForPoste = candidatPostesRes.data
              .filter(cp => cp.poste_id === poste.id.toString())
              .map(cp => {
                // Find candidate details
                const candidate = candidatesRes.data.find(c => c.id === parseInt(cp.candidat_id));
                // Find candidate's competences
                const competences = candidatCompetencesRes.data
                  .filter(cc => cc.candidat === parseInt(cp.candidat_id))
                  .map(cc => {
                    const competence = competencesRes.data.find(c => c.id === cc.competence);
                    return {
                      id: competence.id,
                      nom: competence.nom_competence,
                      niveau: cc.niveau
                    };
                  });

                // Calculate weighted average for this poste's required competences
                let moyenne = 0;
                if (poste.competences.length > 0) {
                  const { sumNiveauCoeff, sumCoeff } = poste.competences.reduce(
                    (acc, comp) => {
                      const candidateComp = competences.find(c => c.id === comp.id_comp);
                      if (candidateComp) {
                        return {
                          sumNiveauCoeff: acc.sumNiveauCoeff + candidateComp.niveau * comp.coefficient,
                          sumCoeff: acc.sumCoeff + comp.coefficient
                        };
                      }
                      return acc;
                    },
                    { sumNiveauCoeff: 0, sumCoeff: 0 }
                  );

                  moyenne = sumCoeff > 0 ? sumNiveauCoeff / sumCoeff : 0;
                }

                return {
                  id: candidate.id,
                  nom: candidate.nom,
                  prenom: candidate.prenom,
                  email: candidate.email,
                  teste: cp.tester,
                  competences,
                  moyenne: parseFloat(moyenne.toFixed(2))
                };
              });

            // Sort candidates by moyenne descending
            const sortedCandidates = [...candidatesForPoste].sort((a, b) => b.moyenne - a.moyenne);

            return {
              ...poste,
              candidates: sortedCandidates
            };
          });

          return {
            ...domain,
            postes: postesWithCandidates
          };
        });

        setDomains(processedDomains);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDomainClick = (domainId) => {
    setExpandedDomain(expandedDomain === domainId ? null : domainId);
  };

  const handlePosteClick = (posteId) => {
    setExpandedPoste(expandedPoste === posteId ? null : posteId);
  };

  const renderStars = (score) => {
    const stars = [];
    const maxStars = 5;
    const filledStars = Math.round((score / 10) * maxStars);

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        i <= filledStars ? (
          <StarIcon key={i} color="secondary" fontSize="small" />
        ) : (
          <StarBorderIcon key={i} color="secondary" fontSize="small" />
        )
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="secondary" />
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#007bff', mb: 4 }}>
          Gestion des Candidats par Domaine et Poste
        </Typography>

        {domains.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Aucun domaine disponible.
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {domains.map((domain) => (
              <motion.div
                key={domain.id}
                whileHover={{ scale: 1.005 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Card sx={{ mb: 3, boxShadow: 3 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: '#20c997' }}>
                        <DomainIcon />
                      </Avatar>
                    }
                    action={
                      <IconButton onClick={() => handleDomainClick(domain.id)}>
                        {expandedDomain === domain.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {domain.nom_domaine}
                      </Typography>
                    }
                    subheader={`${domain.postes.length} poste(s) disponible(s)`}
                  />
                  <Collapse in={expandedDomain === domain.id} timeout="auto" unmountOnExit>
                    <CardContent>
                      {domain.postes.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                          Aucun poste disponible dans ce domaine.
                        </Typography>
                      ) : (
                        <List disablePadding>
                          {domain.postes.map((poste) => (
                            <motion.div
                              key={poste.id}
                              whileHover={{ scale: 1.01 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                              <Paper elevation={2} sx={{ mb: 2 }}>
                                <Accordion
                                  expanded={expandedPoste === poste.id}
                                  onChange={() => handlePosteClick(poste.id)}
                                  sx={{
                                    '&:before': {
                                      display: 'none'
                                    }
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                      backgroundColor: expandedPoste === poste.id ? '#f0f8ff' : 'inherit'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                      <WorkIcon color="primary" sx={{ mr: 2 }} />
                                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                                        {poste.nom_poste}
                                      </Typography>
                                      <Chip
                                        label={`${poste.candidates.length} candidat(s)`}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                      />
                                    </Box>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {poste.competences.length > 0 && (
                                      <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                          Compétences requises:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                          {poste.competences.map((comp) => (
                                            <Chip
                                              key={comp.id}
                                              label={`${comp.competence_nom} (coeff. ${comp.coefficient})`}
                                              color="secondary"
                                              size="small"
                                              variant="outlined"
                                            />
                                          ))}
                                        </Box>
                                      </Box>
                                    )}

                                    {poste.candidates.length === 0 ? (
                                      <Typography variant="body2" color="textSecondary">
                                        Aucun candidat pour ce poste.
                                      </Typography>
                                    ) : (
                                      <TableContainer component={Paper} elevation={0}>
                                        <Table size={isMobile ? 'small' : 'medium'}>
                                          <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                              <TableCell sx={{ fontWeight: 'bold' }}>Candidat</TableCell>
                                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                Compétences
                                              </TableCell>
                                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                Moyenne
                                              </TableCell>
                                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                Statut
                                              </TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {poste.candidates.map((candidate, index) => (
                                              <TableRow
                                                key={candidate.id}
                                                hover
                                                sx={{
                                                  '&:nth-of-type(odd)': {
                                                    backgroundColor: '#fafafa'
                                                  }
                                                }}
                                              >
                                                <TableCell>
                                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon
                                                      color="primary"
                                                      sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.5rem' }}
                                                    />
                                                    <Box>
                                                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {candidate.prenom} {candidate.nom}
                                                      </Typography>
                                                      <Typography variant="caption" color="textSecondary">
                                                        {candidate.email}
                                                      </Typography>
                                                    </Box>
                                                    {index === 0 && candidate.moyenne > 0 && (
                                                      <EmojiEventsIcon
                                                        color="warning"
                                                        sx={{ ml: 1, fontSize: isMobile ? '1rem' : '1.5rem' }}
                                                      />
                                                    )}
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                  <Tooltip
                                                    title={
                                                      <Box>
                                                        {candidate.competences.map((comp) => (
                                                          <Typography key={comp.id}>
                                                            {comp.nom}: {comp.niveau}/10
                                                          </Typography>
                                                        ))}
                                                      </Box>
                                                    }
                                                    arrow
                                                  >
                                                    <Chip
                                                      label={`${candidate.competences.length} comp.`}
                                                      size="small"
                                                      color="info"
                                                      variant="outlined"
                                                    />
                                                  </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Box sx={{ mr: 1 }}>
                                                      {renderStars(candidate.moyenne)}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                      {candidate.moyenne.toFixed(1)}
                                                    </Typography>
                                                  </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                  <Chip
                                                    label={candidate.teste ? 'Testé' : 'Non testé'}
                                                    color={candidate.teste ? 'success' : 'default'}
                                                    size="small"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    )}
                                  </AccordionDetails>
                                </Accordion>
                              </Paper>
                            </motion.div>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Collapse>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default CandidateManagement2;