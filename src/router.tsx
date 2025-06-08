import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import RiddlePlay from "@/pages/RiddlePlay";
import RiddleAdmin from "@/pages/RiddleAdmin";
import App from "./App";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="riddle" element={<RiddlePlay />} />
                    <Route path="admin" element={<RiddleAdmin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
