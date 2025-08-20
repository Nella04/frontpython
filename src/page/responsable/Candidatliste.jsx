import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Chip,
  Avatar,
  Collapse,
  Fade,
  Slide,
  Zoom,
  Tooltip,
  CircularProgress,
  Badge,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Search,
  ExpandMore,
  Work,
  Category,
  Star,
  Person,
  FilterList,
  Group,
  AssignmentInd
} from '@mui/icons-material';
import { styled } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';


// Couleurs personnalisées
const colors = {
  primary: '#007bff',
  secondary: '#20c997',
  background: '#F5F5F5'
};

// Styles personnalisés
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:before': {
    display: 'none'
  }
}));

const DomainHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: colors.primary,
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer'
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  marginRight: theme.spacing(1),
  backgroundColor: colors.secondary,
  color: 'white'
}));

export default function CandidatsList() {
  const [domaines, setDomaines] = useState([]);
  const [candidats, setCandidats] = useState([]);
  const [candidatPostes, setCandidatPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDomaines, setExpandedDomaines] = useState([]);
  const [expandedPostes, setExpandedPostes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [domainesRes, candidatsRes, candidatPostesRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`),
          fetch(`${process.env.REACT_APP_BACK_URL}/api/candidats/`),
          fetch(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/`)
        ]);
        
        setDomaines(await domainesRes.json());
        setCandidats(await candidatsRes.json());
        setCandidatPostes(await candidatPostesRes.json());
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les candidats
  const filteredCandidats = (posteId) => {
    return candidatPostes
      .filter(cp => cp.poste_id === String(posteId))
      .map(cp => candidats.find(c => c.id === Number(cp.candidat_id)))
      .filter(Boolean)
      .filter(c => 
        `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  // Gestion des accordéons
  const toggleDomaine = (domaineId) => {
    setExpandedDomaines(prev =>
      prev.includes(domaineId) ? prev.filter(id => id !== domaineId) : [...prev, domaineId]
    );
  };

  const togglePoste = (posteId) => {
    setExpandedPostes(prev =>
      prev.includes(posteId) ? prev.filter(id => id !== posteId) : [...prev, posteId]
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: colors.background, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: colors.primary,
          textAlign: 'center'
        }}>
          Gestion des Candidats
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Par domaine" icon={<Category />} />
          <Tab label="Tous les candidats" icon={<Group />} />
          <Tab label="Par compétence" icon={<Star />} />
        </Tabs>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher un candidat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Box>

      {activeTab === 0 && (
        <Box>
          {domaines.map((domaine) => (
            <StyledAccordion 
              key={domaine.id} 
              expanded={expandedDomaines.includes(domaine.id)}
              onChange={() => toggleDomaine(domaine.id)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" flex={1}>
                  <Category sx={{ mr: 2, color: colors.primary }} />
                  <Typography variant="h6">{domaine.nom_domaine}</Typography>
                  <Chip 
                    label={`${domaine.postes.length} poste(s)`} 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                {domaine.postes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucun poste dans ce domaine
                  </Typography>
                ) : (
                  <Box>
                    {domaine.postes.map((poste) => (
                      <StyledAccordion 
                        key={poste.id}
                        expanded={expandedPostes.includes(poste.id)}
                        onChange={() => togglePoste(poste.id)}
                        sx={{ mb: 2 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" flex={1}>
                            <Work sx={{ mr: 2, color: colors.secondary }} />
                            <Typography>{poste.nom_poste}</Typography>
                            <Badge
                              badgeContent={filteredCandidats(poste.id).length}
                              color="primary"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        </AccordionSummary>
                        
                        <AccordionDetails>
                          {filteredCandidats(poste.id).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              Aucun candidat pour ce poste
                            </Typography>
                          ) : (
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="center">Testé</TableCell>
                                    <TableCell>Compétences</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {filteredCandidats(poste.id).map((candidat) => (
                                    <TableRow key={candidat.id}>
                                      <TableCell>
                                        <Box display="flex" alignItems="center">
                                          <SmallAvatar>
                                            <Person fontSize="small" />
                                          </SmallAvatar>
                                          {candidat.prenom} {candidat.nom}
                                        </Box>
                                      </TableCell>
                                      <TableCell>{candidat.email}</TableCell>
                                      <TableCell align="center">
                                        <Chip 
                                          label={candidat.teste ? 'Oui' : 'Non'} 
                                          size="small"
                                          color={candidat.teste ? 'success' : 'default'}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {/* Ici vous pourriez ajouter les compétences du candidat */}
                                        <Chip label="React" size="small" sx={{ mr: 1 }} />
                                        <Chip label="JavaScript" size="small" />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </AccordionDetails>
                      </StyledAccordion>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentInd sx={{ mr: 1, color: colors.primary }} />
            Tous les candidats ({candidats.length})
          </Typography>
          
          <Grid container spacing={2}>
            {candidats
              .filter(c => 
                `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((candidat) => (
                <Grid item xs={12} sm={6} md={4} key={candidat.id}>
                  <Slide in={true}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ bgcolor: colors.secondary, mr: 2 }}>
                          {candidat.prenom.charAt(0)}{candidat.nom.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold">
                            {candidat.prenom} {candidat.nom}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidat.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Postes: {candidatPostes.filter(cp => cp.candidat_id === String(candidat.id)).length}
                        </Typography>
                        <Chip 
                          label={candidat.teste ? 'Test complété' : 'Test en attente'} 
                          size="small"
                          color={candidat.teste ? 'success' : 'warning'}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Paper>
                  </Slide>
                </Grid>
              ))}
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Vue par compétences (à implémenter)
          </Typography>
          <Typography color="text.secondary">
            Cette vue permettra de filtrer les candidats par compétences spécifiques
          </Typography>
        </Paper>
      )}
    </Container>
  );
}