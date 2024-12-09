import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { QRCodeCanvas } from 'qrcode.react';

const Dashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchTeacherName = async (teacherId) => {
    if (!teacherId) return null;
    const teacherDoc = await getDoc(doc(db, 'teachers', teacherId));
    return teacherDoc.exists() ? teacherDoc.data().name : null;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'classrooms'), async (snapshot) => {
      const classroomsData = await Promise.all(snapshot.docs.map(async doc => {
        const data = doc.data();
        const teacherName = await fetchTeacherName(data.teacherId);
        return { id: doc.id, ...data, teacherName };
      }));
      setClassrooms(classroomsData);
    });

    return () => unsubscribe();
  }, []);

  const filteredClassrooms = classrooms.filter(classroom => {
    if (filter === 'all') return true;
    return filter === 'free' ? classroom.status === 'free' : classroom.status === 'occupied';
  });

  const generateQrData = (classroom) => {
    return JSON.stringify({
      classroomId: classroom.id,
      action: 'occupy'
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard de Aulas</Typography>
      <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 2 }}>
        <InputLabel>Filtro</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filtro"
        >
          <MenuItem value="all">Todas las aulas</MenuItem>
          <MenuItem value="free">Aulas libres</MenuItem>
          <MenuItem value="occupied">Aulas ocupadas</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={2}>
        {filteredClassrooms.map(classroom => (
          <Grid item xs={12} sm={6} md={4} key={classroom.id}>
            <Card sx={{ 
              boxShadow: 3,
              bgcolor: classroom.status === 'occupied' ? '#ffebee' : '#e8f5e9'
            }}>
              <CardContent>
                <Typography variant="h6">{classroom.name}</Typography>
                <Typography>Capacidad: {classroom.capacity}</Typography>
                <Typography sx={{ 
                  color: classroom.status === 'occupied' ? '#d32f2f' : '#2e7d32',
                  fontWeight: 'bold'
                }}>
                  Estado: {classroom.status === 'occupied' ? 'Ocupada' : 'Libre'}
                </Typography>
                {classroom.status === 'occupied' && (
                  <>
                    <Typography sx={{ mt: 1 }}>
                      <strong>Docente:</strong> {classroom.teacherName || 'No disponible'}
                    </Typography>
                    <Typography>
                      <strong>Ocupada desde:</strong> {classroom.occupiedAt ? new Date(classroom.occupiedAt).toLocaleString() : 'No disponible'}
                    </Typography>
                  </>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <QRCodeCanvas 
                    value={JSON.stringify({
                      action: 'occupy',
                      classroomId: classroom.id
                    })}
                    size={128}
                    level="H"
                  />
                </Box>
                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1 }}>
                  Código QR para {classroom.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
