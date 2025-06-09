import { createContext } from "react";

interface ContractState {
    isActive: boolean;
    isLoading: boolean;
    error: Error | null;
}

interface ContractStoreContextType {
    state: ContractState;
    refetch: () => void;
}

export const ContractStoreContext =
    createContext<ContractStoreContextType | null>(null);

export type { ContractState, ContractStoreContextType };
