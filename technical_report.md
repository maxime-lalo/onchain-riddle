# 🧩 OnChain Riddle — Technical Report

## 🎯 Project Overview

**OnChain Riddle** is a complete Web3 application for creating and solving riddles directly stored on the Ethereum blockchain. When a user finds the correct answer, a reward is automatically distributed via a smart contract deployed on the Sepolia network. The project features a modern React-based frontend, seamless wallet integration through RainbowKit, and an automated backend service that listens for `Winner` events on-chain.

---

## 🧱 Technical Approach

### Frontend Stack

-   **React 19** with **TypeScript** and **Vite** for a fast, modular UI.
-   **wagmi 2 + viem** for smart contract interactions, using auto-generated hooks.
-   **RainbowKit** for wallet management, offering multi-network support and a polished UX.
-   **Sass** for styling and **SweetAlert2** for user notifications.

### Backend Stack

-   Lightweight **Node.js** service written in **TypeScript**, using **viem** for Ethereum interactions.
-   Continuous monitoring of on-chain `Winner` events to trigger business logic.
-   Orchestrated using **Docker Compose**, making local development and production deployment straightforward.

### Smart Contract & Deployment

-   The `OnchainRiddle.sol` smart contract is deployed on Sepolia.
-   Configured via `.env` file with contract address and private key for backend operations.

---

## ✅ What Went Well

-   **Wallet connection** was smooth and immediate thanks to RainbowKit.
-   **wagmi + viem integration** was highly ergonomic, especially with the auto-generated, type-safe hooks.
-   **Smart contract deployment** was fast and hassle-free using Hardhat.

---

## ⚠️ Challenges Faced

-   **Public RPC limitations**: Some providers don’t support event subscriptions for free, requiring a fallback to more reliable endpoints.
-   **Heavy polling/simulation**: wagmi’s transaction simulation caused excessive requests to some RPCs, which had to be mitigated.
-   **Asynchronous event handling**: Inconsistencies arose in the backend event flow, leading to race conditions that required better error handling and deduplication.

---

## 💡 Future Improvements

-   **Automatic riddle generation** using a LLM to ensure fresh and dynamic content.
-   **Storing winners off-chain** in a backend to build a visible leaderboard.
-   **Adding submission history** to enrich the user experience.
-   **End-to-end testing** for better stability and confidence.

---

## 🧪 Conclusion

OnChain Riddle demonstrates an effective integration between a modern UI, on-chain logic, and an event-driven backend. The modular project structure (frontend/backend/shared) with Docker reinforces maintainability and enables rapid iteration. The app is fully operational on Sepolia and ready to evolve toward a more feature-rich and dynamic version.
