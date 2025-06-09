import React, { useEffect, useState } from "react";
import {
    useReadOnchainRiddleIsActive,
    useWatchOnchainRiddleEvent,
} from "@/hooks/WagmiGenerated";
import {
    ContractStoreContext,
    type ContractState,
    type ContractStoreContextType,
} from "@/contexts/ContractStoreContext";
import { CONTRACT_ADDRESS } from "@/config/contracts";

export function ContractStoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<ContractState>({
        isActive: false,
        isLoading: true,
        error: null,
    });

    const {
        data: isActive,
        isLoading,
        error,
        refetch,
    } = useReadOnchainRiddleIsActive({
        address: CONTRACT_ADDRESS,
        query: {
            refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
            staleTime: 5000, // Considérer les données comme périmées après 5 secondes
        },
    });

    // Écouter les événements du contrat pour détecter les changements d'état
    useWatchOnchainRiddleEvent({
        address: CONTRACT_ADDRESS,
        onLogs: () => {
            // Refetch les données quand un événement est émis
            refetch();
        },
    });

    useEffect(() => {
        setState({
            isActive: Boolean(isActive),
            isLoading,
            error: error as Error | null,
        });
    }, [isActive, isLoading, error]);

    const contextValue: ContractStoreContextType = {
        state,
        refetch,
    };

    return (
        <ContractStoreContext.Provider value={contextValue}>
            {children}
        </ContractStoreContext.Provider>
    );
}
