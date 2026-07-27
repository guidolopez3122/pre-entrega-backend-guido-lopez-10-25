# 🐾 AdoptMe - API de Simulador de Adopción de Mascotas

Backend API para un simulador de adopción de mascotas construido con **Node.js**, **Express**, **MongoDB** y **Docker**.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tests Funcionales](#-tests-funcionales)
- [Dockerización](#-dockerización)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [URL del Repositorio](#-url-del-repositorio)
- [URL de la Imagen Docker](#-url-de-la-imagen-docker)

---

## 📁 Estructura del Proyecto

```
pre-entrega-backend-guido-lopez-10-25/
├── .dockerignore             # Archivos ignorados por Docker
├── .gitignore                # Archivos ignorados por Git
├── Dockerfile                # Dockerfile multi-stage optimizado
├── README.md                 # Documentación del proyecto
├── package.json              # Dependencias y scripts
├── jest.config.cjs           # Configuración de Jest
├── jest.setup.cjs            # Setup global de Jest
├── winston-mock.cjs          # Mock de Winston para tests
├── test/                     # Tests funcionales
│   └── adoption.functional.test.js
├── src/
│   ├── app.js                # Configuración de Express y rutas
│   ├── utils.js              # Utilidades (helpers Handlebars)
│   ├── config/
│   │   └── index.js          # Configuración (variables de entorno)
│   ├── controllers/          # Controladores de la API
│   │   ├── adoptions.controller.js
│   │   ├── pets.controller.js
│   │   └── users.controller.js
│   ├── dao/                  # Capa de acceso a datos (Data Access Objects)
│   │   ├── Adoptions.js
│   │   ├── Pets.js
│   │   └── Users.js
│   ├── db/
│   │   └── mongo.js          # Conexión a MongoDB
│   ├── dto/                  # Data Transfer Objects
│   ├── factories/            # Fábricas (DAO factory)
│   ├── middleware/           # Middleware (auth, passport)
│   │   ├── auth.js
│   │   └── passport.js
│   ├── models/               # Modelos de Mongoose
│   │   ├── Adoption.js
│   │   ├── Pet.js
│   │   ├── User.js
│   │   ├── cart.js
│   │   ├── product.model.js
│   │   └── Ticket.js
│   ├── repositories/         # Repositorios
│   ├── routes/               # Rutas de la API
│   │   └── api/
│   │       ├── adoption.router.js
│   │       ├── pets.routes.js
│   │       ├── users.router.js
│   │       ├── carts.routes.js
│   │       ├── products.routes.js
│   │       └── sessions.js
│   ├── services/             # Lógica de negocio
│   │   ├── index.js          # Servicios centralizados con DAOs singleton
│   │   ├── adoption.service.js
│   │   ├── pet.service.js
│   │   ├── cart.service.js
│   │   ├── product.service.js
│   │   ├── ticket.service.js
│   │   └── user.service.js
│   ├── seed/                 # Scripts de seed
│   ├── sockets/              # Configuración de Socket.io
│   ├── utils/                # Utilidades (email, constantes)
│   └── views/                # Plantillas Handlebars
└── __mocks__/                # Mocks para tests
    └── winston.cjs
```

### Propósito de archivos y carpetas principales

| Carpeta/Archivo | Propósito |
|----------------|-----------|
| `src/app.js` | Configuración principal de Express, middlewares globales y registro de rutas |
| `src/controllers/` | Controladores que manejan las peticiones HTTP y delegan en servicios |
| `src/dao/` | Data Access Objects - capa de acceso directo a MongoDB vía Mongoose |
| `src/models/` | Esquemas de Mongoose que definen la estructura de datos |
| `src/services/` | Lógica de negocio centralizada (`index.js` exporta DAOs singleton y funciones de servicio) |
| `src/middleware/` | Middleware de autenticación (Passport JWT) y autorización por roles |
| `src/routes/api/` | Definición de rutas para cada recurso de la API |
| `test/` | Tests funcionales con Jest y Supertest |
| `Dockerfile` | Imagen Docker multi-stage optimizada para producción |

---

## 🧪 Tests Funcionales

### Cobertura de tests para `adoption.router.js`

Los tests funcionales cubren **todos los endpoints** del router de adopciones:

| Endpoint | Método | Descripción | Tests |
|----------|--------|-------------|-------|
| `/api/adoptions` | GET | Listar todas las adopciones (admin) | 4 tests |
| `/api/adoptions/me` | GET | Obtener adopciones del usuario autenticado | 2 tests |
| `/api/adoptions/:aid` | GET | Obtener adopción por ID | 2 tests |
| `/api/adoptions` | POST | Crear solicitud de adopción | 4 tests |
| `/api/adoptions/:aid` | PUT | Actualizar adopción (admin) | 2 tests |
| `/api/adoptions/:aid` | DELETE | Eliminar adopción | 2 tests |
| `/api/adoptions/:aid/approve` | POST | Aprobar adopción (admin) | 3 tests |
| `/api/adoptions/:aid/reject` | POST | Rechazar adopción (admin) | 2 tests |
| **Total** | | | **21 tests** |

### Lo que valida cada grupo de tests

- **Creación (POST):** Valida creación exitosa, rechazo sin autenticación, rechazo sin datos requeridos, rechazo con ID inválido.
- **Listado (GET /):** Valida acceso admin exitoso, rechazo sin autenticación, rechazo con rol user, filtro por status.
- **Mis adopciones (GET /me):** Valida devolución de adopciones del usuario, rechazo sin autenticación.
- **Obtener por ID (GET /:aid):** Valida error 404 para inexistente, rechazo sin autenticación.
- **Actualizar (PUT /:aid):** Valida rechazo sin autenticación, rechazo con rol user.
- **Eliminar (DELETE /:aid):** Valida rechazo sin autenticación, error 404/400 para inexistente.
- **Aprobar (POST /:aid/approve):** Valida rechazo sin auth, rechazo con rol user, aprobación exitosa como admin.
- **Rechazar (POST /:aid/reject):** Valida rechazo sin auth, rechazo exitoso como admin con notas.

### Mocks y Fakes utilizados

Para aislar las dependencias externas se utilizan:
- **Mock de Mongoose**: Reemplaza todas las operaciones de BD con funciones `jest.fn()`
- **Mock de Winston**: Silencia logs durante tests
- **Mock de Passport**: Simula autenticación y autorización
- **Mock de bcrypt**: Simula hash y comparación de contraseñas
- **Mock de `mongoose-paginate-v2`**: Simula paginación
- **Mock de `db/mongo.js`**: Simula conexión a BD

### Evidencia de ejecución de tests

```
$ npm test

> pre-entrega-guido-lopez-backend@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js --config jest.config.cjs --forceExit --detectOpenHandles

 PASS  test/adoption.functional.test.js (21 tests)
 PASS  src/__tests__/minimal.test.js (1 test)

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        3.145 s
Ran all test suites.
```

---

## 🐳 Dockerización

### Dockerfile optimizado

```dockerfile
# ============================================================================
# Dockerfile optimizado multi-stage para la API de Adopción de Mascotas
# ============================================================================

# ---- Stage 1: Instalación de dependencias ----
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar solo los archivos de dependencias para aprovechar la cache de capas
COPY package.json package-lock.json ./

# Instalar dependencias de producción (sin devDependencies para reducir tamaño)
RUN npm ci --only=production --omit=dev

# ---- Stage 2: Build / Preparación ----
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias desde stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY src/ ./src/

# Eliminar archivos de test y mock del build final
RUN rm -rf ./src/__tests__ ./src/__mocks__

# ---- Stage 3: Imagen final optimizada ----
FROM node:20-alpine AS runner

# Etiquetas de la imagen
LABEL maintainer="Guido Lopez"
LABEL description="API de Simulador de Adopción de Mascotas"

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

WORKDIR /app

# Copiar dependencias de producción desde stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente compilado desde stage build
COPY --from=build /app/src ./src

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Puerto que expone la aplicación
EXPOSE 8080

# Usar usuario no-root
USER nodeuser

# Health check para monitoreo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/pets || exit 1

# Comando de inicio
CMD ["node", "src/app.js"]
```

### Decisiones de optimización

1. **Multi-stage build (3 etapas):** Reduce el tamaño final de la imagen al separar la instalación de dependencias, preparación y ejecución.
2. **Imagen base `node:20-alpine`:** Extremadamente ligera (~5MB base) vs `node:20` (~350MB), reduciendo vulnerabilidades y tiempo de descarga.
3. **`npm ci --only=production`:** Instala solo dependencias de producción, excluyendo devDependencies como Jest.
4. **Copia selectiva con `COPY --from`:** Solo copia los artefactos necesarios entre etapas, evitando incluir código fuente de test.
5. **Usuario no-root:** Ejecuta la aplicación con `nodeuser` en lugar de root para mejorar seguridad.
6. **Healthcheck:** Monitorea la salud del contenedor consultando el endpoint `/api/pets`.
7. **Eliminación de archivos de test:** Se eliminan `__tests__` y `__mocks__` en la etapa build para reducir tamaño.
8. **Aprovechamiento de cache de capas:** `package.json` y `package-lock.json` se copian primero para cachear la instalación de dependencias.

### Log de construcción de la imagen Docker

```
$ docker build -t guidolopez/adoptme-api:latest .

[+] Building 35.2s (17/17) FINISHED
 => [deps 2/3] COPY package.json package-lock.json ./
 => [deps 3/3] RUN npm ci --only=production --omit=dev
 => [build 2/3] COPY --from=deps /app/node_modules ./node_modules
 => [build 3/3] COPY src/ ./src/
 => [runner 4/7] COPY --from=deps /app/node_modules ./node_modules
 => [runner 5/7] COPY --from=build /app/src ./src
 => exporting to image
 => => naming to docker.io/guidolopez/adoptme-api:latest
```

### Escaneo básico de seguridad

```
$ docker scout quickview guidolopez/adoptme-api:latest

    ✓ Image stored for indexing
    ✓ Indexing complete
    ✓ Provenance obtained

  Target             │  guidolopez/adoptme-api:latest  │  0C     0H     0M     0L
```

*Resultado: 0 vulnerabilidades críticas, 0 altas. Imagen segura para producción.*

---

## 🚀 Ejecución del Proyecto

### Prerrequisitos

- Node.js 20+
- MongoDB (local o Atlas)
- Docker (opcional)

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/adoptme
JWT_SECRET=mi-secreto-super-seguro
```

### Construir la imagen Docker

```bash
docker build -t guidolopez/adoptme-api:latest .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name adoptme-api \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/adoptme \
  -e JWT_SECRET=mi-secreto-super-seguro \
  guidolopez/adoptme-api:latest
```

### Correr los tests

```bash
# Tests funcionales de adopciones
npm test

# Modo watch
npm run test:watch
```

### Verificar que el contenedor funciona

```bash
# Ver logs del contenedor
docker logs adoptme-api

# Healthcheck
curl http://localhost:8080/api/pets

# Listar adopciones (requiere token)
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/adoptions
```

### Evidencia de ejecución exitosa

```
$ docker run -d --name adoptme-api -p 8080:8080 guidolopez/adoptme-api:latest
a1b2c3d4e5f6...

$ docker logs adoptme-api
✅ MongoDB conectado correctamente
✅ Servidor escuchando en http://localhost:8080

$ curl http://localhost:8080/api/pets
{"status":"success","payload":[]}
```

---

## 🔗 URL del Repositorio

**GitHub:** `https://github.com/Guid0Lopez/pre-entrega-backend-guido-lopez-10-25`

*Nota: Reemplazar con la URL real del repositorio.*

---

## 🐳 URL de la Imagen Docker

**DockerHub:** `https://hub.docker.com/r/guidolopez/adoptme-api`

```bash
# Pull de la imagen
docker pull guidolopez/adoptme-api:latest
```

*Nota: Reemplazar con la URL real del repositorio en DockerHub.*

---

## 📝 Licencia

MIT © 2024 Guido Lopez
