import { useReadOnchainRiddleRiddle } from "@/hooks/WagmiGenerated";
import { CONTRACT_ADDRESS } from "@/config/contracts";

export default function RiddleDisplay() {
    const { data: riddle, isLoading, error } = useReadOnchainRiddleRiddle({
        address: CONTRACT_ADDRESS,
    });

    if (isLoading) return <p>Loading riddle...</p>;
    if (error) return <p>Error fetching riddle</p>;
    if (!riddle) return <p>No riddle found</p>;

    return <h2>{riddle}</h2>;
}
