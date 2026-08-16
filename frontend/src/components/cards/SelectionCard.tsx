import {useNavigate} from "react-router-dom";

type SelectionCardProps = {
    onClose: () => void;
};

export const SelectionCard = ({ onClose }: SelectionCardProps) => {
    
    const navigate = useNavigate();
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                <h1 className="text-2xl font-bold text-gray-800">Create User</h1>
                <p className="text-gray-600">Welcome to the create user page!</p>
                <div className="flex flex-col items-center gap-3 w-full">
                    <h2 className="text-lg font-semibold text-gray-700">Create a New User</h2>
                    <button onClick={() => {navigate("/create-student");}} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">STUDENT</button>
                    <button onClick={() => {navigate("/create-admin");}} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">ADMIN</button>
                </div>
                <div className="mt-2">
                    <button onClick={() => onClose()} className="text-gray-500 hover:text-gray-700 font-medium">Back</button>
                </div>  
            </div>
        </div>
    )
}