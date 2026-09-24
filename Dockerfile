# syntax=docker/dockerfile:1
FROM node:20-slim AS build
WORKDIR /app

# Install backend production dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

# Install frontend dependencies (incl. dev, needed to build)
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

# Build the frontend SPA
COPY frontend ./frontend
RUN cd frontend && npm run build-only

# Runtime image
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist
COPY backend/Database /app/backend/Database
EXPOSE 3000
CMD ["sh", "-c", "node backend/init-db.js && node backend/server.js"]