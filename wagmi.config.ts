import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import OnchainRiddle from "./config/abis/OnchainRiddle.json";
import type { Abi } from "viem";

// Use environment variable if available, fallback to JSON address

export default defineConfig({
    out: "src/hooks/WagmiGenerated.ts",
    contracts: [
        {
            name: "OnchainRiddle",
            abi: OnchainRiddle.abi as Abi,
            address: process.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
        },
    ],
    plugins: [react()],
});
