# Task Manager - Full Stack Application

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-success" alt="Status">
  <img src="https://img.shields.io/badge/React-TypeScript-blue" alt="Frontend">
  <img src="https://img.shields.io/badge/Node.js-Express-green" alt="Backend">
  <img src="https://img.shields.io/badge/PostgreSQL-Prisma-orange" alt="Database">
  <img src="https://img.shields.io/badge/Security-JWT%20%26%20bcrypt-red" alt="Security">
</p>

<!-- BADGE_CI -->

Sistema integral de gestión de tareas desarrollado bajo una **arquitectura desacoplada** como proyecto monográfico para el *Módulo de Fundamentos de Desarrollo Full Stack*.

---

## 🚀 Características Principales
* **Interfaz Dinámica (SPA):** Desarrollada en React y TypeScript con gestión de estados mediante Hooks (`useState`, `useEffect`).
* **API REST Robusta:** Servidor backend estructurado en Node.js y Express para procesar peticiones y reglas de negocio.
* **Persistencia Relacional:** Gestión de bases de datos con PostgreSQL y modelado avanzado mediante Prisma ORM.
* **Seguridad Perimetral:** Autenticación basada en **JSON Web Tokens (JWT)**[cite: 1] y encriptación de credenciales con **bcrypt** (hashing con salt adaptativo)[cite: 1].
* **Rutas Protegidas:** Middlewares personalizados en el backend para validar cabeceras de autorización (`Bearer Token`)[cite: 1] y aislar los datos por usuario operador[cite: 1].

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite[cite: 1] |
| **Backend** | Node.js, Express.js[cite: 1] |
| **Base de Datos** | PostgreSQL, Prisma ORM, Prisma Studio[cite: 1] |
| **Autenticación** | JWT (JSON Web Tokens), bcrypt[cite: 1] |
| **Testing de API** | Postman[cite: 1] |

---

## ⚙️ Guía de Instalación y Ejecución Local

Sigue los pasos a continuación para poner en marcha el sistema en tu equipo local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/jimena-salazar-s/task-manager-react.git](https://github.com/jimena-salazar-s/task-manager-react.git)

cd task-manager-react
```
### 2. Configurar y levantar el Backend

```bash
# Entrar al directorio del backend (ajustar ruta según tu estructura)
cd backend

# Instalar dependencias
npm install

# Configurar el archivo .env con tu conexión a PostgreSQL y secreto JWT
# DATABASE_URL="postgresql://user:password@localhost:5432/task_db?schema=public"
# JWT_SECRET="tu_secreto"

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Iniciar servidor en modo desarrollo
npm run dev

# (Opcional) Visualizar los datos de la base de datos de forma gráfica
npx prisma@6.19.0 studio
```
> ***Nota sobre Prisma Studio:*** El comando anterior levanta una interfaz web (habitualmente en http://localhost:5555)[cite: 1] para monitorear y administrar de manera visual las tablas User y Task.

### 3. Configurar y levantar el Frontend

```bash
# Entrar al directorio del frontend en *otra* terminal
cd ..

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (Vite)
npm run dev

Accede a http://localhost:5173 en tu navegador web[cite: 1].
```
## Comandos disponibles
| Comando | Descripcion |
| --- | --- |
| npm install	| Instala los paquetes/librerias necesarios para el proyecto |
| npm run dev	| Levanta el entorno de desarrollo |
| npm run build	| Genera el build de producción |
| npm test | Corre las pruebas automatizadas |
| npx prisma@6.19.0 studio | Permite visualizar los datos de la base de datos de forma gráfica |

## Endpoints Principales de la API

**POST /login** - Autenticación de usuarios y emisión de token JWT.

**POST /register** - Registro de nuevos usuarios con encriptación de contraseña por bcrypt.

**GET /tasks** - Obtención de tareas asociadas al usuario autenticado (Requiere Header Authorization: Bearer <token>).

**POST /tasks** - Creación controlada de un nuevo registro de actividad.
