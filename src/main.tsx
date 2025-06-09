import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "@/router";
import { ContractStoreProvider } from "./stores/ContractStore";

const config = getDefaultConfig({
    appName: "Onchain Riddle",
    projectId: "demo",
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(import.meta.env.VITE_RPC_URL),
    },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <ContractStoreProvider>
                        <Router />
                    </ContractStoreProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
);
