import { useState } from "react";
import { Header } from "../../../components/Header.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { SelectionField } from "../../../components/SelectionField.tsx";
import { type StudentRegisterPayload } from "../../../services/auth.ts";
import { useCreate } from "../../../hooks/useCreate.ts";
import { useScrollToTop } from "../../../hooks/useScrollToTop.ts";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";

export const RegisterStudent = () => {
    useScrollToTop("/register-student");
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
        <>
            <Header title="Register Student" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    
                    <h1 className="text-2xl font-bold text-gray-800">Register Student</h1>
                    <p className="text-gray-600 mb-4">Welcome to the student registration page!</p>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3">
                        
                        <h2 className="text-lg font-semibold text-gray-700">Register a New Student</h2>
                        <p className="text-red-600 text-sm">{error}</p>
                        
                        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
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
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2">Register Student</button>
                        </form>
                    </div>
                    
                    {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => reloadPage()} />}
                    
                </div>
            </div>
        </>
    );
}