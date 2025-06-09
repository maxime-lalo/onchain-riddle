# Étape 1 : build de l'app avec pnpm workspace
FROM node:20-alpine AS build

# Active corepack pour pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copie les fichiers de configuration pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/

# Installe toutes les dépendances avec pnpm workspace
RUN pnpm install --frozen-lockfile

# Copie le code source
COPY . .

# Build args pour le frontend et backend
ARG VITE_CONTRACT_ADDRESS
ARG VITE_RPC_URL
ARG PRIVATE_KEY

ENV VITE_CONTRACT_ADDRESS=$VITE_CONTRACT_ADDRESS
ENV VITE_RPC_URL=$VITE_RPC_URL
ENV PRIVATE_KEY=$PRIVATE_KEY

# Build le backend et le frontend
RUN pnpm --filter @onchain-riddle/backend build
RUN pnpm --filter onchain-riddle build

# Étape 2 : serveur NGINX avec background service
FROM node:20-alpine

# Install supervisor and http-server
RUN apk add --no-cache supervisor
RUN npm install -g http-server

# Copy built frontend
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Copy entire workspace to preserve pnpm structure
COPY --from=build /app/packages /app/packages
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/shared /app/shared
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml

# Create supervisor config and nginx log directories
RUN mkdir -p /etc/supervisor/conf.d /var/log/nginx
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisord.log
pidfile=/var/run/supervisord.pid

[program:frontend]
command=http-server /usr/share/nginx/html -p 3564 -c-1 --cors
autostart=true
autorestart=true
stderr_logfile=/var/log/frontend.err.log
stdout_logfile=/var/log/frontend.out.log

[program:backend]
command=node packages/backend/dist/index.js
directory=/app
autostart=true
autorestart=true
stderr_logfile=/var/log/backend.err.log
stdout_logfile=/var/log/backend.out.log
environment=VITE_CONTRACT_ADDRESS="%(ENV_VITE_CONTRACT_ADDRESS)s",VITE_RPC_URL="%(ENV_VITE_RPC_URL)s",PRIVATE_KEY="%(ENV_PRIVATE_KEY)s"
EOF

EXPOSE 3564

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]