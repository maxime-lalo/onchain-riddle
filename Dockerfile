# Étape 1 : build de l'app Vite avec pnpm
FROM node:20-alpine AS build

# Active corepack pour pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copie tout sauf ce qui est listé dans .dockerignore
COPY . .

# Installe les dépendances et build
RUN pnpm install --frozen-lockfile
ARG VITE_CONTRACT_ADDRESS
ARG VITE_RPC_URL

ENV VITE_CONTRACT_ADDRESS=$VITE_CONTRACT_ADDRESS
ENV VITE_RPC_URL=$VITE_RPC_URL

RUN pnpm build

# Étape 2 : serveur NGINX
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf