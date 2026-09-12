import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { Input } from "../../components/Input/Input";
import { CircleAlert, EyeOff, Eye} from "lucide-react";
import icp from "../../assets/icp.png";

export const StudentLoginPage = () => {
    const [form, setForm] = useState({studentId: "", password: ""});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const { useLoginUser } = useLogin("/student-dashboard", setError);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if(/^\d{4}-\d{4}-ICP$/.test(form.studentId) === false) {
                setError("Invalid Student ID format.");
                return;
            }
            if(form.password.length < 6){
                setError("Password must be at least 6 characters long.");
                return;
            }
            await useLoginUser({role: "user", studentId: form.studentId, password: form.password});
        } 
        catch (error) {
            console.error("Error logging in:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } 
        finally {
            setIsLoading(false);
        }
        
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-15">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-170 relative bg-white shadow-md rounded-2xl overflow-hidden">
                
                <div className="bg-blue-800 p-6 flex items-center justify-center md:max-w-76 md:min-h-80">
                    <div className="flex flex-col gap-1 items-center justify-center py-1 md:py-5">
                        <img src={icp} alt="ICP Logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-27 md:h-27" />
                        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">AttendScan</h1>
                    </div>
                </div>
                
                <div className="flex flex-col w-full justify-center p-6 sm:p-8 md:pl-0">
                    
                    <div className="mb-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Login</h2>
                        <p className="text-gray-500 mt-2">Welcome back, Icon!</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-2">
                            <Input label="Student ID" id="studentId" type="text" placeholder="2025-0000-ICP" onChange={handleChange} name="studentId" value={form.studentId} error={error?.includes("User not found") || error?.includes("Student ID") || error?.includes("archived") ? error : undefined} />
                        </div>
                        
                        <div className="mb-2 relative">
                            <Input label="Password" id="password" type={isHidden ? "password" : "text"} placeholder="Password" onChange={handleChange} name="password" value={form.password} error={error?.includes("Credentials") || error?.includes("Password") || error?.includes("archived") ? error : undefined} />
                            <button type="button" onClick={() => setIsHidden(!isHidden)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none bg-white">
                                {isHidden ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                            </button>
                            {error && (<span className="absolute w-full -bottom-8 left-0 flex items-center gap-1 text-red-600 text-[10px]"><CircleAlert size={12} /><u>{error}</u></span>)}
                        </div>
                        <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors" disabled={isLoading}> {isLoading ? "Logging in..." : "Log In"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}