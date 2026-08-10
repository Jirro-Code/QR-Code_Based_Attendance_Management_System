import { useState } from "react";
import { BackButton } from "../../../components/Button/Button.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { SelectionField } from "../../../components/SelectionField.tsx";
import { type StudentRegisterPayload } from "../../../services/auth.ts";
import { useCreate } from "../../../hooks/useCreate.ts";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";

export const RegisterStudent = () => {
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    const [studentData, setStudentData] = useState<StudentRegisterPayload>({
        role: "user",
        username: "",
        email: "",
        password: "",
        studentId: "",
        studentLRN: "",
        studentStrand: "",
        studentSection: ""
    });
    const {useRegister} = useCreate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setConfirmPassword(e.target.name === "confirmPassword" ? e.target.value : confirmPassword);
        setStudentData((current) => ({...current, [e.target.name]: e.target.value}));
    }
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (studentData.password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        await useRegister({ form: studentData, setError, setShowNotification, setNotificationMessage});
    }
    
    const reloadPage = () => {
        setStudentData({
            role: "user",
            username: "",
            email: "",
            password: "",
            studentId: "",
            studentLRN: "",
            studentStrand: "",
            studentSection: ""
        });
        setConfirmPassword("");
        setShowNotification(false);
    }
    
    return (
        <div className="registerStudentPage">
            <h1>Register Student</h1>
            <p>Welcome to the student registration page!</p>
            <div className="backButton"><BackButton path="/admin-dashboard" /></div>
            
            <div className="registerStudentForm">
                <h2>Register a New Student</h2>
                <p>{error}</p>
                <form onSubmit={handleSubmit}>
                    <Input label="Student Name" id="studentName" type="text" placeholder="Student Name" onChange={handleChange} name="username" value={studentData.username} />
                    <Input label="Email" id="studentEmail" type="email" placeholder="Email" onChange={handleChange} name="email" value={studentData.email} />
                    <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleChange} name="password" value={studentData.password} />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={confirmPassword} />
                    <Input label="Student LRN" id="studentLRN" type="number" placeholder="Student LRN" onChange={handleChange} name="studentLRN" value={studentData.studentLRN} />
                    <Input label="Student ID" id="studentID" type="text" placeholder="Student ID" onChange={handleChange} name="studentId" value={studentData.studentId} />
                    <SelectionField label="Student Strand" id="studentStrand" value={studentData.studentStrand} onChange={handleChange} isRequired={true}
                        placeholder="Select strand"
                        options={["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"]}
                    />
                    <Input label="Section" id="studentSection" type="text" placeholder="Section" onChange={handleChange} name="studentSection" value={studentData.studentSection} />
                    <button type="submit">Register Student</button>
                </form>
            </div>
            
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => reloadPage()} />}
            
        </div>
    );
}