import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Fade,
  Slide,
  Zoom,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Collapse,
  styled,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Login,
  CheckCircle
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Animation personnalisée
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const FloatingBox = styled(Box)({
  animation: `${floatAnimation} 4s ease-in-out infinite`,
});

const HighlightText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Afficher l'alerte de succès si l'utilisateur vient de s'inscrire
  useEffect(() => {
    if (location.state?.fromSignup) {
      setShowSuccessAlert(true);
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name] || serverError) {
      setErrors(prev => ({ ...prev, [name]: '' }));
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setServerError('');
    
    try {
      
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/login-candidat/`, {
        email: formData.email,
        password: formData.password
      });
      console.log(response.data);
      setLoginSuccess(true);
      setTimeout(() => {
        // Stocker les infos de l'utilisateur et rediriger
      const userDatalocal = {
      idpersonnelocal: response.data.id,
      emaillocal: response.data.email,
      rolelocal: "candidat"
    };
    localStorage.setItem("userlocal", JSON.stringify(userDatalocal));
    navigate("/candidat/Domaine");
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur de connexion';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // À implémenter plus tard
    console.log('Google login clicked');
  };

  const handleFacebookLogin = () => {
    // À implémenter plus tard
    console.log('Facebook login clicked');
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
            <FloatingBox>
              <Login sx={{ 
                fontSize: '4rem', 
                color: 'primary.main',
                mb: 1
              }} />
            </FloatingBox>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Connexion <HighlightText>Candidat</HighlightText>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Accédez à votre espace personnel
            </Typography>
          </Box>
        </Slide>

        <Collapse in={showSuccessAlert}>
          <Alert 
            icon={<CheckCircle fontSize="inherit" />}
            severity="success"
            sx={{ mb: 3 }}
          >
            Inscription réussie ! Vous pouvez maintenant vous connecter.
          </Alert>
        </Collapse>

        <Collapse in={!!serverError}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        </Collapse>

        <Fade in={!loginSuccess} timeout={800}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '16px',
              backgroundColor: 'background.paper',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #50C878 0%, #F5F5DC 100%)'
              }
            }}
          >
            <form onSubmit={handleSubmit}>
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
                sx={{ mb: 3 }}
                InputProps={{
                  autoComplete: 'email'
                }}
              />

              <TextField
                fullWidth
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                sx={{ mb: 1 }}
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
                  ),
                  autoComplete: 'current-password'
                }}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                mb: 3
              }}>
                <Button 
                  component={Link}
                  to="/mot-de-passe-oublie"
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.8rem'
                  }}
                >
                  Mot de passe oublié ?
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'none'
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Se connecter'
                )}
              </Button>
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
                  onClick={handleGoogleLogin}
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
                  onClick={handleFacebookLogin}
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
                Pas encore de compte?{' '}
                <Button 
                  component={Link} 
                  to="/candidat/login" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Inscrivez-vous
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Fade>

        <Collapse in={loginSuccess}>
          <Alert
            icon={<CheckCircle fontSize="inherit" />}
            severity="success"
            sx={{ mt: 3 }}
          >
            Connexion réussie ! Redirection en cours...
          </Alert>
        </Collapse>

        <Zoom in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              En vous connectant, vous acceptez nos{' '}
              <Button 
                size="small" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                Conditions d'utilisation
              </Button>
            </Typography>
          </Box>
        </Zoom>
      </Container>
    </Box>
  );
};

export default LoginPage;