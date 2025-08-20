// const handleSubmit = async () => {
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     // 1. Vérifier et mettre à jour les booléens tester
  //     await axios.patch(`${process.env.REACT_APP_BACK_URL}/api/candidats/${candidatId}/`, {
  //       teste: true
  //     });
      
  //     await axios.patch(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/${poste.id}/`, {
  //       tester: true
  //     });

      
  //     // 2. Créer un nouveau test
  //     const testResponse = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/tests/`, {
  //       candidat: candidatId,
  //       responsable: IdLocal, // ity zany le local
  //       date_test: new Date().toISOString()
  //     });
      
  //     const testId = testResponse.data.id;
      
  //     // 3. Mettre à jour ou créer les compétences du candidat et les résultats
  //     const promises = competences.map(async (comp) => {
  //       // Mettre à jour ou créer candidat_competence
  //       await axios.post(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/`, {
  //         candidat: candidatId,
  //         competence: comp.id_comp,
  //         niveau: niveaux[comp.id_comp]
  //       });
        
  //       // Créer résultat_test
  //       await axios.post(`${process.env.REACT_APP_BACK_URL}/api/resultats/`, {
  //         test: testId,
  //         competence: comp.id_comp,
  //         niveau_evalue: niveaux[comp.id_comp]
  //       });
  //     });
      
  //     await Promise.all(promises);
      
  //     setSuccess(true);
  //     setTimeout(() => {
  //       onClose();
  //     }, 2000);
  //   } catch (err) {
  //     setError('Erreur lors de la sauvegarde des résultats');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Chip,
  Slider,
  Divider,
  Avatar,
  Fade,
  Zoom,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import {
  Check,
  Send,
  ArrowBack,
  Star,
  EmojiEvents,
  Psychology,
  Grading,
  DoneAll
} from '@mui/icons-material';
import axios from 'axios';
import CheckResp from './session/Checkresp';

const TestCandidatForm = ({ candidatId, poste, onClose, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [loadingCompetences, setLoadingCompetences] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [competences, setCompetences] = useState([]);
  const [niveaux, setNiveaux] = useState({});
  const [error, setError] = useState(null);

  
        const [IdLocal, setIdLocal] = useState(); 
        useEffect(() => {
        const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
        const idcanlocal = userLocalapi?.idpersonnelocal;
        setIdLocal(idcanlocal);
        }, []);

  // Charger les compétences du poste
  useEffect(() => {
    const fetchCompetences = async () => {
      setLoadingCompetences(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/appartenances/`);
        // console.log(`a:`,response.data);
        // console.log(`poste:`, poste);
        const competencesPoste = response.data.filter(c => c.poste_nom === poste.poste_nom);
        setCompetences(competencesPoste);
        
        // Initialiser les niveaux à 0
        const initialNiveaux = {};
        competencesPoste.forEach(comp => {
          initialNiveaux[comp.id_comp] = 0;
        });
        setNiveaux(initialNiveaux);
      } catch (err) {
        setError('Erreur lors du chargement des compétences');
      } finally {
        setLoadingCompetences(false);
      }
    };
    
    fetchCompetences();
  }, [poste.poste_nom]);

  const handleNiveauChange = (competenceId, newValue) => {
    setNiveaux(prev => ({
      ...prev,
      [competenceId]: newValue
    }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Vérifier et mettre à jour les booléens tester
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/api/candidats/${candidatId}/`, {
        teste: true
      });
      
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/${poste.id}/`, {
        tester: true
      });

      
      // 2. Créer un nouveau test
      const testResponse = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/tests/`, {
        candidat: candidatId,
        responsable: IdLocal,
        date_test: new Date().toISOString()
      });
      
      const testId = testResponse.data.id;
      
      // 3. Mettre à jour ou créer les compétences du candidat et les résultats
      const promises = competences.map(async (comp) => {
        try {
          // Vérifier si la compétence existe déjà pour ce candidat
          const existingCompResponse = await axios.get(
            `${process.env.REACT_APP_BACK_URL}/api/candidat-competences/`
          );
          console.log('1')
          console.log(existingCompResponse.data);

          const existingCompsprems = existingCompResponse.data;

          const existingComps = existingCompsprems.find(
            item => item.candidat === candidatId && item.competence === comp.id_comp
          );
          
          if (existingComps ) {
            // Mettre à jour la compétence existante
            // console.log('2');
            // const existingComp = existingComps[0];
            // console.log('ffff',existingComps);
            await axios.patch(
              `${process.env.REACT_APP_BACK_URL}/api/candidat-competences/${existingComps.id}/`,
              {
                niveau: niveaux[comp.id_comp]
              }
            );
          } else {
            // Créer une nouvelle compétence
            console.log('3');
            await axios.post(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/`, {
              candidat: candidatId,
              competence: comp.id_comp,
              niveau: niveaux[comp.id_comp]
            });
          }
          
          // Créer résultat_test (toujours nouveau)
          await axios.post(`${process.env.REACT_APP_BACK_URL}/api/resultats/`, {
            test: testId,
            competence: comp.id_comp,
            niveau_evalue: niveaux[comp.id_comp]
          });
        } catch (err) {
          console.error(`Erreur avec la compétence ${comp.id_comp}:`, err);
          throw err;
        }
      });
      
      await Promise.all(promises);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des résultats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
    if (!poste) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="error">Aucune information sur le poste disponible</Typography>
        <Button onClick={onBack} startIcon={<ArrowBack />}>
          Retour
        </Button>
      </Box>
    );
  }

  return (
    <Fade in={true}>
      <Box>
        <DialogTitle sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Grading color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Box flexGrow={1}>
              <Typography variant="h6" component="div">
                Évaluation pour {poste.poste_nom}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {poste.domaine_nom} • ID: {poste.poste_id}
              </Typography>
            </Box>
            <Chip 
              avatar={<Avatar>{candidatId}</Avatar>}
              label={`${poste.candidat_prenom} ${poste.candidat_nom}`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </DialogTitle>

        <CheckResp/>
        
        <DialogContent dividers sx={{ backgroundColor: '#F5F5F5' }}>
          <Collapse in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>
          
          {loadingCompetences ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {competences.map((competence) => (
                <Grid item xs={12} md={6} key={competence.id}>
                  <Zoom in={true}>
                    <Card sx={{ 
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Psychology color="secondary" sx={{ mr: 1 }} />
                          <Typography variant="h6" color="primary">
                            {competence.competence_nom}
                          </Typography>
                          <Chip 
                            label={`Coeff: ${competence.coefficient}`}
                            size="small"
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                        
                        <Box px={2}>
                          <Slider
                            value={niveaux[competence.id_comp] || 0}
                            onChange={(_, val) => handleNiveauChange(competence.id_comp, val)}
                            min={0}
                            max={10}
                            step={1}
                            marks={[
                              { value: 0, label: '0' },
                              { value: 5, label: '5' },
                              { value: 10, label: '10' }
                            ]}
                            valueLabelDisplay="auto"
                            color="secondary"
                          />
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography variant="caption" color="textSecondary">
                            Débutant
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Expert
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box mt={4}>
            <TextField
              fullWidth
              label="Commentaires & observations"
              variant="outlined"
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Psychology color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={onClose} 
            startIcon={<ArrowBack />}
            color="primary"
            disabled={loading}
          >
            Retour
          </Button>
          
          <Box display="flex" alignItems="center" gap={2}>
            {success && (
              <Fade in={success}>
                <Box display="flex" alignItems="center">
                  <DoneAll color="success" sx={{ mr: 1 }} />
                  <Typography color="success.main">
                    Évaluation enregistrée!
                  </Typography>
                </Box>
              </Fade>
            )}
            
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
              disabled={loading || success}
              startIcon={
                loading ? <CircularProgress size={20} /> : 
                success ? <Check /> : <EmojiEvents />
              }
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Enregistrement...' : 
               success ? 'Réussi!' : 'Valider'}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Fade>
  );
};

export default TestCandidatForm;