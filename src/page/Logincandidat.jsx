import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Fade,
  Slide,
  Zoom,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Collapse,
  styled
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  CheckCircleOutline
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';

// Animation personnalisée
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AnimatedPaper = styled(Paper)({
  animation: `${pulseAnimation} 6s ease-in-out infinite`,
});

const HighlightText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motdepasse: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    //si erreur 400 de mail mitovy zay
    // preno tsy obligatire 
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.motdepasse) {
      newErrors.motdepasse = 'Le mot de passe est requis';
    } else if (formData.motdepasse.length < 8) {
      newErrors.motdepasse = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (formData.motdepasse !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/candidats/`, {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motdepasse: formData.motdepasse,
        teste: false
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/candidat/connexion');
      }, 2000);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleGoogleSignup = () => {
    // À implémenter plus tard
    console.log('Google signup clicked');
  };

  const handleFacebookSignup = () => {
    // À implémenter plus tard
    console.log('Facebook signup clicked');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        backgroundImage: 'linear-gradient(135deg, rgba(80, 200, 120, 0.05) 0%, rgba(245, 245, 220, 0.1) 100%)',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Slide direction="down" in={true} timeout={500}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/"
              startIcon={<ArrowBack />}
              sx={{ 
                position: 'absolute',
                left: { xs: 20, sm: 40 },
                top: 20,
                color: 'text.secondary'
              }}
            >
              Accueil
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Rejoignez <HighlightText>SkillMetrics</HighlightText>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Créez votre compte candidat en quelques secondes
            </Typography>
          </Box>
        </Slide>

        <Collapse in={!!serverError}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        </Collapse>

        <Collapse in={submitSuccess}>
          <Alert 
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="success"
            sx={{ mb: 3 }}
          >
            Inscription réussie ! Redirection en cours...
          </Alert>
        </Collapse>

        <Fade in={!submitSuccess} timeout={800}>
          <AnimatedPaper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '16px',
              backgroundColor: 'background.paper'
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    error={!!errors.nom}
                    helperText={errors.nom}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    error={!!errors.prenom}
                    helperText={errors.prenom}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mot de passe"
                    name="motdepasse"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.motdepasse}
                    onChange={handleChange}
                    error={!!errors.motdepasse}
                    helperText={errors.motdepasse}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{
                      py: 1.5,
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textTransform: 'none'
                    }}
                  >
                    S'inscrire
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OU
              </Typography>
            </Divider>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={handleGoogleSignup}
                  sx={{
                    py: 1.5,
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px'
                    }
                  }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={handleFacebookSignup}
                  sx={{
                    py: 1.5,
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px'
                    }
                  }}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Vous avez déjà un compte?{' '}
                <Button 
                  component={Link} 
                  to="/candidat/connexion" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Connectez-vous
                </Button>
              </Typography>
            </Box>
          </AnimatedPaper>
        </Fade>

        <Zoom in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              En vous inscrivant, vous acceptez nos{' '}
              <Button 
                size="small" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                Conditions d'utilisation
              </Button>{' '}
              et notre{' '}
              <Button 
                size="small" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                Politique de confidentialité
              </Button>
            </Typography>
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
};

export default SignupPage;