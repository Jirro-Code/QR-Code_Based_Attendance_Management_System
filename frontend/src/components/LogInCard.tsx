import { useNavigate } from "react-router-dom";
export const LogInCard = () => {
        const navigate = useNavigate();
    return (
        <div className="card bg-white p-8 rounded-lg shadow-md flex flex-col h-full w-1/4 justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">
                Login
            </h1>
            
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate("/admin-login")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Admin
                </button>
                
                <button
                    onClick={() => navigate("/student-login")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Student
                </button>
            </div>
        </div>
    )
}