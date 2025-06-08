import { useAccount } from "wagmi";
import { useReadOnchainRiddleBot } from "@/hooks/WagmiGenerated";
import type { ReactNode } from "react";

interface IsBotProps {
    children: ReactNode;
}

export default function IsBot({ children }: IsBotProps) {
    const { address, isConnecting, isReconnecting } = useAccount();
    const { data: bot, isLoading } = useReadOnchainRiddleBot();

    if (isConnecting || isReconnecting || isLoading) {
        return <p>Checking permissions...</p>;
    }

    if (!address || !bot || address.toLowerCase() !== bot.toLowerCase()) {
        return (
            <p>
                ⛔ Accès refusé : vous n'êtes pas autorisé à définir une riddle.
            </p>
        );
    }

    return <>{children}</>;
}
