import { useState } from "react";
import { useUpdate } from "../../hooks/useUpdate.ts";
import { Input } from "../../components/Input/Input";
import { Header } from "../../components/Header";
import { CircleAlert } from "lucide-react";

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { useForgotPassword } = useUpdate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("Invalid email format.");
                return;
            }
            await useForgotPassword(email, "user", setError);
        }
        catch (error) {
            console.error("Error sending password reset email:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
        finally {
            setIsLoading(false);
        }
    }
    
    return (
        <>  
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-15">
                <div className="absolute top-0 left-0 w-full">
                    <Header title="Forgot Password" path="/student-login" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-170 relative bg-white shadow-md rounded-2xl overflow-hidden">
                    <div className="bg-blue-800 p-6 flex items-center justify-center md:max-w-76 md:min-h-80">
                        <div className="flex flex-col gap-1 items-center justify-center py-1 md:py-5">
                            <h1 className="text-xl sm:text-2xl font-bold text-white text-center">AttendScan</h1>
                        </div>
                    </div>
                    <div className="flex flex-col w-full justify-center p-6 sm:p-8 md:pl-0">
                        <div className="mb-5">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Forgot Password</h2>
                            <p className="text-gray-500 mt-2">Enter your email to reset your password.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleChange}
                                    error={error?.includes("email") ? error : undefined}
                                />
                                {error && (<span className="absolute w-full -bottom-8 left-0 flex items-center gap-1 text-red-600 text-[10px]"><CircleAlert size={12} /><u>{error}</u></span>)}
                            </div>
                            <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}