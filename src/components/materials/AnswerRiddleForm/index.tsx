import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, toUtf8Bytes } from "ethers";
import { useSimulateOnchainRiddleSubmitAnswer } from "@/hooks/WagmiGenerated";

export default function AnswerRiddleForm() {
    const [answerText, setAnswerText] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    const answerHash = answerText
        ? keccak256(toUtf8Bytes(answerText))
        : undefined;

    const { data: simulation, error: simulateError } =
        useSimulateOnchainRiddleSubmitAnswer({
            args: [answerHash! as `0x${string}`],
            query: {
                enabled: Boolean(answerHash),
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
            <h3>What's your answer ?</h3>
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
                Answer
            </button>

            {simulateError && <p>Simulation error: {simulateError.message}</p>}
            {writeError && <p>Transaction error: {writeError.message}</p>}
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isSuccess && <p>✅ Answer submitted successfully!</p>}
        </form>
    );
}
