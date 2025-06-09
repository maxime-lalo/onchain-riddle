import { useReadOnchainRiddleIsActive } from "@/hooks/WagmiGenerated";
import type { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

export default function IsContractActive({ children }: IProps) {
    const { data: isActive } = useReadOnchainRiddleIsActive();

    if (!isActive) return null;

    return <>{children}</>;
}
