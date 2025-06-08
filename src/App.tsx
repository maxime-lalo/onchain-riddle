import { ConnectButton } from "@rainbow-me/rainbowkit";
import RiddleDisplay from "@/components/materials/RiddleDisplay";

function App() {
    return (
        <div className="app">
            <h1>Onchain Riddle</h1>
            <ConnectButton />
            <RiddleDisplay />
        </div>
    );
}

export default App;
