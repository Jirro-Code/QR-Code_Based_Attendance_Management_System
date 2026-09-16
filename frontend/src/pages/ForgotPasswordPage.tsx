import { useState, useRef, useEffect } from "react";
import { useUpdate } from "../hooks/useUpdate.ts";
import { Input } from "../components/Input/Input.tsx";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiError } from "../services/error.ts";

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin] = useState(!!location.state?.isAdmin);
    const role = isAdmin ? "admin" : "user";
    const [email, setEmail] = useState(() => sessionStorage.getItem("passwordResetEmail") ?? "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step1Completed, setStep1Completed] = useState(false);
    const [step2Completed, setStep2Completed] = useState(false);
    const [step3Completed, setStep3Completed] = useState(false);
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [otpLoading, setOtpLoading] = useState(false);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [isHidden, setIsHidden] = useState(true);
    const [isHidden2, setIsHidden2] = useState(true);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordResetLoading, setPasswordResetLoading] = useState(false);
    const [resendAvailableAt, setResendAvailableAt] = useState<string | null>(null);
    const [resendSeconds, setResendSeconds] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<string | null>(null);
    const [lockSeconds, setLockSeconds] = useState(0);
    const { useForgotPassword, useVerifyOtp, useGetOtpStatus, useResetPassword } = useUpdate();
    
    useEffect(() => {
        if (!email) return;
        
        const restoreOtpStatus = async () => {
            try {
                const status = await useGetOtpStatus(email, role);
                setStep1Completed(true);
                setResendAvailableAt(status.resendAvailableAt);
                setLockedUntil(status.lockedUntil);
            }
            catch (statusError) {
                if (statusError instanceof ApiError && [404, 410].includes(statusError.status)) {
                    sessionStorage.removeItem("passwordResetEmail");
                }
            }
        };
        
        restoreOtpStatus();
    }, []);
    
    useEffect(() => {
        if (!resendAvailableAt) {
            setResendSeconds(0);
            return;
        }
        
        const updateRemainingTime = () => {
            setResendSeconds(Math.max(0, Math.ceil((new Date(resendAvailableAt).getTime() - Date.now()) / 1000)));
        };
        
        updateRemainingTime();
        const timer = window.setInterval(updateRemainingTime, 1000);
        return () => window.clearInterval(timer);
    }, [resendAvailableAt]);
    
    useEffect(() => {
        if (!lockedUntil) {
            setLockSeconds(0);
            return;
        }
        
        const updateRemainingTime = () => {
            const remaining = Math.max(0, Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000));
            setLockSeconds(remaining);
            if (remaining === 0) {
                setLockedUntil(null);
                setError("");
            }
        };
        
        updateRemainingTime();
        const timer = window.setInterval(updateRemainingTime, 1000);
        return () => window.clearInterval(timer);
    }, [lockedUntil]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStep1Completed(false);
        setStep2Completed(false);
        setError("");
        setIsLoading(true);
        setError("");
        try {
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("Invalid email format.");
                return;
            }
            
            sessionStorage.setItem("passwordResetEmail", email);
            
            try {
                const status = await useGetOtpStatus(email, role);
                setStep1Completed(true);
                setResendAvailableAt(status.resendAvailableAt);
                setLockedUntil(status.lockedUntil);
                return;
            }
            catch (statusError) {
                if (!(statusError instanceof ApiError) || ![404, 410].includes(statusError.status)) {
                    throw statusError;
                }
            }
            
            const responseData = await useForgotPassword(email, role, setError);
            if (responseData?.message === "Password reset OTP sent to email") {
                setStep1Completed(true);
                setResendAvailableAt(responseData.resendAvailableAt);
                setLockedUntil(null);
                sessionStorage.removeItem("passwordResetEmail");
            }
        }
        catch (error) {
            console.error("Error sending password reset email:", error);
            if (error instanceof ApiError && error.status === 429) {
                const cooldown = error.details.resendAvailableAt;
                if (typeof cooldown === "string") {
                    setStep1Completed(true);
                    setResendAvailableAt(cooldown);
                }
            }
            if (error instanceof ApiError && error.status === 423) {
                const lock = error.details.lockedUntil;
                if (typeof lock === "string") {
                    setStep1Completed(true);
                    setLockedUntil(lock);
                }
            }
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
        finally {
            setIsLoading(false);
        }
    }
    
    const handleResendOtp = async () => {
        if (resendSeconds > 0 || lockSeconds > 0) return;
        
        try {
            const responseData = await useForgotPassword(email, role, setError);
            if (responseData?.resendAvailableAt) {
                setOtp(new Array(6).fill(""));
                setError("");
                setResendAvailableAt(responseData.resendAvailableAt);
                setLockedUntil(null);
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            if (error instanceof ApiError && error.status === 423) {
                const lock = error.details.lockedUntil;
                if (typeof lock === "string") {
                    setLockedUntil(lock);
                }
            }
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
    
    const handleOtpChange = (index: number, value: string) => {
        if (lockSeconds > 0 || !/^[0-9]?$/.test(value)) return; 
        
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
        if (lockSeconds > 0) return;
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
            const responseData = await useVerifyOtp(email, role, code, setError);
            if (responseData) {
                setStep2Completed(true);
            }
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
            if (error instanceof ApiError && error.status === 423) {
                const lock = error.details.lockedUntil;
                if (typeof lock === "string") {
                    setLockedUntil(lock);
                }
            }
        }
        finally {
            setOtpLoading(false);
        }
    }
    
    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setPasswordResetLoading(true);
        try{
            if (password.length < 6) {
                setError("Password must be at least 6 characters long.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            
            const responseData = await useResetPassword( email, password, setError);
            
            if (responseData?.message === "Password reset successfully") {
                setStep3Completed(true);
                
                navigate(
                isAdmin ? "/admin-login" : "/student-login",
                { state: { notify: true } }
                );
            }
        }
        catch (error) {
            console.error("Error resetting password:", error);
        }
        finally {
            setPasswordResetLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-100 p-15">                
            <div className="w-full max-w-150">
                {!step1Completed && !step2Completed && !step3Completed &&
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
                            
                            <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-10 hover:bg-blue-900 transition-colors" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send OTP"}
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">Back to <button type="button" onClick={() => navigate(isAdmin ? "/admin-login" : "/student-login")} className="text-blue-500 hover:underline">Login</button></p>
                        </form>
                    </div>)
                }
                {step1Completed && !step2Completed && !step3Completed &&
                    (<div className="flex flex-col w-full gap-5">
                        <div className="mb-5 text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Check Your Email</h2>
                            <p className="text-gray-500 mt-2 mb-3">Enter the 6-digit code we sent to your email.</p>
                            {lockSeconds > 0 && (
                                <p className="text-center font-semibold text-red-600">
                                    Too many incorrect attempts. Try again in {Math.floor(lockSeconds / 60)}:{String(lockSeconds % 60).padStart(2, "0")}
                                </p>
                            )}
                            {error && (<p className="text-red-600 text-sm text-center">{error}</p>)}
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
                                            disabled={lockSeconds > 0}
                                        className={`${error ? 'border-red-400 bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-700' : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-800'} w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border rounded-lg`}
                                    />
                                ))}
                            </div>
                            <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors" disabled={otpLoading || lockSeconds > 0}>
                                {otpLoading ? "Verifying..." : "Send"}
                            </button>
                        </form>
                        <p className="text-sm text-gray-500 text-center">Didn't receive the code? <button type="button" disabled={resendSeconds > 0 || lockSeconds > 0} className="text-blue-500 hover:underline disabled:text-gray-400 disabled:no-underline" onClick={handleResendOtp}>{lockSeconds > 0 ? "Resend unavailable" : resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend"}</button></p>
                        <p className="text-sm text-gray-500 text-center mt-3">Back to <button type="button" onClick={() => navigate(isAdmin ? "/admin-login" : "/student-login")} className="text-blue-500 hover:underline">Login</button></p>
                    </div>)
                }
                {step1Completed && step2Completed && !step3Completed && (
                    <div className="flex flex-col w-full gap-5">
                        <div className="mb-5 text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">OTP Verified</h2>
                            <p className="text-gray-500 mt-2">You can now reset your password.</p>
                            <form onSubmit={handlePasswordReset} className="w-full mt-5">
                                <div className="relative">
                                    <Input label="Password" id="studentPassword" type={isHidden ? "password" : "text" } placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" value={password ?? ""} isRequired={true} error={error?.includes("password") || error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                                    <button type="button" onClick={() => setIsHidden(!isHidden)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none bg-white">
                                        {isHidden ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input label="Confirm Password" id="confirmPassword" type={isHidden2 ? "password" : "text" } placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" value={confirmPassword ?? ""} isRequired={true} error={error?.includes("Password") || error?.includes("Passwords") ? error : undefined} />
                                    <button type="button" onClick={() => setIsHidden2(!isHidden2)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none bg-white">
                                        {isHidden2 ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                                    </button>
                                </div>
                                
                                <button type="submit" className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-6 hover:bg-blue-900 transition-colors" disabled={passwordResetLoading}>
                                    {passwordResetLoading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}