import { useReadOnchainRiddleWinner } from "@/hooks/WagmiGenerated";
import { CONTRACT_ADDRESS } from "@/config/contracts";

export default function LastWinnerDisplay() {
    const {
        data: winner,
        isLoading: isWinnerLoading,
        error: winnerError,
    } = useReadOnchainRiddleWinner({
        address: CONTRACT_ADDRESS,
    });

    if (isWinnerLoading) return <p>Loading last winner...</p>;
    if (winnerError)
        return (
            <p>
                Error fetching winner
                {winnerError!.message}
            </p>
        );

    return (
        <div>
            <h2>Last Winner</h2>
            <p>
                <strong>
                    {!winner ||
                    winner === "0x0000000000000000000000000000000000000000"
                        ? "No winner yet."
                        : winner}
                </strong>
            </p>
        </div>
    );
}
