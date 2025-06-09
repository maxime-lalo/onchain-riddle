# 🧩 OnChain Riddle

**[🇺🇸 English version](README.md)**

Une application Web3 complète permettant de créer et résoudre des énigmes stockées sur la blockchain Ethereum, avec un système de récompenses automatique.

## 🌟 Fonctionnalités

-   **🎯 Interface utilisateur moderne** - React 19 + TypeScript + Vite
-   **🔗 Intégration blockchain complète** - Wagmi + RainbowKit + Viem
-   **🤖 Backend automatisé** - Service TypeScript avec monitoring des événements
-   **🏆 Système de récompenses** - Détection automatique des gagnants
-   **🐳 Déploiement containerisé** - Docker + Docker Compose
-   **🌐 Support multi-réseaux** - Ethereum mainnet, Sepolia testnet
-   **📱 Design responsive** - Optimisé mobile et desktop

## 🏗️ Architecture

```
onchain-riddle/
├── packages/
│   ├── frontend/          # Application React (Vite + TypeScript)
│   └── backend/           # Service Node.js (TypeScript + Viem)
├── shared/
│   └── contracts/         # ABIs partagés
├── docker-compose.yml     # Configuration développement
└── Dockerfile            # Image multi-stage
```

## 📦 Technologies

### Frontend

-   **React 19** - Framework UI avec les dernières fonctionnalités
-   **TypeScript 5.8** - Typage statique fort
-   **Vite 6.3** - Build tool rapide et moderne
-   **Wagmi 2.15** - Hooks React pour Ethereum
-   **RainbowKit 2.2** - Connexion wallet élégante
-   **Viem 2.31** - Client Ethereum TypeScript-first
-   **React Router 7.6** - Routage SPA
-   **Sass 1.89** - Styles CSS avancés
-   **SweetAlert2 11.22** - Notifications utilisateur

### Backend

-   **Node.js 20** - Runtime JavaScript
-   **TypeScript 5.8** - Typage statique
-   **Viem 2.31** - Interaction blockchain
-   **tsx 4.0** - Exécution TypeScript en développement

### Infrastructure

-   **Docker** - Containerisation
-   **Docker Compose** - Orchestration multi-services
-   **http-server** - Serveur statique pour le frontend
-   **Supervisor** - Gestion des processus en parallèle

## 🚀 Installation

### Prérequis

-   **Node.js** >= 20.0.0
-   **pnpm** >= 8.0.0
-   **Docker** (optionnel, pour la containerisation)

### Installation locale

```bash
# Cloner le repository
git clone <repository-url>
cd onchain-riddle

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

### Configuration .env

```bash
# Contract Configuration
VITE_CONTRACT_ADDRESS=0xa2EaC3FB4422F34a2FdE73D6c801E1EDA38B267E
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Backend Configuration
PRIVATE_KEY=your_private_key_here
```

## 🛠️ Développement

### Scripts disponibles

```bash
# Développement
pnpm run dev                 # Démarre frontend + backend en parallèle
pnpm run dev:frontend        # Frontend uniquement (port 5173)
pnpm run dev:backend         # Backend uniquement

# Build
pnpm run build              # Build tous les packages
pnpm run build:frontend     # Build frontend uniquement
pnpm run build:backend      # Build backend uniquement

# Docker - Développement
pnpm run docker:dev         # Build + Run en mode développement
pnpm run docker:up          # Démarre les containers
pnpm run docker:down        # Arrête les containers
pnpm run docker:logs        # Affiche les logs

# Docker - Déploiement
pnpm run docker:build       # Build l'image Docker
pnpm run docker:deploy      # Tag + Push vers Docker Hub
pnpm run release            # Build + Deploy complet
```

## 📁 Structure des packages

### Frontend (`packages/frontend/`)

```
src/
├── components/           # Composants React
│   ├── elements/        # Composants de base (Header, etc.)
│   ├── materials/       # Composants métier (Forms, Display)
│   └── wrappers/        # HOCs et wrappers logiques
├── hooks/              # Hooks personnalisés + Wagmi généré
├── stores/             # State management
├── config/             # Configuration contracts
└── pages/              # Pages de l'application
```

### Backend (`packages/backend/`)

```
src/
├── index.ts            # Point d'entrée principal
└── types/              # Définitions TypeScript
    ├── contract.ts     # Types des contrats
    ├── environment.ts  # Variables d'environnement
    └── service.ts      # Types des services
```

## 🎯 Fonctionnement

### Frontend

1. **Connexion wallet** via RainbowKit
2. **Interface riddle** pour créer/résoudre des énigmes
3. **Monitoring temps réel** des événements blockchain

### Backend

1. **Monitoring continu** des événements Winner 🏆
2. **Logs enrichis** avec emojis pour debugging 📋🌐🚀
3. **Gestion d'erreurs** robuste avec retry automatique

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

-   **Issues**: GitHub Issues
-   **Docker Hub**: `myzall/onchain-riddle`
-   **Production**: `https://riddle.eplp.fr`

---

**Développé avec ❤️ et TypeScript**
