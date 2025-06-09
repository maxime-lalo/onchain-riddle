import { useState, useEffect, useRef, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, toUtf8Bytes } from "ethers";
import Swal from "sweetalert2";
import {
    useSimulateOnchainRiddleSubmitAnswer,
    useWatchOnchainRiddleEvent,
} from "@/hooks/WagmiGenerated";
import * as P from "ts-pattern";

type AnswerAttemptArgs = {
    user: `0x${string}`;
    correct: boolean;
};

export default function AnswerRiddleForm() {
    const [answerText, setAnswerText] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const [answerHash, setAnswerHash] = useState<`0x${string}` | null>(null);

    const processedTxHashes = useRef<Set<string>>(new Set());

    const { data: simulation, error: simulateError } =
        useSimulateOnchainRiddleSubmitAnswer({
            args: [answerHash! as `0x${string}`],
            query: {
                enabled: Boolean(answerHash && isProcessing),
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

            const latestLog = newLogs[newLogs.length - 1];

            if (latestLog) {
                processedTxHashes.current.add(latestLog.transactionHash);

                P.match(latestLog)
                    .with({ eventName: "AnswerAttempt" }, (log) => {
                        const { correct } = log.args as AnswerAttemptArgs;

                        if (correct) {
                            // Correct answer - wait to see if we win
                            Swal.fire({
                                title: "Correct answer! 🎉",
                                text: "Checking if you are the first...",
                                icon: "success",
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                            });

                            // Safety timeout in case the Winner event doesn't trigger
                            setTimeout(() => {
                                Swal.fire({
                                    title: "Correct answer! ✅",
                                    text: "Someone else may have won before you.",
                                    icon: "info",
                                    confirmButtonText: "OK",
                                    confirmButtonColor: "#3085d6",
                                }).then(() => {
                                    setAnswerText("");
                                    setIsProcessing(false);
                                });
                            }, 5000);
                        } else {
                            // Incorrect answer
                            setAnswerText("");
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
                    })
                    .with({ eventName: "Winner" }, () => {
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
                        });
                    })
                    .with({ eventName: "RiddleSet" }, () => null)
                    .exhaustive();
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
                setAnswerHash(null);
            },
        });
        setIsProcessing(false);
        setAnswerHash(null);
    }, [simulation, simulateError, writeContract]);

    const onAnswerChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setAnswerText(e.target.value);
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answerText.trim() || isProcessing) return;

        setIsProcessing(true);

        // Calculate the answer hash
        const hash = keccak256(toUtf8Bytes(answerText.trim())) as `0x${string}`;
        setAnswerHash(hash);

        // The simulation will trigger automatically via useEffect
        // thanks to the condition enabled: Boolean(answerHash && isProcessing)
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3>What is your answer?</h3>

            <input
                type="text"
                value={answerText}
                onChange={onAnswerChange}
                placeholder="Your answer..."
                required
                disabled={isProcessing}
            />

            <button
                type="submit"
                disabled={
                    !answerText.trim() ||
                    isPending ||
                    isConfirming ||
                    isProcessing
                }
            >
                {isProcessing ? "Processing..." : "Submit"}
            </button>
        </form>
    );
}
