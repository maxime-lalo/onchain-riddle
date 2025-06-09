import { useReadOnchainRiddleIsActive } from "@/hooks/WagmiGenerated";
import type { ReactNode } from "react";

interface IProps {
    children: ReactNode;
    not?: boolean;
}

export default function IsContractActive({ children, not = false }: IProps) {
    const { data: isActive } = useReadOnchainRiddleIsActive();

    if (not && isActive) return null;
    if (!not && !isActive) return null;

    return <>{children}</>;
}
