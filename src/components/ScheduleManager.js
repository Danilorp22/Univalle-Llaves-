import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert 
} from '@mui/material';
import { collection, getDocs, doc, updateDoc, getDoc, writeBatch, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as XLSX from 'xlsx';

const ScheduleManager = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ startTime: '', endTime: '', subject: '', day: 'Lunes' });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [viewSchedule, setViewSchedule] = useState(false);
  const [previewSchedules, setPreviewSchedules] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const querySnapshot = await getDocs(collection(db, 'classrooms'));
      const classroomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClassrooms(classroomsData);
      if (classroomsData.length > 0) {
        setSelectedClassroom(classroomsData[0]);
        setSchedules(classroomsData[0].schedules || []);
      }
    };
    fetchClassrooms();
  }, []);

  const handleOpen = () => {
    if (!selectedClassroom) {
      setAlert({ type: 'error', message: 'Por favor, selecciona un aula antes de añadir un horario.' });
      return;
    }
    setOpen(true);
    setViewSchedule(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateSchedule = (schedule) => {
    if (!schedule.startTime || !schedule.endTime || !schedule.subject) {
      setAlert({ type: 'error', message: 'Todos los campos son obligatorios.' });
      return false;
    }
    const start = new Date(`1970-01-01T${schedule.startTime}:00`);
    const end = new Date(`1970-01-01T${schedule.endTime}:00`);
    if (start >= end) {
      setAlert({ type: 'error', message: 'La hora de inicio debe ser anterior a la hora de fin.' });
      return false;
    }
    return true;
  };

  const handleAddSchedule = () => {
    if (validateSchedule(newSchedule)) {
      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      setNewSchedule({ startTime: '', endTime: '', subject: '', day: newSchedule.day });
      setAlert({ type: 'success', message: 'Horario añadido exitosamente.' });
    }
  };

  const handleSaveSchedule = async () => {
    if (selectedClassroom) {
      const existingSchedules = selectedClassroom.schedules || [];
      const mergedSchedules = [...existingSchedules, ...schedules, ...previewSchedules];
      const batch = writeBatch(db);

      // Split schedules into smaller chunks
      const chunkSize = 500; // Adjust size as needed
      for (let i = 0; i < mergedSchedules.length; i += chunkSize) {
        const chunk = mergedSchedules.slice(i, i + chunkSize);
        const docRef = doc(collection(db, 'classroomSchedules'));
        batch.set(docRef, { schedules: chunk, classroomId: selectedClassroom.id });
      }

      await batch.commit();
      setSchedules(mergedSchedules);
      setPreviewSchedules([]);
      setAlert({ type: 'success', message: 'Horario guardado exitosamente.' });
    }
  };

  const handleViewSchedule = async () => {
    if (selectedClassroom) {
      const schedulesQuery = query(collection(db, 'classroomSchedules'), where('classroomId', '==', selectedClassroom.id));
      const querySnapshot = await getDocs(schedulesQuery);
      const allSchedules = querySnapshot.docs.flatMap(doc => doc.data().schedules);
      setSchedules(allSchedules);
      setOpen(true);
      setViewSchedule(true);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setAlert({ type: 'error', message: 'No se seleccionó ningún archivo.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: true });
      const updatedSchedules = jsonData.slice(1).map(row => ({
        startTime: row[0] ? row[0].split(' - ')[0] : '',
        endTime: row[0] ? row[0].split(' - ')[1] : '',
        lunes: row[1] || '',
        martes: row[2] || '',
        miercoles: row[3] || '',
        jueves: row[4] || '',
        viernes: row[5] || '',
        sabado: row[6] || ''
      }));
      setPreviewSchedules(updatedSchedules);
      setAlert({ type: 'info', message: 'Vista previa del horario cargado. Por favor, verifica antes de guardar.' });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClassroomChange = (e) => {
    const classroom = classrooms.find(c => c.id === e.target.value);
    setSelectedClassroom(classroom);
    setSchedules(classroom?.schedules || []);
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Gestión de Horarios</Typography>
      {alert.message && (
        <Alert severity={alert.type} onClose={() => setAlert({ type: '', message: '' })}>
          {alert.message}
        </Alert>
      )}

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Aula</InputLabel>
        <Select
          value={selectedClassroom ? selectedClassroom.id : ''}
          onChange={handleClassroomChange}
          label="Aula"
        >
          {classrooms.map(classroom => (
            <MenuItem key={classroom.id} value={classroom.id}>{classroom.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <input
        accept=".xlsx"
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-file">
        <Button variant="contained" color="primary" component="span">
          Cargar Horario
        </Button>
      </label>
      <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ marginLeft: 2 }}>
        Añadir Horario
      </Button>
      <Button variant="contained" color="primary" onClick={handleSaveSchedule} sx={{ marginLeft: 2 }}>
        Guardar Horario
      </Button>
      <Button variant="contained" color="default" onClick={handleViewSchedule} sx={{ marginLeft: 2 }}>
        Ver Horario
      </Button>

      {previewSchedules.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Vista Previa del Horario Cargado</Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hora de Inicio</TableCell>
                  <TableCell>Hora de Fin</TableCell>
                  {daysOfWeek.map(day => (
                    <TableCell key={day}>{day}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewSchedules.map((schedule, index) => (
                  <TableRow key={index}>
                    <TableCell>{schedule.startTime}</TableCell>
                    <TableCell>{schedule.endTime}</TableCell>
                    <TableCell>{schedule.lunes}</TableCell>
                    <TableCell>{schedule.martes}</TableCell>
                    <TableCell>{schedule.miercoles}</TableCell>
                    <TableCell>{schedule.jueves}</TableCell>
                    <TableCell>{schedule.viernes}</TableCell>
                    <TableCell>{schedule.sabado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        {selectedClassroom && !viewSchedule ? (
          <DialogTitle>Añadir Horario</DialogTitle>
        ) : (
          <DialogTitle>Horarios para {selectedClassroom?.name}</DialogTitle>
        )}
        <DialogContent>
          {selectedClassroom && !viewSchedule ? (
            <>
              <TextField
                label="Hora de Inicio"
                type="time"
                value={newSchedule.startTime}
                onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Hora de Fin"
                type="time"
                value={newSchedule.endTime}
                onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Materia"
                value={newSchedule.subject}
                onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Día"
                select
                value={newSchedule.day}
                onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                fullWidth
                margin="normal"
              >
                {daysOfWeek.map(day => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </TextField>
            </>
          ) : viewSchedule ? (
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hora de Inicio</TableCell>
                    <TableCell>Hora de Fin</TableCell>
                    {daysOfWeek.map(day => (
                      <TableCell key={day}>{day}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule, index) => (
                    <TableRow key={index}>
                      <TableCell>{schedule.startTime}</TableCell>
                      <TableCell>{schedule.endTime}</TableCell>
                      <TableCell>{schedule.lunes}</TableCell>
                      <TableCell>{schedule.martes}</TableCell>
                      <TableCell>{schedule.miercoles}</TableCell>
                      <TableCell>{schedule.jueves}</TableCell>
                      <TableCell>{schedule.viernes}</TableCell>
                      <TableCell>{schedule.sabado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </DialogContent>
        <DialogActions>
          {viewSchedule ? (
            <Button onClick={handleClose} color="primary">Cerrar</Button>
          ) : (
            <>
              <Button onClick={handleClose} color="primary">Cancelar</Button>
              {selectedClassroom && !viewSchedule && (
                <Button onClick={handleAddSchedule} color="primary">Añadir Horario</Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleManager;
