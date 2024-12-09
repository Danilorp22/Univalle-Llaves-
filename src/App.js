import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import RegisterClassroom from './components/RegisterClassroom';
import ClassroomList from './components/ClassroomList';
import ScheduleManager from './components/ScheduleManager';
import TeacherManager from './components/TeacherManager';
import TeacherDetail from './components/TeacherDetail';
import TeacherDashboard from './components/TeacherDashboard';
import RegisterTeacher from './components/RegisterTeacher';
import { auth } from './firebaseConfig';
import { ScheduleProvider } from './context/ScheduleContext';
import { AuthProvider } from './context/AuthContext';

// Componente para proteger rutas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = auth.currentUser;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'admin' ? '/dashboard' : '/teacher-dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ScheduleProvider>
          <Router>
            <Navbar />
            <div className="App">
              <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Rutas protegidas para administradores */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <RegisterClassroom />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classrooms"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ClassroomList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teachers"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TeacherManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teachers/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TeacherDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/register-teacher" element={<RegisterTeacher />} />

                {/* Rutas protegidas para docentes */}
                <Route
                  path="/teacher-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Rutas accesibles para ambos roles */}
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                      <ScheduleManager />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </ScheduleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
