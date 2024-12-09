import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BrowserMultiFormatReader } from '@zxing/library';
import ClassroomList from './ClassroomList';

const TeacherDashboard = () => {
  const [openScanner, setOpenScanner] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [scanning, setScanning] = useState(false);
  const teacherId = localStorage.getItem('teacherId');
  const videoRef = useRef(null);
  const readerRef = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'classrooms'), (snapshot) => {
      const classroomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClassrooms(classroomsData);
    });

    const getTeacherData = async () => {
      if (teacherId) {
        try {
          const teacherDoc = await getDoc(doc(db, 'teachers', teacherId));
          if (teacherDoc.exists()) {
            setTeacherData(teacherDoc.data());
          }
        } catch (error) {
          console.error('Error al obtener datos del profesor:', error);
          showNotification('Error al cargar datos del profesor', 'error');
        }
      }
    };
    getTeacherData();

    return () => {
      unsubscribe();
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (error) {
          console.error('Error al limpiar el escáner:', error);
        }
      }
    };
  }, [teacherId]);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const startScanner = async () => {
    try {
      setScanning(true);
      const videoInputDevices = await readerRef.current.listVideoInputDevices();

      if (!videoInputDevices || videoInputDevices.length === 0) {
        showNotification('No se encontró ninguna cámara', 'error');
        setScanning(false);
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      await readerRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        async (result) => {
          if (result) {
            try {
              const qrData = JSON.parse(result.getText());

              if (qrData.action === 'occupy' && qrData.classroomId) {
                const classroomRef = doc(db, 'classrooms', qrData.classroomId);
                const classroomDoc = await getDoc(classroomRef);
                
                if (classroomDoc.exists() && classroomDoc.data().status === 'free') {
                  await updateDoc(classroomRef, {
                    status: 'occupied',
                    teacherId: teacherId,
                    teacherName: teacherData?.name || 'Docente',
                    occupiedAt: new Date().toISOString()
                  });
                  showNotification(`Aula ${classroomDoc.data().name} ocupada exitosamente`, 'success');
                  handleCloseScanner();
                } else {
                  showNotification('El aula no está disponible', 'warning');
                }
              } else {
                showNotification('Código QR no válido', 'error');
              }
            } catch (error) {
              console.error('Error al procesar QR:', error);
              showNotification('Error al procesar el código QR', 'error');
            }
          }
        }
      );
    } catch (error) {
      console.error('Error al iniciar el escáner:', error);
      showNotification('Error al iniciar la cámara', 'error');
    } finally {
      setScanning(false);
    }
  };

  const handleCloseScanner = () => {
    try {
      readerRef.current.reset();
      setOpenScanner(false);
      setScanning(false);
    } catch (error) {
      console.error('Error al cerrar el escáner:', error);
    }
  };

  const handleScanQR = () => {
    setOpenScanner(true);
  };

  useEffect(() => {
    if (openScanner) {
      startScanner();
    }
    return () => {
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (error) {
          console.error('Error al limpiar el escáner:', error);
        }
      }
    };
  }, [openScanner]);

  const handleFreeClassroom = async (classroomId) => {
    try {
      const classroomRef = doc(db, 'classrooms', classroomId);
      await updateDoc(classroomRef, {
        status: 'free',
        teacherId: null,
        teacherName: null,
        occupiedAt: null
      });
      showNotification('Aula desocupada exitosamente', 'success');
    } catch (error) {
      console.error('Error al desocupar el aula:', error);
      showNotification('Error al desocupar el aula', 'error');
    }
  };

  if (!teacherData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Información Personal
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary">
                Email
              </Typography>
              <Typography>{teacherData.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary">
                Departamento
              </Typography>
              <Typography>{teacherData.department}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary">
                Especialización
              </Typography>
              <Typography>{teacherData.specialization}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleScanQR}
              sx={{ mt: 2 }}
            >
              Escanear Código QR
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Mis Aulas Ocupadas
                </Typography>
                {classrooms
                  .filter(classroom => classroom.status === 'occupied' && classroom.teacherId === teacherId)
                  .map((classroom) => (
                    <Paper
                      key={classroom.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #90caf9',
                        borderRadius: 2,
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            {classroom.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Capacidad: {classroom.capacity} estudiantes
                          </Typography>
                          {classroom.occupiedAt && (
                            <Typography variant="body2" color="text.secondary">
                              Ocupada desde: {new Date(classroom.occupiedAt).toLocaleString()}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={() => handleFreeClassroom(classroom.id)}
                            startIcon={<LogoutIcon />}
                          >
                            Desocupar
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                {!classrooms.some(classroom => 
                  classroom.status === 'occupied' && classroom.teacherId === teacherId
                ) && (
                  <Typography 
                    color="text.secondary" 
                    sx={{ 
                      textAlign: 'center',
                      py: 3,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1
                    }}
                  >
                    No tienes aulas ocupadas actualmente
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Aulas Disponibles
                </Typography>
                <ClassroomList 
                  classrooms={classrooms.filter(classroom => classroom.status === 'free')} 
                  showOnlyFree={true} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={openScanner}
        onClose={handleCloseScanner}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { position: 'relative' }
        }}
      >
        <DialogTitle>
          Escanear Código QR
          {scanning && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseScanner} 
            color="primary"
            startIcon={<QrCodeScannerIcon />}
          >
            Cancelar Escaneo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;
