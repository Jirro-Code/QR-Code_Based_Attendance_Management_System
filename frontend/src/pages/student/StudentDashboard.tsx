import QRCode from "qrcode";
import { type User } from "../../services/users.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts"
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar.tsx";
import { ClipboardClock, Calendar, SquareArrowOutUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [studentData, setStudentData] = useState<Partial<User>>({
        id: "",
        username: "",
        studentStrand: "",
        studentSection: "",
        email: "",
        role: "user",
    });
    const qrURl = `ICP|icpsantamaria|${studentData.id}|icpsantamaria|SantaMaria`;
    const navigate = useNavigate();
    useCurrentUser("/student-login", setStudentData);
    
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
        
        if (studentData.id && studentData.username) {
            setIsLoading(true);
            try {
                QRCode.toDataURL(qrURl, (err, url) => {
                    if (err) {
                        console.error("Error generating QR code:", err);
                        return;
                    }
                    setQrCode(url);
                });
            } 
            catch (error) {
                console.error("Error generating QR code:", error);
            }
            finally {
                setIsLoading(false);
            }
        }
        
    }, [studentData.id, studentData.username]);
    
    
    
    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar dashPath="/student-dashboard" profilePath="/student-profile" user={studentData} />
            
            <div className="mx-auto max-w-full px-6 py-10">
                <div className="mt-2 mb-26 max-w-sm truncate">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
                    <p className="mt-2 text-lg text-slate-500"> Welcome back,{" "} <span className="font-semibold text-blue-800">{studentData.username}</span>!</p>
                </div>
                
                <div className="mt-1 items-center justify-center grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex justify-center items-center gap-4">
                        {isLoading ? (
                            <div className="animate-pulse max-h-115 w-full h-auto rounded-sm bg-gray-100 ring-4 ring-gray-50"></div>
                        ) : qrCode ? (
                            <img className="max-w-115 max-h-115 w-full h-auto border border-slate-200 shadow-sm rounded-xl" src={qrCode} alt="QR Code" />
                        ) : null}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
                        <button
                            onClick={() => navigate("/attendance-history")}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                                <ClipboardClock size={20} />
                            </div>
                            
                            <h2 className="text-lg font-bold text-slate-900">
                                Attendance History
                            </h2>
                            
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                View your attendance history and records.
                            </p>
                            
                            <div className="mt-5 text-sm font-semibold text-blue-800 transition group-hover:text-blue-900 flex items-center gap-1">
                                <SquareArrowOutUpRight /> Open
                            </div>
                        </button>
                        
                        
                        <button
                            onClick={() => navigate("/events-page")}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl" >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
                                <Calendar size={20} />
                            </div>
                            
                            <h2 className="text-lg font-bold text-slate-900">
                                Upcoming Events
                            </h2>
                            
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                View upcoming events.
                            </p>
                            
                            <div className="mt-5 text-sm font-semibold text-blue-800 transition group-hover:text-blue-900 flex items-center gap-1">
                                <SquareArrowOutUpRight /> Open
                            </div>
                        </button>
                    </div>
                    
                </div>
                
            </div>
        </div>       
    )
}