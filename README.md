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
PARTE 2: DESCRIPCIÓN TÉCNICA
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
package.json (dependencias principales)
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

# Instalar dependencias
yarn install

4.2.3 Variables de Entorno
Crear archivo .env en la raíz del proyecto:
plaintext
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
5.2 Gestión de Horarios
5.2.1 ScheduleManager Component
[PARTE 6: BASE DE DATOS]
6. Estructura de la Base de Datos
6.1 Colecciones de Firestore
6.1.1 Usuarios (users)
8. APIs y Servicios
8.1 Servicios de Firebase
8.1.1 Servicio de Autenticación
8.1.2 Servicio de Firestore
[PARTE 9: TESTING]
9. Testing
9.1 Configuración de Testing
9.1.1 Jest Configuration
9.2 Tests Unitarios
9.2.1 Componente Login
[PARTE 10: DESPLIEGUE]
10. Despliegue
10.1 Configuración de Despliegue
10.1.1 Firebase Hosting
10.3 Proceso de Despliegue
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

// src/utils/debug.js
export const DEBUG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
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

