# Étape 1 : build de l'app avec pnpm workspace
FROM node:20-alpine AS build

# Active corepack pour pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copie les fichiers de configuration pnpm
COPY package.json pnpm-workspace.yaml ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/

# Installe toutes les dépendances avec pnpm workspace
RUN pnpm install --frozen-lockfile

# Copie le code source
COPY . .

# Build args pour le frontend
ARG VITE_CONTRACT_ADDRESS
ARG VITE_RPC_URL

ENV VITE_CONTRACT_ADDRESS=$VITE_CONTRACT_ADDRESS
ENV VITE_RPC_URL=$VITE_RPC_URL

# Build le backend et le frontend
RUN pnpm --filter @onchain-riddle/backend build
RUN pnpm --filter @onchain-riddle/frontend build

# Étape 2 : serveur NGINX avec background service
FROM node:20-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Copy backend service
COPY --from=build /app/packages/backend /app/backend
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/shared /app/shared

# Create supervisor config
RUN mkdir -p /etc/supervisor/conf.d
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stderr_logfile=/var/log/nginx.err.log
stdout_logfile=/var/log/nginx.out.log

[program:backend]
command=node /app/backend/dist/index.js
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/backend.err.log
stdout_logfile=/var/log/backend.out.log
environment=VITE_CONTRACT_ADDRESS="%(ENV_VITE_CONTRACT_ADDRESS)s",VITE_RPC_URL="%(ENV_VITE_RPC_URL)s",PRIVATE_KEY="%(ENV_PRIVATE_KEY)s"
EOF

EXPOSE 3564

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]