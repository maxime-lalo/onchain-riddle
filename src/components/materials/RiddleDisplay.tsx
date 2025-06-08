import { useReadOnchainRiddle } from "@/hooks/WagmiGenerated";

export default function RiddleDisplay() {
    const { data: riddle, isLoading, error } = useReadOnchainRiddle();

    if (isLoading) return <p>Loading riddle...</p>;
    if (error) return <p>Error fetching riddle</p>;
    if (!riddle) return <p>No riddle found</p>;

    return (
        <p>
            <strong>Riddle:</strong> {riddle}
        </p>
    );
}
