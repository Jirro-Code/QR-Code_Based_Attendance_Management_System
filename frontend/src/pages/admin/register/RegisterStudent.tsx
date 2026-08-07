import { useState } from "react";
import { BackButton } from "../../../components/Button.tsx";
import Input from "../../../components/Input.tsx";
import SelectionField from "../../../components/SelectionField.tsx";
import { type StudentRegisterPayload } from "../../../services/auth.ts";
import useRegister from "../../../hooks/useRegister.ts";


function StudentRegister() {
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
    const {handleRegister} = useRegister("/student-login", studentData, setError);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === "confirmPassword") {
            setConfirmPassword(e.target.value);
            return;
        }
        
        setStudentData((current) => ({...current, [e.target.name]: e.target.value}));
    }
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (studentData.password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        handleRegister();
    }
    
    
    return (
        <div className="registerStudentPage">
            <h1>Register Student</h1>
            <p>Welcome to the student registration page!</p>
            <div className="registerStudentForm">
                
                <h2>Register a New Student</h2>
                <p>{error}</p>
                <form onSubmit={handleSubmit}>
                    <Input label="Student Name" id="studentName" type="text" placeholder="Student Name" onChange={handleChange} name="username" />
                    <Input label="Email" id="studentEmail" type="email" placeholder="Email" onChange={handleChange} name="email" />
                    <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleChange} name="password" />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" />
                    <Input label="Student LRN" id="studentLRN" type="number" placeholder="Student LRN" onChange={handleChange} name="studentLRN" />
                    <Input label="Student ID" id="studentID" type="text" placeholder="Student ID" onChange={handleChange} name="studentId" />
                    <SelectionField label="Student Strand" id="studentStrand" value={studentData.studentStrand} onChange={handleChange}
                        placeholder="Select strand"
                        options={[
                            "ICT",
                            "HRCTO",
                            "GAS",
                            "HUMSS",
                            "ABM",
                            "STEM",
                            "AAD"
                        ]}
                    />
                    <Input label="Section" id="studentSection" type="text" placeholder="Section" onChange={handleChange} name="studentSection" />
                    
                    <button type="submit">Register Student</button>
                </form>
            </div>
            
            <div className="backButton">
                <BackButton path="/create-user" />
            </div>
            
        </div>
    );
}
export default StudentRegister;