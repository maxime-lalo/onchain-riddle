import { ConnectButton } from "@rainbow-me/rainbowkit";
import RiddleDisplay from "@/components/materials/RiddleDisplay";
import SetRiddleForm from "./components/materials/SetRiddleForm";
import IsBot from "@/components/wrappers/IsBot";

function App() {
    return (
        <div className="app">
            <h1>Onchain Riddle</h1>
            <ConnectButton />
            <RiddleDisplay />
            <IsBot>
                <SetRiddleForm />
            </IsBot>
        </div>
    );
}

export default App;
