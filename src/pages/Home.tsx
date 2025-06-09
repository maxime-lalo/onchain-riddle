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
                <p>
                    ⛔ The contract is not active. Please wait for the owner to
                    activate it.
                </p>
            </IsContractActive>
            <LastWinnerDisplay />
        </div>
    );
}
