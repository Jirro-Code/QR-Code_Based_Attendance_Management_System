import {useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

export function BackButton ( {path}: {path: string}){
    const navigate = useNavigate();
    return (
        <button className={styles.backButton} onClick={() => {navigate(path);}}>×</button>
    ); 
}