import { useState, useEffect, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useNavigate } from "react-router-dom";
import { keccak256, toUtf8Bytes } from "ethers";
import Swal from "sweetalert2";
import { useSimulateOnchainRiddleSetRiddle } from "@/hooks/WagmiGenerated";

export default function SetRiddleForm() {
    const navigate = useNavigate();
    const [riddleText, setRiddleText] = useState("");
    const [answerText, setAnswerText] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
    const [isProcessing, setIsProcessing] = useState(false);

    const answerHash =
        answerText && riddleText
            ? keccak256(toUtf8Bytes(answerText))
            : undefined;

    const { data: simulation, error: simulateError } =
        useSimulateOnchainRiddleSetRiddle({
            args: [riddleText, answerHash! as `0x${string}`],
            query: {
                enabled: Boolean(riddleText && answerHash && isProcessing),
            },
        });

    const { writeContract, isPending, error: writeError } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        {
            hash: txHash,
        }
    );

    // Handle simulation errors
    useEffect(() => {
        if (simulateError) {
            Swal.fire({
                title: "Simulation error",
                text: simulateError.message,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }, [simulateError]);

    // Handle write errors
    useEffect(() => {
        if (writeError) {
            Swal.fire({
                title: "Transaction error",
                text: writeError.message,
                icon: "error",
                confirmButtonText: "OK",
            });
            setIsProcessing(false);
        }
    }, [writeError]);

    // Handle transaction confirmation
    useEffect(() => {
        if (isConfirming) {
            Swal.fire({
                title: "Setting riddle...",
                text: "Waiting for blockchain confirmation",
                icon: "info",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        }
    }, [isConfirming]);

    // Handle success
    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                title: "Success! 🎉",
                text: "Riddle set successfully!",
                icon: "success",
                confirmButtonText: "Go to Home",
                confirmButtonColor: "#28a745",
            }).then(() => {
                setIsProcessing(false);
                navigate("/");
            });
        }
    }, [isSuccess, navigate]);

    // Handle simulation and write contract
    useEffect(() => {
        if (!simulation || !isProcessing) return;

        if (simulateError) {
            setIsProcessing(false);
            return;
        }

        // Show loading toast when transaction is being sent
        Swal.fire({
            title: "Sending transaction...",
            text: "Please sign the transaction",
            icon: "info",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
        });

        writeContract(simulation.request, {
            onSuccess: (data) => setTxHash(data),
            onError: () => setIsProcessing(false),
        });
    }, [simulation, simulateError, isProcessing, writeContract]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (isProcessing) return;
            setIsProcessing(true);
            // The simulation will trigger automatically via useEffect
            // thanks to the condition enabled: Boolean(riddleText && answerHash && isProcessing)
        },
        [isProcessing]
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Set the riddle</h2>
            <input
                type="text"
                value={riddleText}
                onChange={(e) => setRiddleText(e.target.value)}
                placeholder="Riddle text"
                required
                disabled={isPending || isConfirming || isProcessing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <input
                type="text"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Answer"
                required
                disabled={isPending || isConfirming || isProcessing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
                type="submit"
                disabled={
                    !riddleText.trim() ||
                    !answerText.trim() ||
                    isPending ||
                    isConfirming ||
                    isProcessing
                }
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {isPending || isConfirming || isProcessing
                    ? "Processing..."
                    : "Set Riddle"}
            </button>
        </form>
    );
}
