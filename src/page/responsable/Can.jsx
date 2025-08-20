import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Container, List, ListItem, ListItemText, Paper, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';

// Configuration axios
axios.defaults.baseURL = process.env.REACT_APP_BACK_URL;

function Can() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestion des Candidats
          </Typography>
          
          <Routes>
            <Route path="/candidat" element={<DomainesList />} />
            <Route path="/domaine/:domaineId" element={<PostesList />} />
            <Route path="/poste/:posteId" element={<CandidatsList />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default Can;
function DomainesList() {
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const response = await axios.get('/api/domaines/');
        setDomaines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching domaines:', error);
        setLoading(false);
      }
    };

    fetchDomaines();
  }, []);

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Domaines disponibles
      </Typography>
      <List>
        {domaines.map((domaine) => (
          <ListItem 
            key={domaine.id} 
            button 
            component={Link} 
            to={`/domaine/${domaine.id}`}
          >
            <ListItemText primary={domaine.nom_domaine} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
function PostesList() {
  const { domaineId } = useParams();
  const [domaineDetails, setDomaineDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomaineDetails = async () => {
      try {
        const response = await axios.get(`/api/domaines-details/${domaineId}/`);
        setDomaineDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching domaine details:', error);
        setLoading(false);
      }
    };

    fetchDomaineDetails();
  }, [domaineId]);

  if (loading) return <Typography>Chargement...</Typography>;
  if (!domaineDetails) return <Typography>Domaine non trouvé</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Postes dans le domaine: {domaineDetails.nom_domaine}
      </Typography>
      <List>
        {domaineDetails.postes.map((poste) => (
          <ListItem 
            key={poste.id} 
            button 
            component={Link} 
            to={`/poste/${poste.id}`}
          >
            <ListItemText 
              primary={poste.nom_poste} 
              secondary={`${poste.competences.length} compétences requises`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

function CandidatsList() {
  const { posteId } = useParams();
  const [candidatsPoste, setCandidatsPoste] = useState([]);
  const [posteDetails, setPosteDetails] = useState(null);
  const [competencesPoste, setCompetencesPoste] = useState([]);
  const [candidatsCompetences, setCandidatsCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [filteredCandidats, setFilteredCandidats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les candidats pour ce poste
        const candidatsResponse = await axios.get(`/api/candidat-postes/?poste_id=${posteId}`);
        setCandidatsPoste(candidatsResponse.data);

        // Récupérer les détails du poste et ses compétences
        const appartenancesResponse = await axios.get(`/api/appartenances/?poste_nom=${candidatsResponse.data[0]?.poste_nom}`);
        setCompetencesPoste(appartenancesResponse.data);

        // Récupérer toutes les compétences des candidats
        const candidatIds = candidatsResponse.data.map(c => c.candidat_id);
        const competencesResponse = await axios.get('/api/candidat-competences/');
        const filteredCompetences = competencesResponse.data.filter(cc => 
          candidatIds.includes(cc.candidat)
        );
        setCandidatsCompetences(filteredCompetences);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [posteId]);

  // Calcul des moyennes pour chaque candidat
  const calculateMoyennes = () => {
    return candidatsPoste.map(candidat => {
      // Compétences du candidat pour ce poste
      const competences = candidatsCompetences.filter(cc => cc.candidat === parseInt(candidat.candidat_id));
      
      // Calcul de la moyenne générale
      let sumCoeff = 0;
      let sumNiveauCoeff = 0;
      
      competences.forEach(cc => {
        const competencePoste = competencesPoste.find(cp => cp.id_comp === cc.competence);
        if (competencePoste) {
          sumNiveauCoeff += cc.niveau * competencePoste.coefficient;
          sumCoeff += competencePoste.coefficient;
        }
      });
      
      const moyenneGenerale = sumCoeff > 0 ? (sumNiveauCoeff / sumCoeff).toFixed(2) : 0;
      
      // Calcul de la moyenne filtrée (si des compétences sont sélectionnées)
      let moyenneFiltree = null;
      if (selectedCompetences.length > 0) {
        let sumNiveau = 0;
        let count = 0;
        
        selectedCompetences.forEach(compId => {
          const cc = competences.find(c => c.competence === compId);
          if (cc) {
            sumNiveau += cc.niveau;
            count++;
          }
        });
        
        moyenneFiltree = count > 0 ? (sumNiveau / count).toFixed(2) : 0;
      }
      
      return {
        ...candidat,
        moyenneGenerale,
        moyenneFiltree,
        competences
      };
    });
  };

  // Mise à jour des candidats filtrés
  useEffect(() => {
    if (candidatsPoste.length > 0 && candidatsCompetences.length > 0) {
      const candidatsAvecMoyennes = calculateMoyennes();
      
      // Filtrer si des compétences sont sélectionnées
      if (selectedCompetences.length > 0) {
        const filtered = candidatsAvecMoyennes.filter(c => c.moyenneFiltree > 0);
        setFilteredCandidats(filtered);
      } else {
        setFilteredCandidats(candidatsAvecMoyennes);
      }
    }
  }, [candidatsPoste, candidatsCompetences, selectedCompetences]);

  const handleCompetenceToggle = (competenceId) => {
    setSelectedCompetences(prev => 
      prev.includes(competenceId)
        ? prev.filter(id => id !== competenceId)
        : [...prev, competenceId]
    );
  };

  if (loading) return <Typography>Chargement...</Typography>;
  if (candidatsPoste.length === 0) return <Typography>Aucun candidat pour ce poste</Typography>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Candidats pour le poste: {candidatsPoste[0]?.poste_nom}
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Filtres par compétences
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {competencesPoste.map(competence => (
            <FormControlLabel
              key={competence.id_comp}
              control={
                <Checkbox
                  checked={selectedCompetences.includes(competence.id_comp)}
                  onChange={() => handleCompetenceToggle(competence.id_comp)}
                />
              }
              label={`${competence.competence_nom} (coeff: ${competence.coefficient})`}
            />
          ))}
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <List>
          {filteredCandidats
            .sort((a, b) => b.moyenneGenerale - a.moyenneGenerale)
            .map(candidat => (
              <ListItem key={candidat.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    {candidat.candidat_prenom} {candidat.candidat_nom}
                  </Typography>
                  <Typography>
                    Moyenne: <strong>{candidat.moyenneGenerale}</strong>
                    {selectedCompetences.length > 0 && (
                      <span> (Filtrée: <strong>{candidat.moyenneFiltree}</strong>)</span>
                    )}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Email: {candidat.email}
                </Typography>
                
                <Box sx={{ mt: 1, width: '100%' }}>
                  <Typography variant="subtitle2">Compétences:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {candidat.competences.map(cc => {
                      const competence = competencesPoste.find(c => c.id_comp === cc.competence);
                      return competence ? (
                        <Paper key={cc.id} sx={{ p: 1 }}>
                          {competence.competence_nom}: {cc.niveau}/10 
                          (coeff: {competence.coefficient})
                        </Paper>
                      ) : null;
                    })}
                  </Box>
                </Box>
              </ListItem>
            ))}
        </List>
      </Paper>
    </Box>
  );
}