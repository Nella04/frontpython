

//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // 1. Récupérer les infos du candidat
//         const candidatResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${idcanlocal}/`);
//         setCandidat(candidatResponse.data);
        
//         // 2. Récupérer tous les données nécessaires en parallèle
//         const [
//           postesResponse, 
//           allAppartenancesResponse,
//           competencesResponse,
//           allCompetencesResponse
//         ] = await Promise.all([
//           axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/?candidat_id=${idcanlocal}`),
//           axios.get(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`),
//           axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${idcanlocal}`),
//           axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`)
//         ]);

//         const postesData = postesResponse.data;
//         const allAppartenances = allAppartenancesResponse.data;
//         const competencesCandidat = competencesResponse.data;
//         const allCompetences = allCompetencesResponse.data;

//         // 3. Créer un map des compétences pour accès rapide
//         const competencesMap = allCompetences.reduce((acc, comp) => {
//           acc[comp.id_competence] = comp;
//           return acc;
//         }, {});

//         // 4. Préparer les postes avec leurs compétences
//         const postesDetails = await Promise.all(
//           postesData.map(async (poste) => {
//             // Filtrer les appartenances pour ce poste
//             const appartenancesPoste = allAppartenances.filter(
//               app => app.poste_nom === poste.poste_nom
//             );

//             // Préparer les compétences avec niveau
//             const competencesWithNiveau = appartenancesPoste.map(app => {
//               const competenceCandidat = competencesCandidat.find(
//                 cc => cc.competence === app.id_comp
//               );
              
//               return {
//                 ...app,
//                 ...competencesMap[app.id_comp],
//                 niveau: competenceCandidat ? competenceCandidat.niveau : 0
//               };
//             });

//             // Récupérer les détails du poste
//             const posteDetail = await axios.get(
//               `${process.env.REACT_APP_BACK_URL}/api/postes/${poste.poste_id}/`
//             );

//             return {
//               ...poste,
//               ...posteDetail.data,
//               competences: competencesWithNiveau
//             };
//           })
//         );

//         setPostes(postesDetails);
        
//         // 5. Préparer toutes les compétences du candidat
//         const competencesDetails = competencesCandidat.map(comp => ({
//           ...comp,
//           ...competencesMap[comp.competence]
//         }));

//         setCompetences(competencesDetails);
        
        
//       } catch (error) {
//         console.error("Erreur lors de la récupération des données:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (idcanlocal) {
//       fetchData();
//     }
//   }, [idcanlocal]);












//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // 1. Récupérer les infos du candidat
//         const candidatResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${idcanlocal}/`);
//         setCandidat(candidatResponse.data);
        
//         // 2. Récupérer les postes du candidat
//         const postesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/?candidat_id=${idcanlocal}`);
//         const postesData = postesResponse.data;
        
//         // Récupérer les détails complets de chaque poste
//         const postesDetails = await Promise.all(
//           postesData.map(async (poste) => {
//             const posteDetail = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/postes/${poste.poste_id}/`);
//             const competencesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/appartenances/?id_poste=${poste.poste_id}`);
            
//             // Pour chaque compétence du poste, récupérer le niveau du candidat
//             const competencesWithNiveau = await Promise.all(
//               competencesResponse.data.map(async (comp) => {
//                 try {
//                   const niveauResponse = await axios.get(
//                     `${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${idcanlocal}&competence=${comp.competence}`
//                   );
//                   return {
//                     ...comp,
//                     niveau: niveauResponse.data.length > 0 ? niveauResponse.data[0].niveau : 0
//                   };
//                 } catch (error) {
//                   return {
//                     ...comp,
//                     niveau: 0
//                   };
//                 }
//               })
//             );
            
//             return {
//               ...poste,
//               ...posteDetail.data,
//               competences: competencesWithNiveau
//             };
//           })
//         );
        
//         setPostes(postesDetails);
        
//         // 3. Récupérer toutes les compétences du candidat
//         const competencesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${idcanlocal}`);
//         const competencesData = competencesResponse.data;
        
//         // Récupérer les détails complets de chaque compétence
//         const competencesDetails = await Promise.all(
//           competencesData.map(async (comp) => {
//             const competenceDetail = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/${comp.competence}/`);
//             return {
//               ...comp,
//               ...competenceDetail.data
//             };
//           })
//         );
        
//         setCompetences(competencesDetails);
        
//       } catch (error) {
//         console.error("Erreur lors de la récupération des données:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (idcanlocal) {
//       fetchData();
//     }
//   }, [idcanlocal]);


//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // 1. Récupérer les infos du candidat
//         const candidatResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${idcanlocal}/`);
//         setCandidat(candidatResponse.data);
        
//         // 2. Récupérer les postes du candidat
//         const postesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/?candidat_id=${idcanlocal}`);
//         const postesData = postesResponse.data;
        
//         // 3. Récupérer les compétences du candidat
//         const competencesResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${idcanlocal}`);
//         const competencesCandidat = competencesResponse.data;
        
//         // 4. Pour chaque poste du candidat, récupérer les compétences requises et leur niveau
//         const postesDetails = await Promise.all(
//           postesData.map(async (poste) => {
//             // Récupérer les compétences requises pour ce poste
//             const competencesPosteResponse = await axios.get(
//               `${process.env.REACT_APP_BACK_URL}/api/appartenances/?id_poste=${poste.poste_id}`
//             );
//             //console.log(postesData);
//             console.log(competencesPosteResponse);
            
//             // Pour chaque compétence requise, trouver le niveau du candidat
//             const competencesWithNiveau = await Promise.all(
//               competencesPosteResponse.data.map(async (compPoste) => {
//                 // Trouver la compétence du candidat correspondante
//                 const competenceCandidat = competencesCandidat.find(
//                   cc => cc.competence === compPoste.id_comp
//                 );
                
//                 // Récupérer les détails de la compétence
//                 const competenceDetail = await axios.get(
//                   `${process.env.REACT_APP_BACK_URL}/api/competences/${compPoste.id_comp}/`
//                 );
                
//                 return {
//                   ...compPoste,
//                   ...competenceDetail.data,
//                   niveau: competenceCandidat ? competenceCandidat.niveau : 0,
//                   coefficient: compPoste.coefficient
//                 };
//               })
//             );
            
//             // Récupérer les détails du poste
//             const posteDetail = await axios.get(
//               `${process.env.REACT_APP_BACK_URL}/api/postes/${poste.poste_id}/`
//             );
            
//             return {
//               ...poste,
//               ...posteDetail.data,
//               competences: competencesWithNiveau
//             };
//           })
//         );
        
//         setPostes(postesDetails);
        
//         // 5. Préparer la liste de toutes les compétences du candidat pour l'onglet "Toutes les compétences"
//         const competencesDetails = await Promise.all(
//           competencesCandidat.map(async (comp) => {
//             const competenceDetail = await axios.get(
//               `${process.env.REACT_APP_BACK_URL}/api/competences/${comp.competence}/`
//             );
//             return {
//               ...comp,
//               ...competenceDetail.data
//             };
//           })
//         );
        
//         setCompetences(competencesDetails);
        
//       } catch (error) {
//         console.error("Erreur lors de la récupération des données:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (idcanlocal) {
//       fetchData();
//     }
//   }, [idcanlocal]);




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  Grow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Work as WorkIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Person as PersonIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Animation personnalisée
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    animation: `${pulse} 2s infinite`
  }
}));

const CompetenceVisualisation = () => {
  const [candidat, setCandidat] = useState(null);
  const [postes, setPostes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Récupérer l'ID du candidat depuis localStorage
  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const idcanlocal = userLocalapi?.idpersonnelocal;




useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Récupérer les infos du candidat
      const candidatResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${idcanlocal}/`);
      setCandidat(candidatResponse.data);
      // console.log('m',candidatResponse);
      
      // 2. Récupérer tous les données nécessaires en parallèle
      const [
        postesResponse, 
        allAppartenancesResponse,
        competencesResponse,
        allCompetencesResponse
      ] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/?candidat_id=${idcanlocal}`),
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`),
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${idcanlocal}`),
        axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`)
      ]);

//         const candidatTests = testsData.filter(test => test.candidat === id_candidat);
      const postesDatap = postesResponse.data;
      //  console.log('ggrrrrr',postesDatap);
      const postesData =postesDatap.filter(p=>p.candidat_id==idcanlocal);
      
      const allAppartenances = allAppartenancesResponse.data;
      const competencesCandidatp = competencesResponse.data;
      console.log('lol',competencesCandidatp);
      const competencesCandidat = competencesCandidatp.filter(c=>c.candidat==idcanlocal)
      const allCompetences = allCompetencesResponse.data;

      // 3. Créer un map des compétences pour accès rapide
      const competencesMap = allCompetences.reduce((acc, comp) => {
        acc[comp.id] = comp.nom_competence; // On ne stocke que le nom de la compétence
        return acc;
      }, {});

      // 4. Préparer les postes avec leurs compétences
      const postesDetails = await Promise.all(
        postesData.map(async (poste) => {
          // Filtrer les appartenances pour ce poste
          const appartenancesPoste = allAppartenances.filter(
            app => app.poste_nom === poste.poste_nom
          );

          // Préparer les compétences avec niveau
          const competencesWithNiveau = appartenancesPoste.map(app => {
            const competenceCandidat = competencesCandidat.find(
              cc => cc.competence === app.id_comp
            );
            
            return {
              ...app,
              nom_competence: competencesMap[app.id_comp], // Ajout du nom de la compétence
              niveau: competenceCandidat ? competenceCandidat.niveau : 0
            };
          });

          // Récupérer les détails du poste
          const posteDetail = await axios.get(
            `${process.env.REACT_APP_BACK_URL}/api/postes/${poste.poste_id}/`
          );

          return {
            ...poste,
            ...posteDetail.data,
            competences: competencesWithNiveau
          };
        })
      );

      setPostes(postesDetails);
      
      // 5. Préparer toutes les compétences du candidat
      const competencesDetails = competencesCandidat.map(comp => ({
        ...comp,
        nom_competence: competencesMap[comp.competence] // Ajout du nom de la compétence amle recherche moa zany
      }));

      //console.log("CompetencesDetails:", competencesDetails);
      setCompetences(competencesDetails);
      
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

const competencesen=competences.filter(comp=>comp.candidat===idcanlocal);

  const filteredCompetences = competencesen.filter(comp =>
    comp.nom_competence.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // console.log('v',filteredCompetences);

//   const filteredCompetences = competences;
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
      <Fade in={true} timeout={800}>
        <Box>
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {candidat?.prenom} {candidat?.nom}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Profil de compétences
              </Typography>
            </Box>
          </Box>

          <Paper sx={{ mb: 4, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Par Poste" icon={<WorkIcon />} />
              <Tab label="Toutes les Compétences" icon={<EmojiEventsIcon />} />
            </Tabs>
          </Paper>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher une compétence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {activeTab === 0 ? (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Mes Postes et Compétences Associées
              </Typography>
              
              {postes.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Aucun poste associé à votre profil.
                </Typography>
              ) : (
                <Grid container spacing={4}>
                  {postes.map((poste, index) => (
                    <Grow in={true} timeout={index * 200} key={poste.id_poste}>
                      <Grid item xs={12} md={6}>
                        <AnimatedCard>
                          <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                              <WorkIcon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="h6" component="h2">
                                {poste.nom_poste}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                              Compétences requises pour ce poste et votre niveau:
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            {poste.competences.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                Aucune compétence définie pour ce poste.
                              </Typography>
                            ) : (
                              <Box>
                                {poste.competences.map((competence) => (

                                  <Box key={competence.id_comp} mb={2}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                    <Typography variant="subtitle1">
                                        {competence.competence_nom}
                                        <Chip 
                                        label={`Coeff: ${competence.coefficient}`} 
                                        size="small" 
                                        color="secondary" 
                                        sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Chip
                                        label={`${competence.niveau}/10`}
                                        color={
                                        competence.niveau >= 8 ? 'success' : 
                                        competence.niveau >= 5 ? 'primary' : 'error'
                                        }
                                        size="small"
                                    />
                                    </Box>
                                    <LinearProgress
                                      variant="determinate"
                                      value={competence.niveau * 10}
                                      sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        '& .MuiLinearProgress-bar': {
                                          backgroundColor: 
                                            competence.niveau >= 8 ? '#20c997' : 
                                            competence.niveau >= 5 ? '#007bff' : '#f44336'
                                        }
                                      }}
                                    />
                                    <Box display="flex" justifyContent="center" mt={0.5}>
                                      {renderStars(competence.niveau)}
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </CardContent>
                        </AnimatedCard>
                      </Grid>
                    </Grow>
                  ))}
                </Grid>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Toutes mes Compétences
              </Typography>
              
              {filteredCompetences.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  {searchTerm ? 'Aucune compétence ne correspond à votre recherche.' : 'Aucune compétence enregistrée.'}
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {filteredCompetences.map((competence, index) => (
                    <Slide direction="up" in={true} timeout={index * 100} key={competence.id_competence}>
                      <Grid item xs={12} sm={6} md={4}>
                        <AnimatedCard>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {competence.nom_competence}
         
                            </Typography>
                            
                            <Box display="flex" alignItems="center" mb={1}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                Niveau:
                              </Typography>
                              <Chip
                                label={`${competence.niveau}/10`}
                                color={
                                  competence.niveau >= 8 ? 'success' : 
                                  competence.niveau >= 5 ? 'primary' : 'error'
                                }
                              />
                            </Box>
                            
                            <LinearProgress
                              variant="determinate"
                              value={competence.niveau * 10}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                mb: 1,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 
                                    competence.niveau >= 8 ? '#20c997' : 
                                    competence.niveau >= 5 ? '#007bff' : '#f44336'
                                }
                              }}
                            />
                            
                            <Box display="flex" justifyContent="center">
                              {renderStars(competence.niveau)}
                            </Box>
                          </CardContent>
                        </AnimatedCard>
                      </Grid>
                    </Slide>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default CompetenceVisualisation;