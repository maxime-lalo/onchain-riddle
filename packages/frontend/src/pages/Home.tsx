import LastWinnerDisplay from "@/components/materials/LastWinnerDisplay";
import IsContractActive from "@/components/wrappers/IsContractActive";

export default function Home() {
    return (
        <div>
            <h2>Welcome to Onchain Riddle 👋</h2>
            <IsContractActive>
                <p>
                    ✅ The contract is active. You can participate in the riddle
                    by submitting your answer.
                </p>
            </IsContractActive>
            <IsContractActive not>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>📝 The next riddle is coming, please wait...</p>
                </div>
            </IsContractActive>
            <LastWinnerDisplay />
        </div>
    );
}
