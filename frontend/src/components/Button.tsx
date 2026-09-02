import {useNavigate } from "react-router-dom";
import { ArrowLeftToLine, X } from "lucide-react";

type BackButtonProps = {
    path: string;
};

type CancelButtonProps = {
    onClose: () => void;
    color: string;
}

export const BackButton = ({ path }: BackButtonProps) => {
    const navigate = useNavigate();
    return (
        <button className="bg-none text-blue-800 mr-2" onClick={() => { navigate(path); }}>
            <ArrowLeftToLine size={20} />
        </button>
    ); 
}

export const CancelButton = ({ onClose, color }: CancelButtonProps) => {
    return (
        <button className={`bg-none text-${color} mr-2`} onClick={onClose}>
            <X size={20} />
        </button>
    );
}