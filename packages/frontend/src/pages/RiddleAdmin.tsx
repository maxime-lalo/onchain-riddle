import SetRiddleForm from "@/components/materials/SetRiddleForm";
import IsContractActive from "@/components/wrappers/IsContractActive";

export default function RiddleAdmin() {
    return (
        <>
            <IsContractActive not>
                <SetRiddleForm />
            </IsContractActive>
            <IsContractActive>
                <p>
                    ⛔ The contract is active. You cannot set a new riddle while
                    the contract is active.
                </p>
            </IsContractActive>
        </>
    );
}
