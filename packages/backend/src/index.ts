import { createPublicClient, createWalletClient, http, keccak256, toBytes, type PublicClient, type WalletClient, type Address, type Hash, type Log } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Riddle, ContractABI, IBackgroundService, ServiceState } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: join(__dirname, "../../../.env") });

// Environment validation
if (!process.env.VITE_CONTRACT_ADDRESS || !process.env.VITE_RPC_URL || !process.env.PRIVATE_KEY) {
    throw new Error("🚨 Environment variables VITE_CONTRACT_ADDRESS, VITE_RPC_URL and PRIVATE_KEY must be set");
}

const CONTRACT_ADDRESS: Address = process.env.VITE_CONTRACT_ADDRESS as Address;
const RPC_URL: string = process.env.VITE_RPC_URL;
const PRIVATE_KEY: Hash = process.env.PRIVATE_KEY as Hash;

console.log(`📋 Contract Address loaded: ${CONTRACT_ADDRESS}`);
console.log(`🌐 RPC URL configured: ${RPC_URL}`);
console.log(`🔗 Network: Sepolia testnet`);

// Load contract ABI
const abiPath = join(__dirname, "../../../shared/contracts/OnchainRiddle.json");
const OnchainRiddle: ContractABI = JSON.parse(readFileSync(abiPath, "utf8"));

// Setup clients
const client: PublicClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC_URL),
});

const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient: WalletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(RPC_URL),
});

// Predefined riddles with answers
const RIDDLES: readonly Riddle[] = [
    {
        question: "What has keys but no locks, space but no room, and you can enter but not go inside?",
        answer: "keyboard"
    },
    {
        question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
        answer: "fire"
    },
    {
        question: "The more you take, the more you leave behind. What am I?",
        answer: "footsteps"
    },
    {
        question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answer: "map"
    },
    {
        question: "What can travel around the world while staying in a corner?",
        answer: "stamp"
    },
    {
        question: "I'm tall when I'm young, and short when I'm old. What am I?",
        answer: "candle"
    },
    {
        question: "What has a head, a tail, is brown, and has no legs?",
        answer: "penny"
    },
    {
        question: "What gets wet while drying?",
        answer: "towel"
    },
    {
        question: "What has many teeth, but cannot bite?",
        answer: "zipper"
    },
    {
        question: "I have branches, but no fruit, trunk or leaves. What am I?",
        answer: "bank"
    }
] as const;

let currentRiddleIndex: number = 0;

// Background service
class BackgroundService implements IBackgroundService {
    private state: ServiceState;

    constructor() {
        this.state = {
            isRunning: false,
            unwatchEvents: null
        };
    }

    async start(): Promise<void> {
        if (this.state.isRunning) {
            console.log("⚠️  Background service is already running");
            return;
        }

        console.log("🚀 Starting background service...");
        this.state.isRunning = true;

        // Check if contract is active
        await this.checkAndInitializeContract();

        // Start watching for Winner events
        this.state.unwatchEvents = client.watchContractEvent({
            address: CONTRACT_ADDRESS,
            abi: OnchainRiddle.abi,
            eventName: "Winner",
            onLogs: async (logs: Log[]) => {
                console.log("🏆 Winner event detected!", logs);
                await this.handleWinnerEvent();
            },
        });

        console.log("👂 Event listener started - waiting for Winner events...");
    }

    stop(): void {
        if (this.state.unwatchEvents) {
            this.state.unwatchEvents();
            this.state.unwatchEvents = null;
        }
        this.state.isRunning = false;
        console.log("🛑 Background service stopped");
    }

    async checkAndInitializeContract(): Promise<void> {
        try {
            console.log(`🔍 [${new Date().toISOString()}] Checking contract status...`);

            const isActive = await client.readContract({
                address: CONTRACT_ADDRESS,
                abi: OnchainRiddle.abi,
                functionName: "isActive",
            }) as boolean;

            console.log(`📊 Contract is active: ${isActive}`);

            if (!isActive) {
                console.log("💤 Contract is not active, setting initial riddle...");
                await this.setNewRiddle();
            } else {
                console.log("✅ Contract is active, proceeding to event listening...");
            }
        } catch (error) {
            console.error("❌ Error checking contract status:", error);
        }
    }

    async handleWinnerEvent(): Promise<void> {
        try {
            console.log(`📝 [${new Date().toISOString()}] Processing Winner event...`);
            await this.setNewRiddle();
        } catch (error) {
            console.error("❌ Error handling Winner event:", error);
        }
    }

    async setNewRiddle(): Promise<void> {
        try {
            const riddle: Riddle = RIDDLES[currentRiddleIndex];
            currentRiddleIndex = (currentRiddleIndex + 1) % RIDDLES.length;

            console.log(`🧩 Setting new riddle: "${riddle.question}"`);
            console.log(`🔑 Answer: "${riddle.answer}"`);

            const answerHash: Hash = keccak256(toBytes(riddle.answer));
            console.log(`#️⃣ Answer hash: ${answerHash}`);

            const hash = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: OnchainRiddle.abi,
                functionName: "setRiddle",
                args: [riddle.question, answerHash],
                account: account,
                chain: sepolia,
            });

            console.log(`✨ New riddle set! Transaction hash: ${hash}`);

            const receipt = await client.waitForTransactionReceipt({ hash });
            console.log(`📦 Transaction confirmed in block: ${receipt.blockNumber}`);
        } catch (error) {
            console.error("❌ Error setting new riddle:", error);
        }
    }
}

// Handle graceful shutdown
const backgroundService: BackgroundService = new BackgroundService();

process.on("SIGINT", () => {
    console.log("🚫 Received SIGINT, shutting down gracefully...");
    backgroundService.stop();
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("🚫 Received SIGTERM, shutting down gracefully...");
    backgroundService.stop();
    process.exit(0);
});

// Start the service
backgroundService.start();
console.log("🎉 Background service initialized");