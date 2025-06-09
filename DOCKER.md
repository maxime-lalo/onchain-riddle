# 🐳 Docker Deployment Guide

This guide explains how to deploy the OnChain Riddle application using Docker.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- `.env` file with required environment variables

### Environment Setup

Create a `.env` file in the root directory with:

```bash
# Contract Configuration
VITE_CONTRACT_ADDRESS=0xa2EaC3FB4422F34a2FdE73D6c801E1EDA38B267E
VITE_RPC_URL=https://sepolia.infura.io/v3/your-api-key
PRIVATE_KEY=0x...your-private-key
```

### Deploy the Application

#### Option 1: Using the deploy script (Recommended)
```bash
# Make sure the script is executable
chmod +x deploy.sh

# Deploy
./deploy.sh
```

#### Option 2: Using npm scripts
```bash
# Build and start
pnpm run docker:dev

# Or step by step
pnpm run docker:build
pnpm run docker:up
```

#### Option 3: Using Docker Compose directly
```bash
# Build and start in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## 📊 Application Architecture

The Docker container runs:
- **Frontend**: React app served by Nginx on port 3564
- **Backend**: TypeScript Node.js service processing blockchain events
- **Supervisor**: Process manager to run both services in parallel

### Services Overview

```
┌─────────────────────┐
│   Docker Container  │
├─────────────────────┤
│  Supervisor         │
│  ├─ Nginx (port 3564) │
│  │  └─ Frontend     │
│  └─ Node.js         │
│     └─ Backend      │
└─────────────────────┘
```

## 🔧 Configuration Details

### Environment Variables
- `VITE_CONTRACT_ADDRESS`: Smart contract address on Sepolia
- `VITE_RPC_URL`: Ethereum RPC endpoint for Sepolia testnet
- `PRIVATE_KEY`: Private key for the bot wallet (to set new riddles)

### Ports
- **3564**: Web application (frontend + API)

### Logs
Logs are stored in `./logs` directory:
- `backend.out.log`: Backend stdout
- `backend.err.log`: Backend stderr
- `nginx.out.log`: Nginx stdout
- `nginx.err.log`: Nginx stderr

## 🛠️ Development Commands

```bash
# View logs in real-time
pnpm run docker:logs

# Stop the application
pnpm run docker:down

# Rebuild and restart
pnpm run docker:dev

# Build only (without starting)
pnpm run docker:build
```

## 🔍 Troubleshooting

### Check container status
```bash
docker-compose ps
```

### View specific service logs
```bash
# Backend logs
docker-compose logs backend

# All logs
docker-compose logs -f
```

### Exec into container for debugging
```bash
docker-compose exec onchain-riddle sh
```

### Health Check
The container includes a health check that verifies:
- Nginx is serving the frontend
- Application responds on port 3564

### Common Issues

1. **Environment variables not loaded**
   - Ensure `.env` file exists and contains all required variables
   - Check that variables are properly formatted (no spaces around `=`)

2. **Port already in use**
   - Change the port mapping in `docker-compose.yml`
   - Or stop the conflicting service

3. **Build failures**
   - Clear Docker cache: `docker system prune`
   - Rebuild: `docker-compose build --no-cache`

## 🌐 Access the Application

Once deployed, access the application at:
- **Web Interface**: http://localhost:3564
- **Health Check**: http://localhost:3564/

The backend will automatically:
- 🔍 Monitor blockchain events
- 🧩 Set new riddles when someone wins
- 📝 Log all activities with emojis

## 🛡️ Security Notes

- Keep your `PRIVATE_KEY` secure and never commit it to version control
- Use environment-specific `.env` files for different deployments
- Consider using Docker secrets for production deployments