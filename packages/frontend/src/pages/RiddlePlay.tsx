import RiddleDisplay from "@/components/materials/RiddleDisplay";
import IsConnected from "@/components/wrappers/IsConnected";
import AnswerRiddleForm from "@/components/materials/AnswerRiddleForm";

export default function RiddlePlay() {
    return (
        <>
            <RiddleDisplay />
            <IsConnected not>
                <p>Please connect your wallet to play the riddle.</p>
            </IsConnected>
            <IsConnected>
                <AnswerRiddleForm />
            </IsConnected>
        </>
    );
}
