import { useReadOnchainRiddleRiddle } from "@/hooks/WagmiGenerated";

export default function RiddleDisplay() {
    const { data: riddle, isLoading, error } = useReadOnchainRiddleRiddle();

    console.log("Riddle data:", riddle);
    if (isLoading) return <p>Loading riddle...</p>;
    if (error) return <p>Error fetching riddle</p>;
    if (!riddle) return <p>No riddle found</p>;

    return (
        <p>
            <strong>Riddle:</strong> {riddle}
        </p>
    );
}
