import {useNavigate } from "react-router-dom";
export function BackButton ( {path}: {path: string}){
    const navigate = useNavigate();
    return (
        <button onClick={() => {navigate(path);}}>Back</button>
    ); 
}