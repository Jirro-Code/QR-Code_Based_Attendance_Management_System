import { type User } from "../../services/users";
import { useCurrentUser } from "../../hooks/useCurrentUser"
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar.tsx";

export const StudentDashboard = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
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
    
    useEffect(() => {
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
                    </div>
                </div>
            </div>
        </>            
    )
}