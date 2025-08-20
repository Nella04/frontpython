// import React from 'react';
// import { Button, CircularProgress, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
// import { Send, Check } from '@mui/icons-material';
// import axios from 'axios';
// import { useState } from 'react';

// const CandidatActionButton = ({ candidatId }) => {
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleAction = async () => {
//     setLoading(true);
//     try {
//       // Exemple d'appel API
//       const response = await axios.post('/api/candidat-action/', {
//         candidat_id: candidatId,
//         message: message
//       });
      
//       setSuccess(true);
//       setTimeout(() => {
//         setOpen(false);
//         setSuccess(false);
//       }, 1500);
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Tooltip title="tester le candidat">
//         <Button
//           variant="contained"
//           color="secondary"
//           size="small"
//           startIcon={<Send />}
//           onClick={() => setOpen(true)}
//           sx={{ mt: 1 }}
//         >
//           Tester
//         </Button>
//       </Tooltip>

//       <Dialog open={open} onClose={() => !loading && setOpen(false)}>
//         <DialogTitle>liste de poste choisit</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Message"
//             fullWidth
//             variant="outlined"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             disabled={loading || success}
//             sx={{ mt: 2 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)} disabled={loading}>
//             Annuler
//           </Button>
//           <Button
//             onClick={handleAction}
//             color="primary"
//             disabled={loading || success}
//             startIcon={
//               loading ? <CircularProgress size={20} /> : 
//               success ? <Check /> : <Send />
//             }
//           >
//             {success ? 'Réussi!' : 'Confirmer'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default CandidatActionButton;

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  CircularProgress, 
  Tooltip, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { Send, Check, Work, ArrowForward } from '@mui/icons-material';
import axios from 'axios';
import TestCandidatForm from './TestCandidatForm';

const CandidatActionButton = ({ candidatId }) => {
  const [loading, setLoading] = useState(false);
  const [loadingPostes, setLoadingPostes] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [postes, setPostes] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [step, setStep] = useState(1); // 1: Liste postes, 2: Formulaire

  // Charger les postes du candidat
  useEffect(() => {
    if (open && candidatId) {
      fetchPostesCandidat();
    }
  }, [open, candidatId]);

  const fetchPostesCandidat = async () => {
    setLoadingPostes(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`);
      const postesCandidat = response.data.filter(cp => cp.candidat_id == candidatId);
      setPostes(postesCandidat);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingPostes(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setSelectedPoste(null);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setSelectedPoste(null);
      setStep(1);
    }
  };

  const handleSelectPoste = (poste) => {
    setSelectedPoste(poste);
    setStep(2);
  };

  

  return (
    <>
      <Tooltip title="tester le candidat">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<Send />}
          onClick={handleOpen}
          sx={{ mt: 1 }}
        >
          Tester
        </Button>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        {step === 1 ? (
          <>
            <DialogTitle>Postes du candidat</DialogTitle>
            <DialogContent>
              {loadingPostes ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : postes.length === 0 ? (
                <Typography variant="body1" color="textSecondary" textAlign="center" py={2}>
                  Aucun poste associé à ce candidat
                </Typography>
              ) : (
                <List>
                  {postes.map((poste, index) => (
                    <React.Fragment key={poste.id}>
                      <ListItem 
                        button 
                        onClick={() => handleSelectPoste(poste)}
                        sx={{
                          '&:hover': { backgroundColor: 'action.hover' },
                          borderRadius: 1
                        }}
                      >
                        <ListItemText
                          primary={poste.poste_nom}
                          secondary={`Domaine: ${poste.domaine_nom}`}
                        />
                        <Chip 
                          label={poste.tester ? 'Déjà testé' : 'À tester'} 
                          color={poste.tester ? 'default' : 'primary'}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                        <ArrowForward sx={{ ml: 1 }} />
                      </ListItem>
                      {index < postes.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
          <TestCandidatForm 
            candidatId={candidatId}
            poste={selectedPoste}
            onClose={handleClose}
            onBack={() => setSelectedPoste(null)}
          />
          </>
        )}
      </Dialog>
    </>
  );
};

export default CandidatActionButton;