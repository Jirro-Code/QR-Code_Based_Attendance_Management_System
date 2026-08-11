import { type User } from "../../services/users";
import { useCurrentUser } from "../../hooks/useCurrentUser"
import QRCode from "qrcode";
import { useEffect, useState } from "react";


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
        <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back, {studentData.username}!</p>
            {qrCode && <img className="qr-code" src={qrCode} alt="QR Code" />}
        </div>                
    )
}