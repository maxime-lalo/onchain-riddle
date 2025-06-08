import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import OnchainRiddle from "./config/abis/OnchainRiddle.json";
import type { Abi } from "viem";
export default defineConfig({
    out: "src/hooks/WagmiGenerated.ts",
    contracts: [
        {
            name: "OnchainRiddle",
            abi: OnchainRiddle.abi as Abi,
            address: OnchainRiddle.address as `0x${string}`,
        },
    ],
    plugins: [react()],
});
