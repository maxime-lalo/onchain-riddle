import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import OnchainRiddle from "../../shared/contracts/OnchainRiddle.json";
import type { Abi } from "viem";

export default defineConfig({
    out: "src/hooks/WagmiGenerated.ts",
    contracts: [
        {
            name: "OnchainRiddle",
            abi: OnchainRiddle.abi as Abi,
            // Ne pas spécifier d'adresse ici pour qu'elle soit lue dynamiquement
        },
    ],
    plugins: [react()],
});
