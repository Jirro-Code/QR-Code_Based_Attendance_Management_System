import { useNavigate } from "react-router-dom";
import { useScrollFunctions } from "../../hooks/useScrollFunctions";
import { CancelButton } from "../Button";

type SelectionCardProps = {
    onClose: () => void;
};

export const SelectionCard = ({ onClose }: SelectionCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    const navigate = useNavigate();
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                <div className="flex justify-between mb-10 w-full">
                    <h1 className="text-2xl font-bold text-gray-800">Create User</h1>
                    <CancelButton onClose={onClose} color="gray-500" />
                </div>
                <div className="flex flex-col items-center gap-3 w-full">
                    <button onClick={() => {navigate("/create-student");}} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">STUDENT</button>
                    <button onClick={() => {navigate("/create-admin");}} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">ADMIN</button>
                </div>
            </div>
        </div>
    )
}