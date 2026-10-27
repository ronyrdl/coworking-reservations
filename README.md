# CoSpace

**Plataforma de reservas para espacios de coworking.**

CoSpace es una aplicación web que permite administrar espacios de coworking y gestionar reservas de manera sencilla y segura. Los usuarios pueden consultar los espacios disponibles y realizar reservas, mientras que los administradores pueden gestionar los espacios y supervisar las operaciones de la plataforma.

---

## Características principales

### Autenticación y seguridad
- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Access Token y Refresh Token.
- Cookies HttpOnly para proteger las sesiones.
- Contraseñas y tokens protegidos mediante mecanismos de seguridad.

### Gestión de espacios
- Consulta de espacios disponibles.
- Administración de espacios.
- Activación y desactivación de espacios.
- Edición de información de los espacios.
- Control de acceso según el rol del usuario.

### Sistema de reservas
- Creación y consulta de reservas.
- Validación de disponibilidad.
- Prevención de reservas superpuestas.
- Restricción de duración y horarios.
- Cancelación de reservas según las reglas del sistema.
- Protección contra solicitudes duplicadas mediante claves de idempotencia.

### Administración
- Panel de administración.
- Gestión de espacios.
- Visualización de espacios activos e inactivos.
- Control de permisos según roles.

### Protección de la API
- Validaciones del lado del servidor.
- Control de acceso a rutas protegidas.
- Rate limiting para operaciones sensibles.
- Validación de reglas de negocio.

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Next.js 16 | Framework fullstack |
| React | Interfaz de usuario |
| TypeScript | Tipado estático |
| Prisma ORM 7 | Acceso y gestión de datos |
| PostgreSQL | Base de datos |
| Supabase | Infraestructura de PostgreSQL |
| JWT | Autenticación |
| Docker | Contenedorización |
| Docker Compose | Administración de contenedores |

---

## Requisitos previos

Para ejecutar el proyecto localmente necesitas:

- Node.js 24 o superior.
- npm.
- PostgreSQL o una instancia de Supabase.
- Git.

Para ejecutar mediante Docker:

- Docker.
- Docker Compose.

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd desempeño
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear el archivo `.env` tomando como referencia `.env.example`:

```bash
cp .env.example .env
```

Configurar las variables necesarias:

```env
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/BASE_DE_DATOS
DIRECT_URL=postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/BASE_DE_DATOS

JWT_ACCESS_SECRET=TU_SECRETO_ACCESS
JWT_REFRESH_SECRET=TU_SECRETO_REFRESH

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

NEXT_PUBLIC_APP_URL=http://localhost:3002
```

**Importante:** nunca publiques el archivo `.env` ni compartas tus credenciales o secretos.

### 4. Generar Prisma Client

```bash
npx prisma generate
```

### 5. Ejecutar migraciones

```bash
npx prisma migrate deploy
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

## Ejecución con Docker

CoSpace cuenta con una configuración Docker que permite construir y ejecutar la aplicación en un contenedor independiente.

### 1. Construir la imagen

```bash
docker build -t cospace:latest .
```

### 2. Iniciar los servicios

```bash
docker compose up -d
```

### 3. Verificar el contenedor

```bash
docker compose ps
```

### 4. Consultar los logs

```bash
docker compose logs -f cospace
```

### 5. Verificar el estado de la API

```bash
curl http://localhost:3002/api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "CoSpace API funcionando correctamente",
  "database": "connected"
}
```

La aplicación estará disponible en:

**http://localhost:3002**

### Comandos útiles de Docker Compose

| Comando | Descripción |
|---|---|
| `docker compose up -d` | Inicia la aplicación |
| `docker compose down` | Detiene y elimina el contenedor y la red |
| `docker compose ps` | Muestra el estado de los servicios |
| `docker compose restart cospace` | Reinicia la aplicación |
| `docker compose logs -f cospace` | Muestra los registros |
| `docker compose up -d --build` | Reconstruye y levanta la aplicación |

---

## Arquitectura general

CoSpace utiliza Next.js como framework fullstack, centralizando la interfaz de usuario y la lógica del servidor en una misma aplicación.

```text
CoSpace
│
├── Interfaz de usuario
│   └── Next.js / React
│
├── Backend
│   ├── API Routes
│   ├── Autenticación JWT
│   ├── Validaciones
│   ├── Autorización por roles
│   ├── Rate Limiting
│   └── Lógica de reservas
│
├── Persistencia
│   └── Prisma ORM
│       └── PostgreSQL
│
└── Infraestructura
    ├── Dockerfile
    ├── compose.yaml
    └── Supabase
```

---

## Seguridad y reglas de negocio

La aplicación implementa diferentes mecanismos para proteger la información y garantizar la integridad de las operaciones:

- Autenticación basada en tokens JWT.
- Cookies HttpOnly para las credenciales de sesión.
- Separación de permisos entre usuarios y administradores.
- Validación de disponibilidad antes de confirmar una reserva.
- Prevención de reservas duplicadas.
- Control de solicitudes mediante rate limiting.
- Validación de horarios y duración de las reservas.
- Validaciones ejecutadas desde el servidor.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión principal a PostgreSQL |
| `DIRECT_URL` | Conexión directa o de sesión para operaciones de Prisma |
| `JWT_ACCESS_SECRET` | Secreto para Access Tokens |
| `JWT_REFRESH_SECRET` | Secreto para Refresh Tokens |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de expiración del Access Token |
| `REFRESH_TOKEN_EXPIRES_IN` | Tiempo de expiración del Refresh Token |
| `NEXT_PUBLIC_APP_URL` | URL pública de la aplicación |

---

## Estado del proyecto

CoSpace cuenta con:

- [x] Configuración de Next.js y TypeScript.
- [x] Integración con PostgreSQL.
- [x] Configuración de Prisma ORM.
- [x] Sistema de autenticación.
- [x] Gestión de usuarios y roles.
- [x] Gestión de espacios.
- [x] Sistema de reservas.
- [x] Validaciones de disponibilidad.
- [x] Idempotencia en operaciones.
- [x] Rate limiting.
- [x] Contenedorización con Docker.
- [x] Configuración de Docker Compose.
- [x] Verificación de conexión con PostgreSQL mediante Health Check.

---

## Autor

**Ronaldo Rodríguez de Lima**

Proyecto desarrollado como parte de una prueba técnica de desarrollo de software.

---

**CoSpace — Simplificando la gestión de espacios de coworking.**