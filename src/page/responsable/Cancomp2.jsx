import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  TextField,
  Avatar,
  LinearProgress,
  Collapse,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Person,
  Work,
  Category,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styles personnalisés
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  height: 'calc(100vh - 100px)',
  overflow: 'auto',
}));

const CandidateCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 123, 255, 0.2)',
  },
}));

const CompetenceSelection = ({ domaines, selectedCompetences, onCompetenceToggle, searchTerm }) => {
  const [expandedDomains, setExpandedDomains] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

  const toggleDomain = (domainId) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId]
    }));
  };

  const togglePost = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Filtrage des compétences basé sur le terme de recherche
  const filteredDomaines = domaines.map(domaine => {
    const filteredPosts = domaine.postes.map(poste => {
      if (!poste.competences) return poste;
      
      const filteredCompetences = poste.competences.filter(competence =>
        competence.competence_nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        ...poste,
        competences: filteredCompetences
      };
    }).filter(poste => 
      poste.competences && poste.competences.length > 0 || 
      poste.nom_poste.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      ...domaine,
      postes: filteredPosts
    };
  }).filter(domaine => 
    domaine.postes.length > 0 || 
    domaine.nom_domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <List>
      {filteredDomaines.map((domaine) => (
        <React.Fragment key={domaine.id}>
          <ListItem 
            button 
            onClick={() => toggleDomain(domaine.id)}
            sx={{ 
              bgcolor: expandedDomains[domaine.id] ? 'rgba(0, 123, 255, 0.1)' : 'inherit',
              borderRadius: '8px',
              mb: 1
            }}
          >
            <ListItemIcon>
              <Category color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {domaine.nom_domaine}
                </Typography>
              } 
            />
            {expandedDomains[domaine.id] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          
          <Collapse in={expandedDomains[domaine.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {domaine.postes.map((poste) => (
                <React.Fragment key={poste.id}>
                  <ListItem 
                    button 
                    onClick={() => togglePost(poste.id)}
                    sx={{ 
                      pl: 4,
                      bgcolor: expandedPosts[poste.id] ? 'rgba(32, 201, 151, 0.1)' : 'inherit',
                      borderRadius: '8px',
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      <Work color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" fontWeight="medium">
                          {poste.nom_poste}
                        </Typography>
                      } 
                    />
                    {poste.competences && poste.competences.length > 0 && 
                      (expandedPosts[poste.id] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItem>
                  
                  <Collapse in={expandedPosts[poste.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {poste.competences && poste.competences.map((competence) => (
                        <ListItem 
                          key={competence.id_comp} 
                          sx={{ pl: 8 }}
                          secondaryAction={
                            <Checkbox
                              edge="end"
                              checked={selectedCompetences.includes(competence.id_comp)}
                              onChange={() => onCompetenceToggle(competence.id_comp)}
                            />
                          }
                        >
                          <ListItemText 
                            primary={competence.competence_nom} 
                            secondary={`Coeff: ${competence.coefficient}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Collapse>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}
    </List>
  );
};

const CandidateList = ({ candidates, selectedCompetences, competencesData, isLoading }) => {
  // Calcul de la moyenne pour chaque candidat
  const calculateAverage = (candidate) => {
    if (selectedCompetences.length === 0) return 0;
    
    let sum = 0;
    let count = 0;
    
    selectedCompetences.forEach(compId => {
      const competence = competencesData.find(c => c.id === compId);
      if (competence) {
        const candidateCompetence = candidate.competences?.find(cc => cc.competence === compId);
        sum += candidateCompetence ? candidateCompetence.niveau : 0;
        count++;
      }
    });
    
    return count > 0 ? (sum / count).toFixed(2) : 0;
  };

  // Tri des candidats par moyenne décroissante
  const sortedCandidates = [...candidates].map(candidate => ({
    ...candidate,
    average: calculateAverage(candidate)
  })).sort((a, b) => b.average - a.average);

  return (
    <Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {selectedCompetences.length > 0 
              ? `${sortedCandidates.length} Candidats trouvés` 
              : "Sélectionnez des compétences pour voir les candidats"}
          </Typography>
          
          {selectedCompetences.length > 0 && (
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Compétences sélectionnées: {selectedCompetences.length}
            </Typography>
          )}
          
          {sortedCandidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CandidateCard elevation={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} md={2}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#007bff' }}>
                      <Person />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm={9} md={10}>
                    <Typography variant="h6">
                      {candidate.prenom} {candidate.nom}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {candidate.email}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <Star color="primary" fontSize="small" />
                      <Typography variant="body1" ml={1} fontWeight="medium">
                        Moyenne: {candidate.average}/10
                      </Typography>
                    </Box>
                    
                    <LinearProgress 
                      variant="determinate" 
                      value={candidate.average * 10} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 2,
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#007bff'
                        }
                      }} 
                    />
                    
                    {selectedCompetences.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Détails des compétences:
                        </Typography>
                        {selectedCompetences.map(compId => {
                          const competence = competencesData.find(c => c.id === compId);
                          const candidateComp = candidate.competences?.find(cc => cc.competence === compId);
                          const niveau = candidateComp ? candidateComp.niveau : 0;
                          
                          return (
                            <Box key={compId} mb={1}>
                              <Typography variant="body2">
                                {competence?.nom_competence || 'Compétence inconnue'}: {niveau}/10
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={niveau * 10} 
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(32, 201, 151, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#20c997'
                                  }
                                }} 
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CandidateCard>
            </motion.div>
          ))}
        </>
      )}
    </Box>
  );
};

const CompetenceCandidatesView = () => {
  const [domaines, setDomaines] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [candidateCompetences, setCandidateCompetences] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Chargement des domaines avec hiérarchie complète
        const domainesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`);
        const domainesData = await domainesResponse.json();
        setDomaines(domainesData);
        
        // Chargement des candidats
        const candidatesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/candidats/`);
        const candidatesData = await candidatesResponse.json();
        
        // Chargement des compétences
        const competencesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/competences/`);
        const competencesData = await competencesResponse.json();
        setCompetences(competencesData);
        
        // Chargement des compétences des candidats
        const candidateCompetencesResponse = await fetch(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/`);
        const candidateCompetencesData = await candidateCompetencesResponse.json();
        setCandidateCompetences(candidateCompetencesData);
        
        // Fusion des données des candidats avec leurs compétences
        const enrichedCandidates = candidatesData.map(candidate => ({
          ...candidate,
          competences: candidateCompetencesData.filter(cc => cc.candidat === candidate.id)
        }));
        
        setCandidates(enrichedCandidates);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCompetenceToggle = (competenceId) => {
    setSelectedCompetences(prev =>
      prev.includes(competenceId)
        ? prev.filter(id => id !== competenceId)
        : [...prev, competenceId]
    );
  };

  return (
    <Box sx={{ 
      backgroundColor: '#F5F5F5',
      minHeight: '100vh',
      p: isMobile ? 1 : 3
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        color: '#007bff',
        fontWeight: 'bold',
        mb: 3,
        textAlign: 'center'
      }}>
        Gestion des Compétences et Candidats
      </Typography>
      
      <Grid container spacing={2}>
        {/* Partie gauche - Sélection des compétences */}
        <Grid item xs={12} md={5} lg={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ 
              color: '#007bff',
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}>
              <Search sx={{ mr: 1 }} />
              Recherche de Compétences
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher une compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Search color="primary" sx={{ mr: 1 }} />
              }}
            />
            
            <Typography variant="subtitle1" gutterBottom sx={{ 
              fontWeight: 'medium',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Category color="primary" sx={{ mr: 1 }} />
              Hiérarchie des Compétences
            </Typography>
            
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
              </Box>
            ) : (
              <CompetenceSelection
                domaines={domaines}
                selectedCompetences={selectedCompetences}
                onCompetenceToggle={handleCompetenceToggle}
                searchTerm={searchTerm}
              />
            )}
          </StyledPaper>
        </Grid>
        
        {/* Partie droite - Liste des candidats */}
        <Grid item xs={12} md={7} lg={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ 
              color: '#007bff',
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}>
              <Person sx={{ mr: 1 }} />
              Résultats des Candidats
            </Typography>
            
            <CandidateList
              candidates={candidates}
              selectedCompetences={selectedCompetences}
              competencesData={competences}
              isLoading={isLoading}
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompetenceCandidatesView;