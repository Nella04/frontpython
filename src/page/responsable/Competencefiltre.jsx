import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
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
  CircularProgress,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Domain as DomainIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  EmojiEvents as EmojiEventsIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import axios from 'axios';

const CompetenceFilterView = () => {
  const [domains, setDomains] = useState([]);
  const [selectedCompetences, setSelectedCompetences] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [expandedPoste, setExpandedPoste] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [domainsRes, candidatesRes, competencesRes, candidatCompetencesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/`),
          axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/`)
        ]);

        // Process candidates with their competences
        const processedCandidates = candidatesRes.data.map(candidate => {
          const competences = candidatCompetencesRes.data
            .filter(cc => cc.candidat === candidate.id)
            .map(cc => {
              const competence = competencesRes.data.find(c => c.id === cc.competence);
              return {
                id: competence.id,
                nom: competence.nom_competence,
                niveau: cc.niveau
              };
            });

          return {
            ...candidate,
            competences
          };
        });

        setDomains(domainsRes.data);
        setCandidates(processedCandidates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCompetences.length === 0) {
      setFilteredCandidates([]);
      return;
    }

    const filtered = candidates.map(candidate => {
      // Filter only selected competences that the candidate has
      const matchedCompetences = candidate.competences.filter(comp => 
        selectedCompetences.some(sc => sc.id === comp.id)
      );

      if (matchedCompetences.length === 0) return null;

      // Calculate average for selected competences
      const moyenne = matchedCompetences.reduce((sum, comp) => sum + comp.niveau, 0) / matchedCompetences.length;

      return {
        ...candidate,
        matchedCompetences,
        moyenne: parseFloat(moyenne.toFixed(2))
      };
    }).filter(Boolean).sort((a, b) => b.moyenne - a.moyenne);

    setFilteredCandidates(filtered);
  }, [selectedCompetences, candidates]);

  const handleCompetenceToggle = (competence) => {
    setSelectedCompetences(prev => {
      const exists = prev.some(c => c.id === competence.id_comp);
      if (exists) {
        return prev.filter(c => c.id !== competence.id_comp);
      } else {
        return [...prev, {
          id: competence.id_comp,
          nom: competence.competence_nom,
          poste: competence.poste_nom
        }];
      }
    });
  };

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#007bff', mb: 4 }}>
          Recherche de Candidats par Compétences
        </Typography>
        {/* Selected competences chips */}
        {selectedCompetences.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Compétences sélectionnées:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedCompetences.map((competence) => (
                <motion.div
                  key={competence.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={`${competence.nom} (${competence.poste})`}
                    color="secondary"
                    onDelete={() =>
                      setSelectedCompetences(prev => prev.filter(c => c.id !== competence.id))
                    }
                    sx={{ mb: 1 }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Left panel - Competence hierarchy */}
          <Grid item xs={12} md={5} lg={4}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: '#20c997' }}>
                    <FilterListIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Filtres par Compétences
                  </Typography>
                }
                subheader={`${selectedCompetences.length} compétence(s) sélectionnée(s)`}
              />
              <Divider />
              <CardContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {domains.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    Aucun domaine disponible.
                  </Typography>
                ) : (
                  <List disablePadding>
                    {domains.map((domain) => (
                      <motion.div
                        key={domain.id}
                        whileHover={{ scale: 1.005 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <Accordion
                          expanded={expandedDomain === domain.id}
                          onChange={() => handleDomainClick(domain.id)}
                          sx={{
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            mb: 1
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DomainIcon color="primary" sx={{ mr: 2 }} />
                              <Typography sx={{ fontWeight: 'bold' }}>{domain.nom_domaine}</Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, pl: 4 }}>
                            {domain.postes.length === 0 ? (
                              <Typography variant="body2" color="textSecondary">
                                Aucun poste dans ce domaine.
                              </Typography>
                            ) : (
                              <List disablePadding>
                                {domain.postes.map((poste) => (
                                  <Accordion
                                    key={poste.id}
                                    expanded={expandedPoste === poste.id}
                                    onChange={() => handlePosteClick(poste.id)}
                                    sx={{
                                      '&:before': { display: 'none' },
                                      boxShadow: 'none',
                                      border: '1px solid rgba(0, 0, 0, 0.08)',
                                      mb: 1
                                    }}
                                  >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WorkIcon color="primary" sx={{ mr: 2, fontSize: '1rem' }} />
                                        <Typography sx={{ fontSize: '0.9rem' }}>{poste.nom_poste}</Typography>
                                      </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0, pl: 4 }}>
                                      {poste.competences.length === 0 ? (
                                        <Typography variant="body2" color="textSecondary">
                                          Aucune compétence requise pour ce poste.
                                        </Typography>
                                      ) : (
                                        <List disablePadding>
                                          {poste.competences.map((competence) => (
                                            <ListItem
                                              key={competence.id}
                                              dense
                                              button
                                              sx={{
                                                '&:hover': { backgroundColor: 'rgba(32, 201, 151, 0.08)' }
                                              }}
                                            >
                                              <Checkbox
                                                edge="start"
                                                checked={selectedCompetences.some(c => c.id === competence.id_comp)}
                                                onChange={() => handleCompetenceToggle(competence)}
                                                color="secondary"
                                                size="small"
                                              />
                                              <ListItemText
                                                primary={competence.competence_nom}
                                                secondary={`Coeff. ${competence.coefficient}`}
                                              />
                                              <ListItemSecondaryAction>
                                                <Chip
                                                  label={`${competence.coefficient}`}
                                                  size="small"
                                                  color="primary"
                                                  variant="outlined"
                                                />
                                              </ListItemSecondaryAction>
                                            </ListItem>
                                          ))}
                                        </List>
                                      )}
                                    </AccordionDetails>
                                  </Accordion>
                                ))}
                              </List>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </motion.div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right panel - Candidates list */}
          <Grid item xs={12} md={7} lg={8}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardHeader
                avatar={
                  <Badge badgeContent={filteredCandidates.length} color="secondary">
                    <Avatar sx={{ bgcolor: '#007bff' }}>
                      <PersonIcon />
                    </Avatar>
                  </Badge>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Candidats Correspondants
                  </Typography>
                }
                subheader={
                  selectedCompetences.length > 0
                    ? `Triés par moyenne (${selectedCompetences.map(c => c.nom).join(', ')})`
                    : 'Sélectionnez des compétences pour filtrer les candidats'
                }
              />
              <Divider />
              <CardContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {selectedCompetences.length === 0 ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="200px"
                  >
                    <FilterListIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Sélectionnez des compétences pour afficher les candidats
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Choisissez dans la liste à gauche les compétences requises
                    </Typography>
                  </Box>
                ) : filteredCandidates.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    Aucun candidat ne correspond aux compétences sélectionnées.
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
                            Détails
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredCandidates.map((candidate, index) => (
                          <TableRow
                            key={candidate.id}
                            hover
                            sx={{
                              '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                              ...(index === 0 && {
                                borderLeft: '4px solid #20c997',
                                backgroundColor: 'rgba(32, 201, 151, 0.05)'
                              })
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {index === 0 && (
                                  <Tooltip title="Meilleur candidat">
                                    <EmojiEventsIcon
                                      color="warning"
                                      sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.5rem' }}
                                    />
                                  </Tooltip>
                                )}
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {candidate.prenom} {candidate.nom}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {candidate.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip
                                title={
                                  <Box>
                                    {candidate.matchedCompetences.map((comp) => (
                                      <Typography key={comp.id}>
                                        {comp.nom}: {comp.niveau}/10
                                      </Typography>
                                    ))}
                                  </Box>
                                }
                                arrow
                              >
                                <Chip
                                  label={`${candidate.matchedCompetences.length}/${selectedCompetences.length}`}
                                  size="small"
                                  color={
                                    candidate.matchedCompetences.length === selectedCompetences.length
                                      ? 'success'
                                      : 'info'
                                  }
                                  variant="outlined"
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ mr: 1 }}>{renderStars(candidate.moyenne)}</Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {candidate.moyenne.toFixed(1)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small" color="primary">
                                <PersonIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </motion.div>
    </Container>
  );
};

export default CompetenceFilterView;