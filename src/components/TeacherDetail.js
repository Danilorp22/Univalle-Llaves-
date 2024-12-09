import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import TeacherSchedule from './TeacherSchedule';

const TeacherDetail = ({ teacherId }) => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (teacherId) {
      fetchTeacherDetails();
    }
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', teacherId));
      if (teacherDoc.exists()) {
        setTeacher({ id: teacherDoc.id, ...teacherDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error);
    }
  };

  if (!teacher) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando información del docente...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 2, fontSize: 40 }} />
                <Typography variant="h4">{teacher.name}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 2 }} />
                <Typography>{teacher.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 2 }} />
                <Typography>{teacher.phone}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 2 }} />
                <Typography>{teacher.department}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 2 }} />
                <Typography>{teacher.specialization}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={teacher.department} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={teacher.specialization} 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TeacherSchedule teacherId={teacherId} />
    </Box>
  );
};

export default TeacherDetail;
