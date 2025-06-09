import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useContractStore } from "@/hooks/useContractStore";
interface RequireWalletProps {
    children: ReactNode;
}

export default function RequireContractActive({
    children,
}: RequireWalletProps) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { state } = useContractStore();
    useEffect(() => {
        if (!state.isActive) {
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [state.isActive]);

    if (shouldRedirect) return <Navigate to="/" replace />;

    if (!state.isActive) return <p>⛔ The contract is not active</p>;
    return <>{children}</>;
}
