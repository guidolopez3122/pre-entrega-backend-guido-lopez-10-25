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
