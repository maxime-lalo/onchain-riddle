import styles from "./App.module.scss";
import Header from "@/components/elements/Header";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className={styles.container}>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
