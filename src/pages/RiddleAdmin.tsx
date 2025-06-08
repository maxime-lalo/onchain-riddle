import IsBot from "@/components/wrappers/IsBot";
import SetRiddleForm from "@/components/materials/SetRiddleForm";

export default function RiddleAdmin() {
    return (
        <IsBot>
            <SetRiddleForm />
        </IsBot>
    );
}
