# 🧩 OnChain Riddle

**[🇫🇷 Version française](README.fr.md)**

A complete Web3 application for creating and solving riddles stored on the Ethereum blockchain, with an automatic reward system.

## 🌟 Features

-   **🎯 Modern user interface** - React 19 + TypeScript + Vite
-   **🔗 Complete blockchain integration** - Wagmi + RainbowKit + Viem
-   **🤖 Automated backend** - TypeScript service with event monitoring
-   **🏆 Reward system** - Automatic winner detection
-   **🐳 Containerized deployment** - Docker + Docker Compose
-   **🌐 Multi-network support** - Ethereum mainnet, Sepolia testnet
-   **📱 Responsive design** - Mobile and desktop optimized

## 🏗️ Architecture

```
onchain-riddle/
├── packages/
│   ├── frontend/          # React Application (Vite + TypeScript)
│   └── backend/           # Node.js Service (TypeScript + Viem)
├── shared/
│   └── contracts/         # Shared ABIs
├── docker-compose.yml     # Development configuration
└── Dockerfile            # Multi-stage image
```

## 📦 Technologies

### Frontend

-   **React 19** - UI framework with latest features
-   **TypeScript 5.8** - Strong static typing
-   **Vite 6.3** - Fast and modern build tool
-   **Wagmi 2.15** - React hooks for Ethereum
-   **RainbowKit 2.2** - Elegant wallet connection
-   **Viem 2.31** - TypeScript-first Ethereum client
-   **React Router 7.6** - SPA routing
-   **Sass 1.89** - Advanced CSS styles
-   **SweetAlert2 11.22** - User notifications

### Backend

-   **Node.js 20** - JavaScript runtime
-   **TypeScript 5.8** - Static typing
-   **Viem 2.31** - Blockchain interaction
-   **tsx 4.0** - TypeScript execution in development

### Infrastructure

-   **Docker** - Containerization
-   **Docker Compose** - Multi-service orchestration
-   **http-server** - Static server for frontend
-   **Supervisor** - Parallel process management

## 🚀 Installation

### Prerequisites

-   **Node.js** >= 20.0.0
-   **pnpm** >= 8.0.0
-   **Docker** (optional, for containerization)

### Local installation

```bash
# Clone the repository
git clone <repository-url>
cd onchain-riddle

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your values
```

### .env Configuration

```bash
# Contract Configuration
VITE_CONTRACT_ADDRESS=0xa2EaC3FB4422F34a2FdE73D6c801E1EDA38B267E
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Backend Configuration
PRIVATE_KEY=your_private_key_here
```

## 🛠️ Development

### Available scripts

```bash
# Development
pnpm run dev                 # Start frontend + backend in parallel
pnpm run dev:frontend        # Frontend only (port 5173)
pnpm run dev:backend         # Backend only

# Build
pnpm run build              # Build all packages
pnpm run build:frontend     # Build frontend only
pnpm run build:backend      # Build backend only

# Docker - Development
pnpm run docker:dev         # Build + Run in development mode
pnpm run docker:up          # Start containers
pnpm run docker:down        # Stop containers
pnpm run docker:logs        # Show logs

# Docker - Deployment
pnpm run docker:build       # Build Docker image
pnpm run docker:deploy      # Tag + Push to Docker Hub
pnpm run release            # Complete Build + Deploy
```

## 📁 Package structure

### Frontend (`packages/frontend/`)

```
src/
├── components/           # React components
│   ├── elements/        # Base components (Header, etc.)
│   ├── materials/       # Business components (Forms, Display)
│   └── wrappers/        # HOCs and logical wrappers
├── hooks/              # Custom hooks + Generated Wagmi
├── stores/             # State management
├── config/             # Contract configuration
└── pages/              # Application pages
```

### Backend (`packages/backend/`)

```
src/
├── index.ts            # Main entry point
└── types/              # TypeScript definitions
    ├── contract.ts     # Contract types
    ├── environment.ts  # Environment variables
    └── service.ts      # Service types
```

## 🎯 How it works

### Frontend

1. **Wallet connection** via RainbowKit
2. **Riddle interface** for creating/solving riddles
3. **Real-time monitoring** of blockchain events

### Backend

1. **Continuous monitoring** of Winner events 🏆
2. **Enriched logs** with emojis for debugging 📋🌐🚀
3. **Robust error handling** with automatic retry

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🆘 Support

-   **Issues**: GitHub Issues
-   **Docker Hub**: `myzall/onchain-riddle`
-   **Production**: `https://riddle.eplp.fr`

---

**Built with ❤️ and TypeScript**
