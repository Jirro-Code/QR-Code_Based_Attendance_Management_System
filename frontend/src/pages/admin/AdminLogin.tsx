import { useState } from "react";
import { BackButton } from "../../components/Button/Button.tsx";
import { Input } from "../../components/Input/Input.tsx";
import { useLogin } from "../../hooks/useLogin";
import { UserShield, CircleAlert} from "lucide-react";

export const AdminLoginPage = () => {
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const { useLoginUser } = useLogin("/admin-dashboard", setError);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(form.password.length < 6){
            setError("Password must be at least 6 characters long.");
            return;
        }
        await useLoginUser({role: "admin", email: form.email, password: form.password});
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="max-h-100 relative bg-white shadow-md flex rounded-2xl overflow-hidden">
                
                <div className="absolute top-4 right-2">
                    <BackButton path="/" />
                </div>
                
                <div className="bg-blue-800 p-6 flex items-center justify-center">
                    <div className="flex flex-col gap-1 items-center justify-center m-5">
                        <UserShield size={70} className="text-white" />
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
                            <Input label="Email" id="email" type="email" placeholder="example@gmail.com" onChange={handleChange} name="email" value={form.email} />
                        </div>
                        
                        <div className="mb-2 relative">
                            <Input label="Password" id="password" type="password" placeholder="Password" onChange={handleChange} name="password" value={form.password} />
                            {error && (<span className="absolute w-[110%] -bottom-5 left-0 flex items-center gap-1 text-red-600 text-[10px]"><CircleAlert size={12} /><u>{error}</u></span>)}
                        </div>
                        <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-4 hover:bg-blue-900 transition-colors">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}