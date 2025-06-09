import { ContractStoreContext } from "@/contexts/ContractStoreContext";
import { useContext } from "react";

export function useContractStore() {
    const context = useContext(ContractStoreContext);
    if (!context) {
        throw new Error(
            "useContractStore must be used within a ContractStoreProvider"
        );
    }
    return context;
}
