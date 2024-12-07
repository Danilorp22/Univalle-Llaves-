# Univalle-Llaves- 1. Introducción
1.1 Propósito del Documento
Este manual técnico proporciona una documentación exhaustiva del Sistema de Gestión de Aulas Univalle, una aplicación web desarrollada para optimizar la administración y gestión de recursos académicos en la Universidad del Valle. El documento está dirigido a desarrolladores, administradores de sistemas y personal técnico responsable de la implementación, mantenimiento y evolución del sistema.
1.2 Alcance del Sistema
El sistema abarca:
•	Gestión integral de aulas y espacios académicos
•	Administración de horarios y calendarios
•	Sistema de autenticación y autorización de usuarios
•	Gestión de permisos y roles
•	Monitoreo en tiempo real de ocupación
•	Sistema de notificaciones
•	Generación de reportes y análisis
•	Interfaz responsiva para múltiples dispositivos
1.3 Objetivos del Sistema
1.3.1 Objetivos Principales
•	Optimizar la utilización de espacios académicos
•	Reducir conflictos en la asignación de aulas
•	Mejorar la experiencia de usuarios (docentes y administrativos)
•	Facilitar la toma de decisiones basada en datos
•	Automatizar procesos administrativos
1.3.2 Objetivos Específicos
•	Proporcionar información en tiempo real sobre disponibilidad de aulas
•	Implementar un sistema de reservas eficiente
•	Generar reportes detallados de utilización
•	Mantener un histórico de uso de espacios
•	Facilitar la comunicación entre usuarios del sistema
[PARTE 2: DESCRIPCIÓN TÉCNICA]
2. Descripción Técnica del Proyecto
2.1 Arquitectura del Sistema
2.1.1 Frontend (Cliente)
•	Framework Principal: React 18.2.0
•	UI Framework: Material-UI 5.x
•	Estado Global: React Context API
•	Routing: React Router 6.x
•	Gestión de Formularios: Formik + Yup
•	Visualización de Datos: Chart.js
•	Estilos: Styled-components
2.1.2 Backend (Servidor)
•	Plataforma: Firebase
•	Base de Datos: Firestore
•	Autenticación: Firebase Authentication
•	Almacenamiento: Firebase Storage
•	Hosting: Firebase Hosting
•	Functions: Firebase Cloud Functions
2.2 Tecnologías y Frameworks
2.2.1 Tecnologías Frontend
javascript
CopyInsert
// package.json (dependencias principales)
{
  "dependencies": {
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "formik": "^2.x.x",
    "yup": "^1.x.x",
    "firebase": "^9.x.x",
    "chart.js": "^4.x.x",
    "date-fns": "^2.x.x",
    "styled-components": "^5.x.x"
  }
}
[PARTE 3: ESTRUCTURA DEL PROYECTO]
3. Estructura del Proyecto
3.1 Organización de Directorios
![image](https://github.com/user-attachments/assets/a66465ea-f196-4100-bd19-adf7b35b093e)


4. Configuración del Entorno de Desarrollo
4.1 Requisitos Previos
4.1.1 Software Necesario
•	Node.js (v16.x o superior)
•	npm (v7.x o superior) o Yarn
•	Git
•	Editor de código (VS Code recomendado)
•	Firebase CLI
4.1.2 Extensiones Recomendadas para VS Code
•	ESLint
•	Prettier
•	GitLens
•	Firebase
•	Material Icon Theme
•	React Developer Tools
4.2 Configuración Inicial del Proyecto
4.2.1 Instalación de Dependencias Globales
bash
CopyInsert
# Instalación de Node.js y npm
# Descargar e instalar desde https://nodejs.org/

# Verificar instalación
node --version
npm --version

# Instalar Firebase CLI
npm install -g firebase-tools

# Instalar dependencias de desarrollo
npm install -g yarn
4.2.2 Configuración del Proyecto
bash
CopyInsert
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd admin-portal

# Instalar dependencias
yarn install

# Crear archivo .gitignore
node_modules/
.env
.env.local
build/
*.log
.DS_Store
4.2.3 Variables de Entorno
Crear archivo .env en la raíz del proyecto:
plaintext
CopyInsert
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
[PARTE 5: COMPONENTES PRINCIPALES]
5. Componentes Principales del Sistema
5.1 Módulo de Autenticación
5.1.1 Login Component
javascript
CopyInsert
// src/components/auth/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TextField, Button, Alert } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
    </form>
  );
};

export default Login;
5.2 Gestión de Horarios
5.2.1 ScheduleManager Component
javascript
CopyInsert
// src/components/schedule/ScheduleManager.js
import React, { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';

const ScheduleManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const { getSchedules, addSchedule } = useFirestore();

  useEffect(() => {
    const loadSchedules = async () => {
      const data = await getSchedules(selectedDate);
      setSchedules(data);
    };
    loadSchedules();
  }, [selectedDate]);

  return (
    <div className="schedule-manager">
      <Calendar 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        schedules={schedules}
      />
      <TimeSlotPicker 
        date={selectedDate}
        schedules={schedules}
        onScheduleAdd={addSchedule}
      />
    </div>
  );
};

export default ScheduleManager;
[PARTE 6: BASE DE DATOS]
6. Estructura de la Base de Datos
6.1 Colecciones de Firestore
6.1.1 Usuarios (users)
javascript
CopyInsert
{
  id: string, // UID generado por Firebase Auth
  email: string,
  displayName: string,
  role: 'admin' | 'teacher',
  department: string,
  createdAt: timestamp,
  lastLogin: timestamp
}
6.1.2 Aulas (classrooms)
javascript
CopyInsert
{
  id: string,
  name: string,
  capacity: number,
  building: string,
  floor: number,
  resources: {
    projector: boolean,
    computers: number,
    airConditioner: boolean
  },
  status: 'available' | 'occupied' | 'maintenance'
}
6.1.3 Horarios (schedules)
javascript
CopyInsert
{
  id: string,
  classroomId: string,
  teacherId: string,
  subject: string,
  startTime: timestamp,
  endTime: timestamp,
  recurrence: {
    type: 'none' | 'daily' | 'weekly',
    endDate: timestamp
  },
  status: 'active' | 'cancelled',
  createdAt: timestamp,
  updatedAt: timestamp
}
[PARTE 7: SEGURIDAD]
7. Seguridad y Autenticación
7.1 Reglas de Firestore
javascript
CopyInsert
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Funciones auxiliares
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isTeacher() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    // Reglas para usuarios
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
      allow update: if request.auth.uid == userId;
    }

    // Reglas para aulas
    match /classrooms/{classroomId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Reglas para horarios
    match /schedules/{scheduleId} {
      allow read: if isAuthenticated();
      allow create: if isTeacher() || isAdmin();
      allow update, delete: if isAdmin() || 
        (isTeacher() && resource.data.teacherId == request.auth.uid);
    }
  }
}
8. APIs y Servicios
8.1 Servicios de Firebase
8.1.1 Servicio de Autenticación
javascript
CopyInsert
// src/services/auth.service.js
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

export const AuthService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  },

  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Error en registro: ${error.message}`);
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Error en logout: ${error.message}`);
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(`Error en reset de contraseña: ${error.message}`);
    }
  }
};
8.1.2 Servicio de Firestore
javascript
CopyInsert
// src/services/firestore.service.js
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

export const FirestoreService = {
  // Operaciones CRUD para aulas
  async getClassrooms() {
    try {
      const querySnapshot = await getDocs(collection(db, 'classrooms'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error al obtener aulas: ${error.message}`);
    }
  },

  async addClassroom(classroomData) {
    try {
      const docRef = await addDoc(collection(db, 'classrooms'), classroomData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Error al añadir aula: ${error.message}`);
    }
  },

  // Operaciones CRUD para horarios
  async getSchedules(filters = {}) {
    try {
      let scheduleQuery = collection(db, 'schedules');
      
      if (filters.teacherId) {
        scheduleQuery = query(scheduleQuery, where('teacherId', '==', filters.teacherId));
      }
      
      const querySnapshot = await getDocs(scheduleQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error al obtener horarios: ${error.message}`);
    }
  }
};
8.2 Servicios de Utilidad
8.2.1 Servicio de Notificaciones
javascript
CopyInsert
// src/services/notification.service.js
import { toast } from 'react-toastify';

export const NotificationService = {
  success(message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  },

  error(message) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }
};
[PARTE 9: TESTING]
9. Testing
9.1 Configuración de Testing
9.1.1 Jest Configuration
javascript
CopyInsert
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
9.2 Tests Unitarios
9.2.1 Componente Login
javascript
CopyInsert
// src/__tests__/components/Login.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../components/auth/Login';
import { AuthContext } from '../../contexts/AuthContext';

describe('Login Component', () => {
  const mockLogin = jest.fn();

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );
  };

  it('should render login form', () => {
    const { getByLabelText, getByRole } = renderLogin();
    
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle login submission', async () => {
    const { getByLabelText, getByRole } = renderLogin();
    
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
[PARTE 10: DESPLIEGUE]
10. Despliegue
10.1 Configuración de Despliegue
10.1.1 Firebase Hosting
javascript
CopyInsert
// firebase.json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
10.2 Scripts de Despliegue
json
CopyInsert
// package.json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "npm run build && firebase deploy",
    "deploy:hosting": "npm run build && firebase deploy --only hosting"
  }
}
10.3 Proceso de Despliegue
bash
CopyInsert
# Login en Firebase
firebase login

# Inicializar proyecto Firebase
firebase init

# Construir la aplicación
npm run build

# Desplegar a Firebase
npm run deploy
[PARTE 11: MANTENIMIENTO]
11. Mantenimiento y Monitoreo
11.1 Monitoreo de Errores
javascript
CopyInsert
// src/utils/errorTracking.js
import * as Sentry from "@sentry/react";

export const initializeErrorTracking = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
};

export const logError = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context
  });
};
11.2 Logging
javascript
CopyInsert
// src/utils/logger.js
export const Logger = {
  info(message, data = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, data);
    }
  },

  error(message, error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message}`, error);
    }
    // Enviar a sistema de tracking de errores
    logError(error, { message });
  }
};
[PARTE 12: TROUBLESHOOTING]
12. Resolución de Problemas
12.1 Problemas Comunes y Soluciones
12.1.1 Problemas de Autenticación
1.	Error: Usuario no autorizado
•	Verificar rol del usuario en Firestore
•	Comprobar reglas de seguridad
•	Validar token de autenticación
2.	Error: Token expirado
•	Implementar renovación automática de token
•	Manejar cierre de sesión por expiración
12.1.2 Problemas de Rendimiento
1.	Carga lenta de datos
•	Implementar paginación
•	Optimizar consultas Firestore
•	Usar caché local
2.	Problemas de memoria
•	Limpiar suscripciones
•	Implementar virtualización de listas
•	Optimizar renders innecesarios
12.2 Guía de Depuración
javascript
CopyInsert
// src/utils/debug.js
export const DEBUG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

export const debugLog = (level, message, data = null) => {
  if (process.env.REACT_APP_DEBUG_LEVEL >= level) {
    console.log(`[${new Date().toISOString()}] ${message}`, data);
  }
};
[PARTE 13: APÉNDICES]
13. Apéndices
13.1 Glosario de Términos
•	Firebase: Plataforma de desarrollo de aplicaciones web y móviles de Google
•	Firestore: Base de datos NoSQL en tiempo real de Firebase
•	React: Biblioteca JavaScript para construir interfaces de usuario
•	Material-UI: Biblioteca de componentes React que implementa Material Design
•	JWT: JSON Web Token, usado para autenticación
•	API: Application Programming Interface
13.2 Referencias
•	Documentación de React
•	Documentación de Firebase
•	Material-UI Documentation
•	Create React App Documentation
13.3 Contactos de Soporte
•	Soporte Técnico: [email]
•	Administrador del Sistema: [email]
•	Equipo de Desarrollo: [email]
Este manual técnico proporciona una guía completa para el desarrollo, mantenimiento y soporte del Sistema de Gestión de Aulas Univalle. Se recomienda mantenerlo actualizado conforme el sistema evolucione y se implementen nuevas características

