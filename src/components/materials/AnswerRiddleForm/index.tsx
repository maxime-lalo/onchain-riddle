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

type WinnerArgs = {
    user: `0x${string}`;
};

type RiddleSetArgs = {
    riddle: string;
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
        enabled: Boolean(txHash), // Seulement quand une transaction est en cours
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
                        const { user, correct } = log.args as AnswerAttemptArgs;

                        if (correct) {
                            // Réponse correcte - attendre pour voir si on gagne
                            Swal.fire({
                                title: "Bonne réponse ! 🎉",
                                text: "Vérification si vous êtes le premier...",
                                icon: "success",
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                            });

                            // Timeout de sécurité au cas où l'événement Winner ne se déclenche pas
                            setTimeout(() => {
                                Swal.fire({
                                    title: "Bonne réponse ! ✅",
                                    text: "Quelqu'un d'autre a peut-être gagné avant vous.",
                                    icon: "info",
                                    confirmButtonText: "OK",
                                    confirmButtonColor: "#3085d6",
                                }).then(() => {
                                    setAnswerText("");
                                    setIsProcessing(false);
                                });
                            }, 5000);
                        } else {
                            // Réponse incorrecte
                            setAnswerText("");
                            setIsProcessing(false);

                            Swal.fire({
                                title: "Réponse incorrecte ❌",
                                text: "Essayez encore !",
                                icon: "error",
                                confirmButtonText: "Réessayer",
                                confirmButtonColor: "#3085d6",
                                allowOutsideClick: true,
                                allowEscapeKey: true,
                                didOpen: () => {
                                    console.log(
                                        "Opened incorrect answer alert"
                                    );
                                },
                            });
                        }
                        console.log("🔁 AnswerAttempt", user, correct);
                    })
                    .with({ eventName: "Winner" }, (log) => {
                        const { user } = log.args as WinnerArgs;

                        Swal.fire({
                            title: "🏆 FÉLICITATIONS ! 🏆",
                            html: `
                                <div style="text-align: center;">
                                    <div style="font-size: 4rem; margin: 20px 0;">🎊</div>
                                    <p style="font-size: 1.2rem; margin-bottom: 10px;">
                                        Vous avez remporté la riddle !
                                    </p>
                                    <p style="color: #666;">
                                        Vous êtes le premier à avoir trouvé la bonne réponse !
                                    </p>
                                </div>
                            `,
                            icon: "success",
                            confirmButtonText: "Fantastique !",
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
                        console.log("🏆 Winner:", user);
                    })
                    .with({ eventName: "RiddleSet" }, (log) => {
                        const { riddle } = log.args as RiddleSetArgs;
                        console.log("🧩 Riddle:", riddle);
                    })
                    .exhaustive();
            }
        },
    });

    // Gestion des erreurs avec SweetAlert
    useEffect(() => {
        if (writeError) {
            Swal.fire({
                title: "Erreur de transaction",
                text: writeError.message,
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#d33",
            });
            setIsProcessing(false);
        }
    }, [writeError]);

    // Toast de progression pour la confirmation
    useEffect(() => {
        if (isConfirming) {
            Swal.fire({
                title: "Transaction en cours...",
                text: "Attente de confirmation sur la blockchain",
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

    useEffect(() => {
        if (!simulation) return;
        if (simulateError) {
            Swal.fire({
                title: "Erreur de simulation",
                text: simulateError.message,
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        Swal.fire({
            title: "Envoi de votre réponse...",
            text: "Signature de la transaction en cours",
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
                // Nettoyer les transactions précédentes
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

        // Calculer le hash de la réponse
        const hash = keccak256(toUtf8Bytes(answerText.trim())) as `0x${string}`;
        setAnswerHash(hash);

        // La simulation se déclenchera automatiquement via le useEffect
        // grâce à la condition enabled: Boolean(answerHash && isProcessing)
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Quelle est votre réponse ?
                </h3>

                <input
                    type="text"
                    value={answerText}
                    onChange={onAnswerChange}
                    placeholder="Votre réponse..."
                    required
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                    type="submit"
                    disabled={
                        !answerText.trim() ||
                        isPending ||
                        isConfirming ||
                        isProcessing
                    }
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isProcessing ? "Traitement en cours..." : "Répondre"}
                </button>
            </form>

            {/* Hash de transaction pour debug (optionnel) */}
            {txHash && (
                <div className="mt-4">
                    <p className="text-xs text-gray-500 break-all">
                        TX: {txHash}
                    </p>
                </div>
            )}
        </div>
    );
}
