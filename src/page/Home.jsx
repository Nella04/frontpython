import React, { useState, useEffect } from 'react';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  MenuItem,
  useScrollTrigger,
  Slide,
  Fade,
  Zoom,
  Grow,
  Avatar,
  IconButton,
  Divider,
  useTheme,
  styled
} from '@mui/material';
import {
  Menu,
  AccountCircle,
  Assessment,
  People,
  Work,
  Star,
  EmojiEvents,
  ArrowForward
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import sary from "./a.jpg";

// Couleurs personnalisées
const theme = {
  palette: {
    primary: {
      main: '#50C878', // Esmeralda
    },
    secondary: {
      main: '#F5F5DC', // Beige
    },
    background: {
      default: '#F5F5F5', // Off-white
    },
  },
};

// Animation personnalisée
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const FloatingBox = styled(Box)({
  animation: `${floatAnimation} 6s ease-in-out infinite`,
});

const HighlightText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const HomePage = () => {
    const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (event) => setAnchorEl(event.currentTarget);
    const closeMenu = () => setAnchorEl(null);
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setChecked(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* Contenu principal */}
      <Box component="main" sx={{ pt: 10 }}>
        {/* Hero Section */}
        <Box sx={{ 
          position: 'relative',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #F5F5F5 0%, #E0F7E0 100%)'
        }}>
          <Container maxWidth="xl">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Grow in={checked} timeout={800}>
                  <Box>
                    <Typography 
                      variant="h2" 
                      component="h1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        mb: 3
                      }}
                    >
                      Optimisez le <HighlightText>recrutement</HighlightText> par les compétences
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                      Une solution complète pour évaluer, suivre et développer les compétences de vos candidats et employés.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                      <Button 
                        variant="contained" 
                        size="large" 
                        endIcon={<ArrowForward />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: '50px',
                          fontWeight: 'bold'
                        }}
                      >
                        Démarrer
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          borderWidth: '2px',
                          '&:hover': {
                            borderWidth: '2px'
                          }
                        }}
                      >
                        En savoir plus
                      </Button>
                    </Box>
                  </Box>
                </Grow>
              </Grid>
              <Grid item xs={12} md={6}>
                <FloatingBox>
                  <Zoom in={checked} timeout={1000}>
                    <Box sx={{ position: 'relative' }}>
                      {/* <Box
                        component="img"
                        src="s"
                        alt="Aperçu de l'application"
                        sx={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '16px',
                          boxShadow: 6,
                          transform: 'rotate3d(0.5, 1, 0, 15deg)'
                        }}
                      /> */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '-30px',
                          right: '-30px',
                          width: '150px',
                          height: '150px',
                          background: 'radial-gradient(circle, rgba(80,200,120,0.4) 0%, rgba(80,200,120,0) 70%)',
                          borderRadius: '50%',
                          zIndex: -1
                        }}
                      />
                    </Box>
                  </Zoom>
                </FloatingBox>
              </Grid>
            </Grid>
          </Container>
          
          {/* Éléments décoratifs */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '-150px',
              left: '-150px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(80,200,120,0.2) 0%, rgba(80,200,120,0) 70%)',
              borderRadius: '50%',
              zIndex: 0
            }}
          />
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 10, backgroundColor: 'background.paper' }}>
          <Container maxWidth="xl">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Fade in={checked} timeout={1200}>
                <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Fonctionnalités <HighlightText>clés</HighlightText>
                </Typography>
              </Fade>
              <Fade in={checked} timeout={1500}>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                  Découvrez comment notre plateforme peut transformer votre processus de gestion des compétences
                </Typography>
              </Fade>
            </Box>
            
            <Grid container spacing={6}>
              {[
                {
                  icon: <People fontSize="large" />,
                  title: "Gestion des candidats",
                  description: "Suivez et évaluez les compétences de vos candidats tout au long du processus de recrutement."
                },
                {
                  icon: <Work fontSize="large" />,
                  title: "Définition des postes",
                  description: "Créez des profils de poste avec les compétences requises et leur importance relative."
                },
                {
                  icon: <Assessment fontSize="large" />,
                  title: "Évaluations complètes",
                  description: "Effectuez des tests standardisés et obtenez des résultats détaillés par compétence."
                },
                {
                  icon: <Star fontSize="large" />,
                  title: "Matching intelligent",
                  description: "Trouvez automatiquement les candidats les mieux adaptés à chaque poste."
                },
                {
                  icon: <EmojiEvents fontSize="large" />,
                  title: "Suivi des performances",
                  description: "Analysez l'évolution des compétences de vos employés après recrutement."
                },
                {
                  icon: <AccountCircle fontSize="large" />,
                  title: "Portail candidat",
                  description: "Permettez aux candidats de visualiser leurs compétences et résultats."
                }
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Grow in={checked} timeout={800 + (index * 200)}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: '16px',
                        boxShadow: 3,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            width: '80px',
                            height: '80px',
                            mx: 'auto',
                            mb: 3,
                            backgroundColor: 'primary.light',
                            color: 'primary.main'
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {feature.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: 10, background: 'linear-gradient(135deg, #50C878 0%, #3AAE5F 100%)', color: 'white' }}>
          <Container maxWidth="xl">
            <Grid container spacing={6} justifyContent="center" alignItems="center">
              {[
                { value: "95%", label: "Satisfaction clients" },
                { value: "10K+", label: "Candidats évalués" },
                { value: "500+", label: "Entreprises partenaires" },
                { value: "4.9/5", label: "Note moyenne" }
              ].map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Fade in={checked} timeout={1000 + (index * 300)}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 10 }}>
          <Container maxWidth="md">
            <Box sx={{ 
              backgroundColor: 'primary.light',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(80,200,120,0.1) 0%, rgba(80,200,120,0.2) 100%)'
            }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                Prêt à transformer votre <HighlightText>recrutement</HighlightText> ?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
                Commencez dès aujourd'hui et découvrez comment notre solution peut optimiser votre processus.
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                endIcon={<ArrowForward />}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Essai gratuit
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, backgroundColor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  Skill<HighlightText>Metrics</HighlightText>
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                La solution ultime pour la gestion et l'évaluation des compétences dans le processus de recrutement.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Produit
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Fonctionnalités', 'Tarifs', 'API', 'Intégrations'].map((item) => (
                  <li key={item}>
                    <Button sx={{ color: 'text.secondary' }}>{item}</Button>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Ressources
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Documentation', 'Guides', 'Blog', 'FAQ'].map((item) => (
                  <li key={item}>
                    <Button sx={{ color: 'text.secondary' }}>{item}</Button>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Entreprise
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['À propos', 'Carrières', 'Contact', 'Partenaires'].map((item) => (
                  <li key={item}>
                    <Button sx={{ color: 'text.secondary' }}>{item}</Button>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Légal
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {['Confidentialité', 'Conditions', 'Politique', 'Cookies'].map((item) => (
                  <li key={item}>
                    <Button sx={{ color: 'text.secondary' }}>{item}</Button>
                  </li>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} SkillMetrics. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;