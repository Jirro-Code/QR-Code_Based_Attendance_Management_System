import {useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

type BackButtonProps = {
    path: string;
};

export const BackButton = ({ path }: BackButtonProps) => {
    const navigate = useNavigate();
    return (
        <button className={styles.backButton} onClick={() => { navigate(path); }}>×</button>
    ); 
}