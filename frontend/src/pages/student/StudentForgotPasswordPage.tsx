import { useState, useRef } from "react";
import { useUpdate } from "../../hooks/useUpdate.ts";
import { Input } from "../../components/Input/Input";
import { CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step1Completed, setStep1Completed] = useState(false);
    const [step2Completed, setStep2Completed] = useState(false);
    
    // OTP state
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [otpLoading, setOtpLoading] = useState(false);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    
    const { useForgotPassword, useVerifyOtp } = useUpdate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("Invalid email format.");
                return;
            }
            await useForgotPassword(email, "user", setError);
            if(!error) {
                setStep1Completed(true);
            }
        }
        catch (error) {
            console.error("Error sending password reset email:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleResendOtp = async () => {
        try {
            await useForgotPassword(email, "user", setError);
        } catch (error) {
            console.error("Error resending OTP:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }

    // OTP handlers
    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;

        const newOtp = new Array(6).fill("");
        pasted.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);
        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = otp.join("");
        setOtpLoading(true);
        try {
            if (code.length !== 6) {
                setError("Please enter the complete 6-digit OTP.");
                return;
            }
            await useVerifyOtp(email, "user", code, setError);
            if(!error) {
                setStep2Completed(true);
            }
        } finally {
            setOtpLoading(false);
        }
    }
    
    return (
        <>
            <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-100 p-10">                
                <div className="w-full max-w-150">
                    {!step1Completed &&
                        (<div className="flex flex-col w-full gap-2">
                            <div className="mb-5 text-center">
                                <h2 className="text-3xl font-bold text-gray-800">Enter Your Email Address</h2>
                                <p className="text-gray-500 mt-2">Enter your email to reset your password.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="relative">
                                    <Input id="email" type="email" name="email" placeholder="Enter your email" value={email} onChange={handleChange} error={error?.includes("email") ? error : undefined} />
                                    {error && (<span className="absolute w-full -bottom-8 left-0 flex items-center gap-1 text-red-600 text-[10px]"><CircleAlert size={12} /><u>{error}</u></span>)}
                                </div>
                                
                                <p className="text-center text-sm text-gray-500 mt-4">Back to <a href="/student-login" className="text-blue-500 hover:underline">Login</a></p>
                                <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send OTP"}
                                </button>
                            </form>
                        </div>)
                    }
                    {step1Completed &&
                        (<div className="flex flex-col w-full gap-5">
                            <div className="mb-5 text-center">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Check Your Email</h2>
                                <p className="text-gray-500 mt-2">Enter the 6-digit code we sent to your email.</p>
                                {error && (<p className="text-red-600 text-sm text-center mt-5 ">{error}</p>)}
                            </div>
                            <form onSubmit={handleOtpSubmit} className="w-full">
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { otpRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={handleOtpPaste}
                                            className={`${error ? 'border-red-400 bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-700' : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-800'} w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border rounded-lg`}
                                        />
                                    ))}
                                </div>
                                <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors" disabled={otpLoading}>
                                    {otpLoading ? "Verifying..." : "Send"}
                                </button>
                            </form>
                            <p className="text-sm text-gray-500 text-center">
                                Didn't receive the code? <button className="text-blue-800 hover:underline" onClick={handleResendOtp}>Resend</button>
                            </p>
                            <p className="text-sm text-gray-500 text-center">
                                Back to <button className="text-blue-800 hover:underline" onClick={() => navigate("/login-student")}>Login</button>
                            </p>
                        </div>)
                    }
                    {step2Completed && (
                        <div className="flex flex-col w-full gap-5">
                            <div className="mb-5 text-center">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">OTP Verified</h2>
                                <p className="text-gray-500 mt-2">You can now reset your password.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}