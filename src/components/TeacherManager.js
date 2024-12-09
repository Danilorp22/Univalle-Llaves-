import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ScheduleContext } from '../context/ScheduleContext';

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    specialization: ''
  });
  const { schedule } = useContext(ScheduleContext);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const teachersCollection = collection(db, 'teachers');
      const teachersSnapshot = await getDocs(teachersCollection);
      const teachersList = teachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeachers(teachersList);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setFormData({
      name: '',
      email: '',
      department: '',
      phone: '',
      specialization: ''
    });
  };

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      phone: teacher.phone,
      specialization: teacher.specialization
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTeacher(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode && currentTeacher) {
        const teacherRef = doc(db, 'teachers', currentTeacher.id);
        await updateDoc(teacherRef, formData);
      } else {
        await addDoc(collection(db, 'teachers'), formData);
      }
      handleClose();
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este docente?')) {
      try {
        await deleteDoc(doc(db, 'teachers', teacherId));
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Docentes</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Agregar Docente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Especialización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.specialization}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(teacher)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(teacher.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Mi Horario</Typography>
        {schedule.length > 0 ? (
          schedule.map((sched, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body1">Día: {sched.day}</Typography>
              <Typography variant="body2">Inicio: {sched.startTime}</Typography>
              <Typography variant="body2">Fin: {sched.endTime}</Typography>
              <Typography variant="body2">Asignatura: {sched.subject}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No hay horario disponible</Typography>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Horarios para {currentTeacher?.name}</DialogTitle>
        <DialogContent>
          {schedule.length > 0 ? (
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hora de Inicio</TableCell>
                    <TableCell>Hora de Fin</TableCell>
                    <TableCell>Lunes</TableCell>
                    <TableCell>Martes</TableCell>
                    <TableCell>Miércoles</TableCell>
                    <TableCell>Jueves</TableCell>
                    <TableCell>Viernes</TableCell>
                    <TableCell>Sábado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedule.map((sched, index) => (
                    <TableRow key={index}>
                      <TableCell>{sched.startTime}</TableCell>
                      <TableCell>{sched.endTime}</TableCell>
                      <TableCell>{sched.lunes}</TableCell>
                      <TableCell>{sched.martes}</TableCell>
                      <TableCell>{sched.miercoles}</TableCell>
                      <TableCell>{sched.jueves}</TableCell>
                      <TableCell>{sched.viernes}</TableCell>
                      <TableCell>{sched.sabado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No hay horario disponible</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Editar Docente' : 'Agregar Nuevo Docente'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre Completo"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="department"
            label="Departamento"
            type="text"
            fullWidth
            value={formData.department}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Teléfono"
            type="text"
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="specialization"
            label="Especialización"
            type="text"
            fullWidth
            value={formData.specialization}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Guardar Cambios' : 'Agregar Docente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherManager;
