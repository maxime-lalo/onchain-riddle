import { useReadOnchainRiddleRiddle } from "@/hooks/WagmiGenerated";

export default function RiddleDisplay() {
    const { data: riddle, isLoading, error } = useReadOnchainRiddleRiddle();

    if (isLoading) return <p>Loading riddle...</p>;
    if (error) return <p>Error fetching riddle</p>;
    if (!riddle) return <p>No riddle found</p>;

    return <h2>{riddle}</h2>;
}
