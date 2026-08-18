import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col px-4">
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-10 w-full max-w-sm flex flex-col items-center gap-6">
                <h1 className="text-2xl font-bold text-slate-800">Login</h1>
                <p className="text-sm text-gray-500 -mt-4">Select your account type to continue</p>
                
                <div className="w-full flex flex-col gap-3">
                    <button className="w-full py-3 bg-blue-300 rounded-lg border text-blue-900 font-medium hover:bg-blue-50 transition-colors" onClick={() => navigate("/admin-login")}>Admin</button>
                    <button className="w-full py-3 rounded-lg border bg-blue-800 text-white font-medium hover:bg-blue-900 transition-colors" onClick={() => navigate("/student-login")}>Student</button>
                </div>
            </div>
        </div>
    )
}