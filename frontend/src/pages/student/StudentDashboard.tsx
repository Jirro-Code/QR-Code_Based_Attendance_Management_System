import QRCode from "qrcode";
import { type User } from "../../services/users.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts"
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar.tsx";
//import { useView } from "../../hooks/useView.ts";
import { logout } from "../../services/auth.ts";
import { ClipboardClock, Calendar, SquareArrowOutUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    //const [profilePicture, setProfilePicture] = useState<string | null>(null);
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
    //const { useViewProfilePicture } = useView();
    
    useEffect(() => {
        /*const fetchProfilePicture = async () => {
            if (!studentData.id) return;
            try {
                const url = await useViewProfilePicture(studentData.id, (error) => {
                    console.error("Error fetching profile picture:", error);
                });
                setProfilePicture(url);
            }
            catch (e) {
                console.error("Error fetching profile picture:", e);
                setProfilePicture(null);
            }
        }
        fetchProfilePicture();
        */
        if (studentData.id && studentData.username) {
            
            QRCode.toDataURL(qrURl, (err, url) => {
                if (err) {
                    console.error("Error generating QR code:", err);
                    return;
                }
                setQrCode(url);
            });
        }
        
    }, [studentData.id, studentData.username]);
    
    
    
    return (
        <>
            <Navbar dashPath="/student-dashboard" profilePath="/student/profile" />
            <div className="min-h-screen bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-full">
                <div className="h-2"></div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
                    <p className="mt-2 text-slate-500"> Welcome back,{" "} <span className="font-semibold text-blue-800">{studentData.username}</span>!</p>
                </div>
                <div className="h-5"></div>
                
                <div className="items-center justify-center grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex justify-center items-center gap-4">
                        {qrCode && <img className="max-w-115 max-h-115 w-full h-auto border border-slate-200 shadow-sm rounded-xl" src={qrCode} alt="QR Code" />}
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
                            onClick={() => {}}
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
                
                <div className="mt-8">
                    <button
                        onClick={() => logout("/admin-login")}
                        className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
                
            </div>
        </div>
        </>            
    )
}