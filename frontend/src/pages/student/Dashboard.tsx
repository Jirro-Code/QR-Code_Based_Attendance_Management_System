import { type User } from "../../services/users";
import { useCurrentUser } from "../../hooks/useCurrentUser"
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar.tsx";
import { useView } from "../../hooks/useView.ts";
import QRCode from "qrcode";


export const StudentDashboard = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<Partial<User>>({
        id: "",
        username: "",
        studentStrand: "",
        studentSection: "",
        email: "",
        role: "user",
    });
    const qrURl = `${studentData.id}|icpsantamaria|${studentData.username}|icpsantamaria|${studentData.studentStrand}|icpsantamaria|${studentData.studentSection}`;
    useCurrentUser("/student-login", setStudentData);
    const { useViewProfilePicture } = useView();
    
    useEffect(() => {
        const fetchProfilePicture = async () => {
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
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    <div className="bg-white rounded-lg shadow-md flex flex-col items-center gap-4 p-6">
                        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {studentData.username}!</p>
                        {qrCode && <img className="w-56 h-56 border border-gray-200 rounded-md p-2" src={qrCode} alt="QR Code" />}
                        
                        {profilePicture && <img className="w-32 h-32 border border-gray-200 rounded-full" src={profilePicture} alt="Profile Picture" />}
                    </div>
                </div>
            </div>
        </>            
    )
}