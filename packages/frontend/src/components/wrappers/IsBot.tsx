import { useAccount } from "wagmi";
import { useReadOnchainRiddleBot } from "@/hooks/WagmiGenerated";
import type { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

export default function IsBot({ children }: IProps) {
    const { address } = useAccount();
    const { data: bot } = useReadOnchainRiddleBot();

    if (!address || !bot || address.toLowerCase() !== bot.toLowerCase())
        return null;

    return <>{children}</>;
}
