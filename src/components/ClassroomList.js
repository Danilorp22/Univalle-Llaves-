import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

const ClassroomList = () => {
  const { currentUser } = useAuth();
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const querySnapshot = await getDocs(collection(db, 'classrooms'));
      const classroomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClassrooms(classroomsData);
    };
    fetchClassrooms();
  }, []);

  const handleOccupyClassroom = async (classroomId) => {
    try {
      const teacherId = localStorage.getItem('teacherId');
      const classroomRef = doc(db, 'classrooms', classroomId);
      await updateDoc(classroomRef, { status: 'occupied', teacherId });
      // Refetch classrooms to update the UI
      const querySnapshot = await getDocs(collection(db, 'classrooms'));
      const classroomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClassrooms(classroomsData);
    } catch (error) {
      console.error('Error al ocupar el aula:', error);
    }
  };

  // Filtrar solo aulas libres
  const filteredClassrooms = classrooms.filter(classroom => classroom.status === 'free');

  return (
    <Box>
      <Grid container spacing={2}>
        {filteredClassrooms.map((classroom) => (
          <Grid item xs={12} sm={6} md={4} key={classroom.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {classroom.name}
                </Typography>
                <Typography color="textSecondary">
                  Capacidad: {classroom.capacity}
                </Typography>
                <Typography color="textSecondary">
                  Estado: {classroom.status === 'free' ? 'Libre' : 'Ocupada'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <QRCodeCanvas value={JSON.stringify({ classroomId: classroom.id, action: 'occupy' })} />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleOccupyClassroom(classroom.id)}
                >
                  Ocupar Aula
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClassroomList;
