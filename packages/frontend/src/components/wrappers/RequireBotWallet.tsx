import { useEffect, useState, type ReactNode } from "react";
import { useAccount } from "wagmi";
import { Navigate } from "react-router-dom";
import { useReadOnchainRiddleBot } from "@/hooks/WagmiGenerated";
interface RequireWalletProps {
    children: ReactNode;
}

export default function RequireWallet({ children }: RequireWalletProps) {
    const { address, isConnected, isConnecting } = useAccount();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { data: botAddress } = useReadOnchainRiddleBot();

    useEffect(() => {
        if (!isConnecting && !isConnected) {
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
        if (
            isConnected &&
            address &&
            botAddress &&
            address.toLowerCase() !== botAddress.toLowerCase()
        ) {
            setShouldRedirect(true);
        }
    }, [address, botAddress, isConnected, isConnecting]);

    if (isConnecting) return <p>Checking connection...</p>;

    if (shouldRedirect) return <Navigate to="/" replace />;

    if (!isConnected)
        return <p>⛔ You must be bot wallet to access this page</p>;

    return <>{children}</>;
}
