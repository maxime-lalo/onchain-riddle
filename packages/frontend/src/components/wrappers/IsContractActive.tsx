import { useContractStore } from "@/hooks/useContractStore";
import type { ReactNode } from "react";

interface IProps {
    children: ReactNode;
    not?: boolean;
}

export default function IsContractActive({ children, not = false }: IProps) {
    const { state } = useContractStore();

    if (not && state.isActive) return null;
    if (!not && !state.isActive) return null;

    return <>{children}</>;
}
