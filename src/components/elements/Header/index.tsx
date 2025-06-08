import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./classes.module.scss";

export default function Header() {
    return (
        <header className={styles.container}>
            <h1 className={styles.title}>🧩 Onchain Riddle</h1>
            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Accueil
                </NavLink>
                <NavLink
                    to="/riddle"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Jouer
                </NavLink>
                <NavLink
                    to="/admin"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Admin
                </NavLink>
            </nav>
            <ConnectButton />
        </header>
    );
}
