import React from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      localStorage.removeItem('teacherId');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const adminMenuItems = [
    { text: 'Aulas', path: '/dashboard' },
    { text: 'Registrar Aula', path: '/register' },
    { text: 'Horarios', path: '/schedule' },
    { text: 'Docentes', path: '/teachers' },
  ];

  const teacherMenuItems = [
    { text: 'Mi Dashboard', path: '/teacher-dashboard' },
    { text: 'Mi Horario', path: '/schedule' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : teacherMenuItems;

  return (
    <AppBar position="static" color="primary" sx={{ boxShadow: 3 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenu}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Llaves Univalle
        </Typography>
        
        {auth.currentUser && (
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Cerrar Sesión
          </Button>
        )}
        
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {menuItems.map((item) => (
            <MenuItem 
              key={item.path} 
              onClick={handleClose} 
              component={Link} 
              to={item.path}
            >
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
