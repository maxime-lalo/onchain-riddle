import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./classes.module.scss";
import IsBot from "@/components/wrappers/IsBot";

export default function Header() {
    return (
        <header className={styles.container}>
            <h1 className={styles.title}>🧩 Onchain Riddle</h1>
            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/riddle"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Play
                </NavLink>
                <IsBot>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Admin
                    </NavLink>
                </IsBot>
            </nav>
            <ConnectButton />
        </header>
    );
}
