# Onchain Riddle - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technical Architecture](#technical-architecture)
3. [Installation and Setup](#installation-and-setup)

## 🎯 Overview

**Onchain Riddle** is a decentralized application (dApp) that allows users to participate in blockchain-based riddle games on the Ethereum network. The first player to solve the riddle wins the round.

### Key Features

-   **For Players**:

    -   Wallet connection via RainbowKit
    -   View active riddles
    -   Submit answers with real-time feedback
    -   Instant win/loss notifications

-   **For Administrator (Bot wallet)**:
    -   Create new riddles

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend

-   **Framework**: React 19 + TypeScript + Vite 6
-   **Styling**: SCSS/Sass modules
-   **Routing**: React Router DOM v7
-   **UI/UX**: SweetAlert2 for notifications

#### Blockchain

-   **Integration**: wagmi v2 + viem + RainbowKit
-   **Cryptography**: Ethers.js v6
-   **Network**: Ethereum Sepolia testnet
-   **RPC**: Infura endpoint

#### Development Tools

-   **Build**: Vite, TypeScript ~5.8
-   **Quality**: ESLint v9
-   **Pattern Matching**: ts-pattern

## 🚀 Installation and Setup

### Prerequisites

-   Node.js ≥ 18
-   pnpm (package manager)
-   Compatible wallet (MetaMask, WalletConnect, etc.)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd onchain-riddle

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values
# Then start development server
pnpm dev
```

### Environment Variables

Create a `.env` file based on `.env.exemple`:

```env
# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0x9D26cbcd2B10B5A4Dbe855c611a9d66D82c57663
VITE_RPC_URL=https://sepolia.infura.io/v3
```
