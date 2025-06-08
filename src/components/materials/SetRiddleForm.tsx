import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, toUtf8Bytes } from "ethers";
import { useSimulateOnchainRiddleSetRiddle } from "@/hooks/WagmiGenerated";

export default function SetRiddleForm() {
    const [riddleText, setRiddleText] = useState("");
    const [answerText, setAnswerText] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    const answerHash =
        answerText && riddleText
            ? keccak256(toUtf8Bytes(answerText))
            : undefined;

    const { data: simulation, error: simulateError } =
        useSimulateOnchainRiddleSetRiddle({
            args: [riddleText, answerHash! as `0x${string}`],
            query: {
                enabled: Boolean(riddleText && answerHash),
            },
        });

    const { writeContract, isPending, error: writeError } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        {
            hash: txHash,
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!simulation) return;
        writeContract(simulation.request, {
            onSuccess: (data) => setTxHash(data),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Riddle</h2>
            <input
                type="text"
                value={riddleText}
                onChange={(e) => setRiddleText(e.target.value)}
                placeholder="Riddle text"
                required
            />
            <input
                type="text"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Answer"
                required
            />
            <button
                type="submit"
                disabled={!simulation || isPending || isConfirming}
            >
                Set Riddle
            </button>

            {simulateError && <p>Simulation error: {simulateError.message}</p>}
            {writeError && <p>Transaction error: {writeError.message}</p>}
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isSuccess && <p>✅ Riddle set successfully!</p>}
        </form>
    );
}
