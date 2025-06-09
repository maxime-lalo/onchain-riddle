import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import RiddlePlay from "@/pages/RiddlePlay";
import RiddleAdmin from "@/pages/RiddleAdmin";
import App from "@/App";
import RequireBotWallet from "@/components/wrappers/RequireBotWallet";
import RequireContractActive from "./components/wrappers/RequireContractActive";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route
                        path="riddle"
                        element={
                            <RequireContractActive>
                                <RiddlePlay />
                            </RequireContractActive>
                        }
                    />
                    <Route
                        path="admin"
                        element={
                            <RequireBotWallet>
                                <RiddleAdmin />
                            </RequireBotWallet>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
