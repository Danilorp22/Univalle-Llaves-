import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { QRCodeCanvas } from 'qrcode.react';

const RegisterClassroom = () => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('free');
  const [docRef, setDocRef] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const generateQrCode = (classroomId) => {
    return JSON.stringify({ classroomId, action: 'occupy' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'classrooms'), {
        name,
        capacity,
        status
      });
      const qrCodeValue = generateQrCode(docRef.id);
      await updateDoc(docRef, { qrCode: qrCodeValue });
      setAlert({ type: 'success', message: `Aula '${name}' registrada con éxito con QR` });
      setSnackbarOpen(true);
      setName('');
      setCapacity('');
      setStatus('free');
      setDocRef(docRef);
    } catch (error) {
      console.error('Error registrando el aula: ', error);
      setAlert({ type: 'error', message: 'Error registrando el aula' });
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Registrar Aula</Typography>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={alert.message}
        action={
          <Button color="inherit" size="small" onClick={() => setSnackbarOpen(false)}>
            Cerrar
          </Button>
        }
      />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Nombre del Aula"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Capacidad"
          variant="outlined"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <FormControl variant="outlined">
          <InputLabel>Estado</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Estado"
          >
            <MenuItem value="free">Libre</MenuItem>
            <MenuItem value="occupied">Ocupada</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">Registrar Aula</Button>
        {docRef && docRef.id && (
          <QRCodeCanvas value={generateQrCode(docRef.id)} size={128} sx={{ mt: 2 }} />
        )}
      </form>
    </Box>
  );
};

export default RegisterClassroom;
