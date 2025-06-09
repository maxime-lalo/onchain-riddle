import { useState, useEffect, useRef, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    useSimulateOnchainRiddleSubmitAnswer,
    useWatchOnchainRiddleEvent,
} from "@/hooks/WagmiGenerated";

type AnswerAttemptArgs = {
    user: `0x${string}`;
    correct: boolean;
};

export default function AnswerRiddleForm() {
    const navigate = useNavigate();
    const [answer, setAnswer] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const processedTxHashes = useRef<Set<string>>(new Set());

    const { data: simulation, error: simulateError } =
        useSimulateOnchainRiddleSubmitAnswer({
            args: [answer],
            query: {
                enabled: isProcessing,
            },
        });

    const { writeContract, isPending, error: writeError } = useWriteContract();

    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: txHash ?? undefined,
    });

    useWatchOnchainRiddleEvent({
        enabled: Boolean(txHash), // Only when a transaction is in progress
        onLogs(logs) {
            const newLogs = logs.filter(
                (log) =>
                    log.transactionHash === txHash &&
                    !processedTxHashes.current.has(log.transactionHash)
            );

            if (newLogs.length === 0) return;

            // Mark all new logs as processed
            newLogs.forEach((log) => {
                processedTxHashes.current.add(log.transactionHash);
            });

            // Check if we have a Winner event in the logs
            const winnerLog = newLogs.find((log) => log.eventName === "Winner");
            const answerAttemptLog = newLogs.find(
                (log) => log.eventName === "AnswerAttempt"
            );

            if (winnerLog) {
                // If there's a Winner event, show the congratulations message
                Swal.fire({
                    title: "🏆 CONGRATULATIONS! 🏆",
                    html: `
                        <div style="text-align: center;">
                            <div style="font-size: 4rem; margin: 20px 0;">🎊</div>
                            <p style="font-size: 1.2rem; margin-bottom: 10px;">
                                You won the riddle!
                            </p>
                            <p style="color: #666;">
                                You are the first to find the correct answer!
                            </p>
                        </div>
                    `,
                    icon: "success",
                    confirmButtonText: "Fantastic!",
                    confirmButtonColor: "#28a745",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showClass: {
                        popup: "animate__animated animate__jackInTheBox",
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOut",
                    },
                }).then(() => {
                    setAnswer("");
                    setIsProcessing(false);
                    navigate("/");
                });
                return;
            } else if (answerAttemptLog) {
                // If there's only an AnswerAttempt event (no Winner), process it
                const { correct } = answerAttemptLog.args as AnswerAttemptArgs;

                if (correct) {
                    Swal.fire({
                        title: "Correct answer! 🎉 But...",
                        text: "Someone won before you.",
                        icon: "warning",
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(() => {
                        setAnswer("");
                        setIsProcessing(false);
                        navigate("/");
                    });
                } else {
                    setAnswer("");
                    setIsProcessing(false);

                    Swal.fire({
                        title: "Incorrect answer ❌",
                        text: "Try again!",
                        icon: "error",
                        confirmButtonText: "Retry",
                        confirmButtonColor: "#3085d6",
                        allowOutsideClick: true,
                        allowEscapeKey: true,
                    });
                }
            }
        },
    });

    // Error handling with SweetAlert
    useEffect(() => {
        if (writeError) {
            Swal.fire({
                title: "Transaction error",
                text: writeError.message,
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#d33",
            });
            setIsProcessing(false);
        }
    }, [writeError]);

    // Progress toast for confirmation
    useEffect(() => {
        if (!isConfirming) return;
        Swal.fire({
            title: "Transaction in progress...",
            text: "Waiting for blockchain confirmation",
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    }, [isConfirming]);

    useEffect(() => {
        if (!simulation) return;
        if (simulateError) {
            Swal.fire({
                title: "Simulation error",
                text: simulateError.message,
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        Swal.fire({
            title: "Sending your answer...",
            text: "Transaction signature in progress",
            icon: "info",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
        });

        writeContract(simulation.request, {
            onSuccess: (data) => {
                setTxHash(data);
                // Clear previous transactions
                processedTxHashes.current.clear();
            },
            onError: () => {
                setIsProcessing(false);
            },
        });
        setIsProcessing(false);
    }, [simulation, simulateError, writeContract]);

    const onAnswerChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(e.target.value);
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || isProcessing) return;

        setIsProcessing(true);
        // The simulation will trigger automatically via useEffect
        // thanks to the condition enabled: Boolean(answerHash && isProcessing)
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3>What is your answer?</h3>

            <input
                type="text"
                value={answer}
                onChange={onAnswerChange}
                placeholder="Your answer..."
                required
                disabled={isProcessing}
            />

            <button
                type="submit"
                disabled={
                    !answer.trim() || isPending || isConfirming || isProcessing
                }
            >
                {isProcessing ? "Processing..." : "Submit"}
            </button>
        </form>
    );
}
