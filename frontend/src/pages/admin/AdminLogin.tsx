import { useState } from "react";
import { Input } from "../../components/Input/Input.tsx";
import { useLogin } from "../../hooks/useLogin";
import { CircleAlert} from "lucide-react";
import icp from "../../assets/icp.png";

export const AdminLoginPage = () => {
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const { useLoginUser } = useLogin("/admin-dashboard", setError);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(form.email.includes("@") === false || form.email.includes(".") === false) {
            setError("Invalid email format.");
            return;
        }
        if(form.password.length < 6){
            setError("Password must be at least 6 characters long.");
            return;
        }
        await useLoginUser({role: "admin", email: form.email, password: form.password});
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="max-h-100 relative bg-white shadow-md flex rounded-2xl overflow-hidden">
                
                <div className="bg-blue-800 p-6 flex items-center justify-center">
                    <div className="flex flex-col gap-1 items-center justify-center m-5">
                        <img src={icp} alt="Logo" className="h-25 w-25" />
                        <h1 className="text-2xl font-bold text-white ml-2">AttendScan</h1>
                    </div>
                </div>
                
                <div className="w-2/3 flex flex-col justify-center p-6">                    
                    <div className="mb-5">
                        <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                        <p className="text-gray-500 mt-2">Welcome back, Admin!</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-2">
                            <Input label="Email" id="email" type="email" placeholder="example@gmail.com" onChange={handleChange} name="email" value={form.email} error={error?.includes("User not found") || error?.includes("email") ? error : undefined} />
                        </div>
                        
                        <div className="mb-2 relative">
                            <Input label="Password" id="password" type="password" placeholder="Password" onChange={handleChange} name="password" value={form.password} error={error?.includes("Credentials") || error?.includes("Password") ? error : undefined} />
                            {error && (<span className="absolute w-[110%] -bottom-8 left-0 flex items-center gap-1 text-red-600 text-[10px]"><CircleAlert size={12} /><u>{error}</u></span>)}
                        </div>
                        <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}