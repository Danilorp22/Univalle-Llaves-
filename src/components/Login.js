import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Google as GoogleIcon } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C70039',
    },
    secondary: {
      main: '#007bff',
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole] = useState('teacher'); // Por defecto seleccionamos rol de docente
  const navigate = useNavigate();

  const checkUserRole = async (user) => {
    if (role === 'admin') {
      // Verificar credenciales de administrador
      if (email === 'admin@gmail.com' && password === 'admin1234') {
        localStorage.setItem('userRole', 'admin');
        return true;
      }
      setError('Credenciales de administrador incorrectas');
      await auth.signOut();
      return false;
    } else {
      // Verificar si el usuario es un docente registrado
      const teachersRef = collection(db, 'teachers');
      const q = query(teachersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const teacherDoc = querySnapshot.docs[0];
        localStorage.setItem('userRole', 'teacher');
        localStorage.setItem('teacherId', teacherDoc.id);
        return true;
      }
      setError('No estás registrado como docente');
      await auth.signOut();
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const isValidRole = await checkUserRole(result.user);
      if (isValidRole) {
        navigate(role === 'admin' ? '/dashboard' : '/teacher-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isValidRole = await checkUserRole(result.user);
      if (isValidRole) {
        navigate(role === 'admin' ? '/dashboard' : '/teacher-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="login-container" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Iniciar Sesión
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={role}
            label="Rol"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="teacher">Docente</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
        </FormControl>

        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Iniciar Sesión con Google
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            ¿No tienes una cuenta? <Link to="/register-teacher" component="button" variant="body2">Regístrate como docente</Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
