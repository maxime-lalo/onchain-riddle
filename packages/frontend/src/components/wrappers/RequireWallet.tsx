import { useEffect, useState, type ReactNode } from "react";
import { useAccount } from "wagmi";
import { Navigate } from "react-router-dom";

interface RequireWalletProps {
    children: ReactNode;
}

export default function RequireWallet({ children }: RequireWalletProps) {
    const { isConnected, isConnecting } = useAccount();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!isConnecting && !isConnected) {
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isConnected, isConnecting]);

    if (isConnecting) return <p>Checking connection...</p>;

    if (shouldRedirect) return <Navigate to="/" replace />;

    if (!isConnected)
        return <p>⛔ Wallet connection required to access this page</p>;

    return <>{children}</>;
}
