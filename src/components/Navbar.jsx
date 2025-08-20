import React, { useState , useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  useScrollTrigger,
  styled,
  Box
} from '@mui/material';
import {
  Assessment,
  MoreVert
} from '@mui/icons-material';

const HighlightText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Slide direction="down" in={!scrolled}>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: scrolled ? 'rgba(80, 200, 120, 0.9)' : 'primary.main',
          boxShadow: scrolled ? 1 : 0,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 1, fontSize: '2rem' }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Skill<HighlightText>Metrics</HighlightText>
              </Typography>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button color="inherit" sx={{ fontWeight: 'bold' }}>Accueil</Button>
              <Button color="inherit">À propos</Button>
              <Button color="inherit">Vue d'ensemble</Button>
              <Button color="inherit">Candidats</Button>
              <Button color="inherit">Postes</Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                onClick={openMenu} 
                aria-label="menu"
                sx={{ ml: 2 }}
              >
                <MoreVert />
              </IconButton>
              <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={closeMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  onClick={() => {
                    closeMenu();
                    navigate("/candidat/connexion");
                  }}
                >
                  Connexion candidat
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    closeMenu();
                    navigate("/responsable/connexion");
                  }}
                >
                  Connexion responsable
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default Navbar;