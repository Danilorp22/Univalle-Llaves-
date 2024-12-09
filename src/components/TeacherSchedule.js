import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const TeacherSchedule = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const timeSlots = [
    '07:45 - 09:15',
    '09:30 - 11:00',
    '11:15 - 12:45',
    '13:45 - 15:15',
    '15:30 - 17:00',
    '17:15 - 18:45',
    '19:00 - 20:30',
    '20:45 - 22:15'
  ];
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'classrooms'), (snapshot) => {
      const classroomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClassrooms(classroomsData);
      if (classroomsData.length > 0 && !selectedClassroom) {
        setSelectedClassroom(classroomsData[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mi Horario
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar Aula</InputLabel>
        <Select
          value={selectedClassroom}
          label="Seleccionar Aula"
          onChange={handleClassroomChange}
        >
          {classrooms.map((classroom) => (
            <MenuItem key={classroom.id} value={classroom.id}>
              {classroom.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Horario</TableCell>
              {daysOfWeek.map((day) => (
                <TableCell key={day} align="center">{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot) => (
              <TableRow key={timeSlot}>
                <TableCell component="th" scope="row">
                  {timeSlot}
                </TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={`${timeSlot}-${day}`} align="center">
                    -
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherSchedule;
