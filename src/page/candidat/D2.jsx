import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Slider,
  Checkbox,
  TextField,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Collapse,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import axios from "axios";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DomaineExplorer = () => {
  const [domaines, setDomaines] = useState([]);
  const [filteredDomaines, setFilteredDomaines] = useState([]);
  const [selectedPostes, setSelectedPostes] = useState([]);

  const [searchDomaine, setSearchDomaine] = useState("");
  const [searchPoste, setSearchPoste] = useState("");
  const [searchCompetence, setSearchCompetence] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_URL}/api/domaines-details/`).then((res) => {
      setDomaines(res.data);
      setFilteredDomaines(res.data);
    });
  }, []);

  useEffect(() => {
    const lowerDomaine = searchDomaine.toLowerCase();
    const lowerPoste = searchPoste.toLowerCase();
    const lowerCompetence = searchCompetence.toLowerCase();

    const filtered = domaines.filter((d) => {
      const domaineMatch = d.nom_domaine.toLowerCase().includes(lowerDomaine);
      const postesMatch = d.postes.some((p) => {
        const posteMatch = p.nom_poste.toLowerCase().includes(lowerPoste);
        const competenceMatch = p.competences.some((c) =>
          c.competence_nom.toLowerCase().includes(lowerCompetence)
        );
        return posteMatch || competenceMatch;
      });
      return domaineMatch || postesMatch;
    });
    setFilteredDomaines(filtered);
  }, [searchDomaine, searchPoste, searchCompetence, domaines]);

  const handleCheckbox = (id) => {
    setSelectedPostes((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      console.log("Postes sélectionnés:", updated);
      return updated;
    });
  };

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#50C878">
        Explorer les Domaines & Postes
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Rechercher un domaine"
            value={searchDomaine}
            onChange={(e) => setSearchDomaine(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Rechercher un poste"
            value={searchPoste}
            onChange={(e) => setSearchPoste(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Rechercher une compétence"
            value={searchCompetence}
            onChange={(e) => setSearchCompetence(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredDomaines.map((domaine) => (
          <Grid item xs={12} key={domaine.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ backgroundColor: '#F5F5DC' }}>
                <CardHeader title={domaine.nom_domaine} sx={{ color: '#50C878', fontWeight: 'bold' }} />
                <CardContent>
                  <Grid container spacing={2}>
                    {domaine.postes.map((poste) => (
                      <Grid item xs={12} md={6} key={poste.id}>
                        <Card variant="outlined">
                          <CardHeader
                            title={poste.nom_poste}
                            action={
                              <Checkbox
                                checked={selectedPostes.includes(poste.id)}
                                onChange={() => handleCheckbox(poste.id)}
                                color="success"
                              />
                            }
                          />
                          <CardContent>
                            {poste.competences
                              .sort((a, b) => b.coefficient - a.coefficient)
                              .map((c) => (
                                <Box key={c.id} sx={{ mb: 2 }}>
                                  <Typography variant="body1" fontWeight="500">
                                    {c.competence_nom} ({c.coefficient})
                                  </Typography>
                                  <Slider
                                    value={c.coefficient * 10}
                                    max={100}
                                    disabled
                                    sx={{ color: '#50C878' }}
                                  />
                                </Box>
                              ))}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DomaineExplorer;
