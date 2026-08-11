import { type User } from "../../services/users";
import { useCurrentUser } from "../../hooks/useCurrentUser"
import QRCode from "qrcode";
import { useEffect, useState } from "react";


export const StudentDashboard = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<Partial<User>>({
        id: "",
        username: "",
        email: "",
        role: "user",
    });
    
    useCurrentUser("/student-login", setStudentData);
    
    useEffect(() => {
        if (studentData.id) {
            QRCode.toDataURL(studentData.id, (err, url) => {
                if (err) {
                    console.error("Error generating QR code:", err);
                    return;
                }
                setQrCode(url);
            });
        }
    }, [studentData.id]);
    
    return (
        <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back, {studentData.username}!</p>
            {qrCode && <img className="qr-code" src={qrCode} alt="QR Code" />}
        </div>                
    )
}