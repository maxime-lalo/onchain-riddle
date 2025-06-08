import RiddleDisplay from "@/components/materials/RiddleDisplay";
import IsConnected from "@/components/wrappers/IsConnected";
//import AnswerForm from "@/components/materials/AnswerForm";

export default function RiddlePlay() {
    return (
        <>
            <RiddleDisplay />
            <IsConnected not>
                <p>Please connect your wallet to play the riddle.</p>
            </IsConnected>
            <IsConnected>
                <p>Answer </p>
            </IsConnected>
        </>
    );
}
