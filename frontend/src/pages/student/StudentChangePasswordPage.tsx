import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "../../components/Header.tsx";
import { Input } from "../../components/Input/Input.tsx";
import { ApiError } from "../../services/error.ts";
import { useUpdate } from "../../hooks/useUpdate.ts";
import { type User } from "../../services/users.ts";


export const StudentChangePasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const student = location.state?.user as User | undefined;
    const { useChangePassword, useGetPasswordChangeStatus } = useUpdate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [lockedUntil, setLockedUntil] = useState<string | null>(null);
    const [lockSeconds, setLockSeconds] = useState(0);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hiddenFields, setHiddenFields] = useState({ current: true, password: true, confirm: true });
    const formatCountdown = (seconds: number) =>
        `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    
    useEffect(() => {
        const loadStatus = async () => {
            try {
                const status = await useGetPasswordChangeStatus();
                setLockedUntil(status.lockedUntil);
            }
            catch (statusError) {
                console.error("Error loading password change status:", statusError);
            }
        };
        loadStatus();
    }, []);
    
    useEffect(() => {
        if (!lockedUntil) {
            setLockSeconds(0);
            return;
        }
        const updateRemaining = () => {
            const remaining = Math.max(0, Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000));
            setLockSeconds(remaining);
            if (remaining === 0) {
                setLockedUntil(null);
                setError("");
            }
        };
        updateRemaining();
        const timer = window.setInterval(updateRemaining, 1000);
        return () => window.clearInterval(timer);
    }, [lockedUntil]);
    
    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            await useChangePassword(currentPassword, password, setError);
            navigate("/student-profile", { state: { user: student, notify: true } });
        }
        catch (changeError) {
            if (changeError instanceof ApiError && changeError.status === 423) {
                const lock = changeError.details.lockedUntil;
                if (typeof lock === "string") setLockedUntil(lock);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    
    const toggleField = (field: keyof typeof hiddenFields) => {
        setHiddenFields((fields) => ({ ...fields, [field]: !fields[field] }));
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Header title="Change Password" path="/student-profile" />
            <div className="w-full max-w-3xl mx-auto flex-1 p-4 sm:p-8 flex items-center">
                <div className="w-full p-3">
                    <div className="mb-5 text-center">
                        <h2 className="text-2xl mb-5 sm:text-3xl font-bold text-gray-800">Change Your Password</h2>
                        {lockSeconds > 0 && <p className="text-red-600 font-semibold mt-3">Too many incorrect attempts. Try again in {formatCountdown(lockSeconds)}</p>}
                        {error && lockSeconds === 0 && <p className="text-red-600 text-sm mt-3">{error}</p>}
                    </div>
                    <form onSubmit={handleChangePassword} className="text-left">
                        <div className="relative">
                            <Input id="currentPassword" label="Old Password" type={hiddenFields.current ? "password" : "text"} name="currentPassword" placeholder="Enter your old password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} isRequired={false} error={error?.includes("Current password") ? error : undefined}/>
                            <button type="button" onClick={() => toggleField("current")} className="absolute right-3 top-9 text-gray-500">{hiddenFields.current ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                        <div className="relative">
                            <Input id="password" label="New Password" type={hiddenFields.password ? "password" : "text"} name="password" placeholder="Enter your new password" value={password} onChange={(event) => setPassword(event.target.value)} isRequired={false} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                            <button type="button" onClick={() => toggleField("password")} className="absolute right-3 top-9 text-gray-500">{hiddenFields.password ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                        <div className="relative">
                            <Input id="confirmPassword" label="Confirm New Password" type={hiddenFields.confirm ? "password" : "text"} name="confirmPassword" placeholder="Confirm your new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} isRequired={false} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                            <button type="button" onClick={() => toggleField("confirm")} className="absolute right-3 top-9 text-gray-500">{hiddenFields.confirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                        <button type="submit" disabled={isLoading || lockSeconds > 0} className="bg-blue-800 w-full text-white py-3 px-4 rounded-lg font-medium mt-2 hover:bg-blue-900 disabled:bg-gray-400">
                            {isLoading ? "Saving..." : "Change Password"}
                        </button>
                        <div className="flex justify-start">
                            <p className="text-center text-sm text-gray-500 mt-4">Forgot your password? <button type="button" onClick={() => navigate("/forgot-password", { state: { isAdmin: false, fromProfile: true, email: student?.email } })} className="text-blue-600 hover:underline">Click here</button></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
