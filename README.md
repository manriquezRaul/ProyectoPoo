# 🧠 MenteColmena

[![Java Version](https://img.shields.io/badge/Java-21-orange.svg?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-purple.svg?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-blueviolet.svg?style=flat-square&logo=googlegemini)](https://deepmind.google/technologies/gemini/)

**MenteColmena** es una plataforma web de estudio inteligente orientada a optimizar el aprendizaje académico y la gestión de conocimientos. Diseñada para estudiantes modernos, la aplicación permite organizar apuntes mediante "Study Notebooks" (Cuadernos de Estudio) e interactuar directamente con modelos de Inteligencia Artificial para la autoevaluación, generación de cuestionarios interactivos (quizzes, flashcards, preguntas de verdadero/falso) y retroalimentación personalizada en tiempo real.

---

## 📋 Tabla de Contenidos
1. [Descripción General](#1-descripción-general)
2. [Arquitectura y Tecnologías](#2-arquitectura-y-tecnologías)
3. [Estructura del Monorepo](#3-estructura-del-monorepo)
4. [Requisitos Previos](#4-requisitos-previos)
5. [Instrucciones de Instalación y Despliegue Local](#5-instrucciones-de-instalación-y-despliegue-local)
6. [🔒 Variables de Entorno y Seguridad](#6--variables-de-entorno-y-seguridad)
7. [👥 Créditos / Equipo de Desarrollo](#7--créditos--equipo-de-desarrollo)

---

## 1. Descripción General

**MenteColmena** aborda el desafío de la sobrecarga de información académica ofreciendo un entorno digital estructurado y potenciado por inteligencia artificial. Su propósito principal es transformar el estudio pasivo (leer apuntes) en un **estudio activo** mediante técnicas de repetición espaciada y evaluación continua.

### Características Clave:
*   **Gestión de Apuntes y Study Notebooks**: Permite a los usuarios organizar apuntes en cuadernos temáticos. Admite la redacción nativa y el procesamiento de documentos cargados.
*   **Estudio Potenciado por IA**: Utilizando la API de Gemini, la plataforma genera automáticamente:
    *   **Quizzes interactivos**: Preguntas de opción múltiple con retroalimentación instantánea.
    *   **Flashcards dinámicas**: Tarjetas de memoria conceptuales para autoevaluación ágil.
    *   **Verdadero/Falso**: Enunciados de validación conceptual rápida.
    *   **Evaluación de respuestas abiertas**: La IA califica respuestas libres basándose en rúbricas y criterios académicos de alta precisión.
*   **Dashboard de Progreso**: Visualización en tiempo real del desempeño de estudio diario, metas semanales, historial de sesiones y estadísticas detalladas por cuaderno de estudio.

---

## 2. Arquitectura y Tecnologías

El sistema sigue una arquitectura moderna desacoplada en formato de Monorepo, separando la interfaz de usuario de la lógica de negocio y persistencia:

### 💻 Frontend
*   **React.js (v18.3.1)**: Biblioteca principal para la construcción de una interfaz de usuario reactiva y basada en componentes declarativos.
*   **Vite (v6.4.3)**: Herramienta de compilación y servidor de desarrollo ultra-rápido de última generación.
*   **Tailwind CSS (v4.0)**: Framework CSS adaptado directamente en el pipeline de Vite a través de `@tailwindcss/vite` para estilos modernos, responsivos y fluidos.
*   **Fetch API**: Consumo nativo de servicios REST mediante llamadas asíncronas asiladas, integradas bajo el proxy de desarrollo de Vite para evitar problemas de CORS.
*   **Radix UI / Lucide React / Recharts**: Primitivas de UI accesibles, set de íconos vectoriales de alta fidelidad y gráficos interactivos para el dashboard.

### ⚙️ Backend
*   **Java 21 (Spring Boot 4.0.6)**: Framework robusto para el desarrollo de la API REST empresarial.
*   **Paradigma de Programación Orientada a Objetos (POO)**: Implementación estricta de patrones de diseño, modularidad y polimorfismo. Por ejemplo, en la generación de contenido por IA, se utiliza una abstracción polimórfica (`GenerablePorIA`) con implementaciones concretas (`PromptQuiz`, `PromptFlashcard`, `PromptTrueFalse`) para modelar diferentes dinámicas de estudio.
*   **Apache PDFBox / Apache POI**: Motores de lectura y parsing para extraer texto de archivos PDF y documentos Word (.docx) cargados por el usuario.

### 🗄️ Base de Datos
*   **MongoDB**: Base de datos documental NoSQL flexible que almacena de manera nativa la información de los usuarios, notas, cuadernos, metas y resultados de quizzes en formato JSON/BSON.
*   **Spring Data MongoDB**: Abstracción de persistencia que facilita el mapeo objeto-documento mediante repositorios de datos declarativos.

### 🤖 Inteligencia Artificial
*   **Google Gemini API (`gemini-1.5-flash`)**: Integración directa con el modelo de lenguaje de Google para generar contenido académico estructurado en formato JSON nativo y evaluar de forma automatizada las respuestas del alumno.

---

## 3. Estructura del Monorepo

El repositorio está organizado de forma clara y limpia en dos módulos principales (`frontend` y `backend`):

```text
MenteColmena/
├── backend/                        # API REST y Servicios en Spring Boot (Java)
│   ├── mvnw                        # Script wrapper de Maven para sistemas Unix/macOS
│   ├── mvnw.cmd                    # Script wrapper de Maven para Windows
│   ├── pom.xml                     # Configuración de dependencias y plugins de Maven
│   └── src/
│       ├── main/
│       │   ├── java/com/mentecolmena/backend/
│       │   │   ├── BackendApplication.java # Clase de entrada de la aplicación
│       │   │   ├── controller/             # Controladores REST que exponen las APIs (/api/ia, /api/notas, etc.)
│       │   │   ├── ia/                     # Abstracciones y generadores de prompts orientados a objetos
│       │   │   ├── model/                  # Entidades del dominio (Usuario, Cuaderno, Nota, QuizResult)
│       │   │   ├── repository/             # Interfaces de acceso a datos de MongoDB (MongoRepository)
│       │   │   └── service/                # Capa lógica de negocio (IaService, DashboardService, etc.)
│       │   └── resources/
│       │       └── application.properties  # Configuración del entorno (puertos, MongoDB, modelo Gemini)
│       └── test/                   # Suite de pruebas unitarias y de integración
│
├── frontend/                       # Aplicación SPA en React con TypeScript
│   ├── index.html                  # Plantilla HTML base del cliente web
│   ├── package.json                # Gestión de dependencias y scripts de ejecución npm
│   ├── postcss.config.mjs          # Configuración para el procesamiento de CSS
│   ├── vite.config.ts              # Configuración de Vite, alias de rutas y proxy de desarrollo (/api -> port 8080)
│   └── src/
│       ├── main.tsx                # Punto de montaje del árbol de componentes de React
│       ├── styles/                 # Estilos globales y configuraciones de Tailwind CSS
│       └── app/                    # Lógica interna y vistas
│           ├── App.tsx             # Enrutador principal, flujos de autenticación y estado global
│           ├── constants.ts        # Constantes, configuraciones estáticas y diccionarios
│           └── components/         # Módulos y elementos visuales reutilizables
│               ├── ui/             # Botones, alertas, modales y elementos primitivos de diseño
│               ├── figma/          # Estructuras visuales importadas y mockups de UI
│               └── screens/        # Vistas de la aplicación (Dashboard, StudyHub, StudyNotebooks, etc.)
│
├── .gitignore                      # Reglas de exclusión de git a nivel global del monorepo
└── README.md                       # Documentación principal del proyecto
```

---

## 4. Requisitos Previos

Antes de levantar el proyecto de forma local, asegúrate de contar con las siguientes herramientas instaladas en tu sistema:

*   **Java Development Kit (JDK) 21**: Necesario para compilar y ejecutar el servicio del Backend.
*   **Node.js (versión 18 o superior)** y **npm** (o **pnpm** / **yarn**): Para el entorno de desarrollo y dependencias del Frontend.
*   **MongoDB**: Una instancia activa en ejecución local (en el puerto estándar `27017`) o un clúster en la nube (MongoDB Atlas).

---

## 5. Instrucciones de Instalación y Despliegue Local

Sigue estos pasos detallados para instalar y poner en marcha la aplicación en tu entorno local:

### Paso 1: Clonar el Repositorio
Abre tu terminal y descarga el código fuente del proyecto:
```bash
git clone https://github.com/tu-usuario/ProyectoPoo.git
cd ProyectoPoo
```

### Paso 2: Configurar y Levantar el Backend (Spring Boot)
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Asegúrate de configurar la variable de entorno para Gemini (ver sección [Variables de Entorno](#6--variables-de-entorno-y-seguridad)).
3. Compila y ejecuta el backend utilizando el script wrapper de Maven (`mvnw`):
   *   **En sistemas macOS / Linux:**
       ```bash
       chmod +x mvnw
       ./mvnw spring-boot:run
       ```
   *   **En Windows (PowerShell o CMD):**
       ```powershell
       .\mvnw.cmd spring-boot:run
       ```
4. El backend se levantará por defecto en el puerto **`8080`** (`http://localhost:8080`).

### Paso 3: Levantar el Frontend (React + Vite)
1. Abre una nueva ventana de la terminal en la raíz del proyecto y dirígete a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala los paquetes y dependencias del sistema:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
4. El frontend se iniciará en el puerto **`5173`** (`http://localhost:5173`). 

> [!NOTE]
> Gracias a la configuración del proxy en `vite.config.ts`, todas las peticiones frontend hacia `/api/*` se redirigen de manera transparente hacia el backend en `http://localhost:8080`, facilitando la comunicación sin necesidad de habilitar CORS de manera descontrolada en producción.

---

## 6. 🔒 Variables de Entorno y Seguridad

El backend utiliza la API oficial de Google Gemini para toda la lógica de inteligencia artificial. Por motivos de seguridad y buenas prácticas de desarrollo industrial, **nunca se deben incluir credenciales o llaves API codificadas directamente (hardcoded) en el código fuente**.

### Configuración de la API Key de Gemini:
En el archivo `backend/src/main/resources/application.properties`, se define la propiedad que mapea la variable de entorno:
```properties
gemini.api.key=${GEMINI_API_KEY:}
gemini.model=gemini-1.5-flash
```

Puedes definir esta variable en tu sistema operativo antes de levantar el backend:

#### En macOS o Linux:
```bash
export GEMINI_API_KEY="tu_clave_secreta_aqui"
```

#### En Windows (PowerShell):
```powershell
$env:GEMINI_API_KEY="tu_clave_secreta_aqui"
```

#### En entornos IDE (como IntelliJ IDEA, Eclipse o VS Code):
Puedes pasar la variable `GEMINI_API_KEY` directamente a las variables de entorno de tu configuración de ejecución (*Run Configuration*).

### Protección con `.gitignore`:
El proyecto incluye un archivo `.gitignore` a nivel raíz que bloquea la subida accidental de configuraciones locales delicadas al repositorio de Git:
```text
# Excluir archivos de variables de entorno locales
**/.env
**/.env.local
**/.env.development.local
**/application.properties (si contiene credenciales locales modificadas)
```

---

## 7. 👥 Créditos / Equipo de Desarrollo

Este proyecto ha sido desarrollado en el marco académico de la **Universidad de La Frontera (UFRO)** por el siguiente equipo de trabajo:

*   **Raul Manriquez** ─ *Frontend & Git Maestro*
    *   Diseño e implementación de la interfaz de usuario en React, gráficos del Dashboard, flujos de interacción e integración del proxy de red. Responsable del control de versiones y flujos de trabajo en Git.
*   **Catalina** ─ *Backend & MongoDB*
    *   Diseño y desarrollo de la arquitectura del servidor, controladores REST, lógica de servicios de negocio y estructuración de modelos documentales en base de datos NoSQL MongoDB.
*   **Bianca** ─ *Integración de API de IA y Prompts*
    *   Ingeniería de prompts estructurados, control de flujo y parser de respuestas JSON en el microservicio de Gemini, modelado de evaluación automatizada mediante rúbricas de estudio.

---
*Desarrollado con fines educativos y de innovación metodológica de estudio activo 🎓.*