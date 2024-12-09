import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const RegisterTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = formData;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, 'teachers'), {
        name,
        email,
        phone,
        userId: userCredential.user.uid
      });
      navigate('/login');
    } catch (error) {
      setError('Error al registrar el docente: ' + error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>Registro de Docente</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Nombre"
          name="name"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Correo Electrónico"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <TextField
          label="Número de Teléfono"
          name="phone"
          variant="outlined"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">Registrar</Button>
      </form>
    </Box>
  );
};

export default RegisterTeacher;
