import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Card, CardContent, Chip, Grid, LinearProgress, TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

const CompetenceDashboard = () => {
  const userLocalapi = JSON.parse(localStorage.getItem("userlocal"));
  const idcanlocal = userLocalapi?.idpersonnelocal;
  const [loading, setLoading] = useState(true);
  const [candidat, setCandidat] = useState(null);
  const [postes, setPostes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const candidatRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidats/${idcanlocal}/`);
        setCandidat(candidatRes.data);

        const postesRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-postes/?candidat_id=${idcanlocal}`);
        const postesData = postesRes.data;

        const postesDetails = await Promise.all(
          postesData.map(async (p) => {
            const poste = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/postes/${p.poste_id}/`);
            const comps = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/appartenances/?poste_id=${p.poste_id}`);
            return {
              ...poste.data,
              tester: p.tester,
              competences: comps.data,
            };
          })
        );
        setPostes(postesDetails);

        const compRes = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/candidat-competences/?candidat=${idcanlocal}`);
        const compDetails = await Promise.all(
          compRes.data.map(async (c) => {
            const comp = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/competences/${c.competence}/`);
            return {
              ...comp.data,
              niveau: c.niveau,
            };
          })
        );
        setCompetences(compDetails);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCompetences = competences.filter((c) =>
    c.nom_competence.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", p: 4, minHeight: "100vh" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Tableau de compétences
      </Typography>

      <Typography variant="h6" color="text.secondary">
        Candidat : {candidat?.nom} {candidat?.prenom} ({candidat?.email})
      </Typography>

      <TextField
        placeholder="Rechercher une compétence..."
        variant="outlined"
        fullWidth
        sx={{ my: 2 }}
        InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Typography variant="h5" color="secondary" sx={{ mt: 3, mb: 1 }}>
        🔹 Compétences générales
      </Typography>

      <Grid container spacing={2}>
        {filteredCompetences.map((comp, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {comp.nom_competence}
                  </Typography>
                  <Typography variant="body2">Niveau : {comp.niveau}/10</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={comp.niveau * 10}
                    sx={{ mt: 1, height: 8, borderRadius: 2 }}
                    color="success"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" color="secondary" sx={{ mt: 5, mb: 1 }}>
        🔸 Postes occupés et compétences associées
      </Typography>

      {postes.map((poste, i) => (
        <motion.div key={i} whileHover={{ scale: 1.02 }}>
          <Card sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                {poste.nom_poste}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Testé : {poste.tester ? "✅ Oui" : "❌ Non"}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {poste.competences.map((c, idx) => (
                  <Chip
                    key={idx}
                    label={`${c.nom_competence} (Coeff: ${c.coefficient})`}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default CompetenceDashboard;
