import { useAccount } from "wagmi";
import type { ReactNode } from "react";

interface IProps {
    children: ReactNode;
    not?: boolean;
}

export default function IsConnected({ children, not = false }: IProps) {
    const { address } = useAccount();

    if (not && address) return null;
    if (!not && !address) return null;
    // If the user is connected and not negating, or not connected and negating, render children

    return <>{children}</>;
}
