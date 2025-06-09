import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useReadOnchainRiddleIsActive } from "@/hooks/WagmiGenerated";
interface RequireWalletProps {
    children: ReactNode;
}

export default function RequireContractActive({
    children,
}: RequireWalletProps) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { data: isActive } = useReadOnchainRiddleIsActive();

    useEffect(() => {
        if (!isActive) {
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    if (shouldRedirect) return <Navigate to="/" replace />;

    if (!isActive) return <p>⛔ The contract is not active</p>;
    return <>{children}</>;
}
