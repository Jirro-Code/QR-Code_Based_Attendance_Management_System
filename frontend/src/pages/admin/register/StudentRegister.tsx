import { useState } from "react";
import { BackButton } from "../../../components/Button.tsx";
import Input from "../../../components/Input.tsx";
import SelectionField from "../../../components/SelectionField.tsx";
import { useNavigate } from "react-router-dom";
function RegisterStudent() {
    const navigate = useNavigate();
    
    const [studentData, setStudentData] = useState({
        role: "user",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        lrn: "",
        id: "",
        studentStrand: "",
        section: ""
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentData({...studentData, [e.target.name]: e.target.value});
    }
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (studentData.password !== studentData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                role: studentData.role,
                username: studentData.name,
                email: studentData.email,
                password: studentData.password,
                studentLRN: studentData.lrn,
                studentId: studentData.id,
                studentStrand: studentData.studentStrand,
                studentSection: studentData.section
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log("Student registered successfully:", data);
            alert("Student registered successfully!");
        } 
        else if(response.status === 401){
            console.error("Unauthorized:", data);
            alert("Unauthorized. Please log in as an admin.");
            navigate("/admin-login");
        }
        else if(response.status === 409){
            console.error("Conflict:", data);
            alert("A user with this email or student ID already exists.");
        }
        else {
            console.error("Error registering student:", data);
            console.log("Response status:", response.status);
            alert(`Error registering student: ${data.message || "Unknown error"}`);
        }
    }
    
    
    return (
        <div className="registerStudentPage">
            <h1>Register Student</h1>
            <p>Welcome to the student registration page!</p>
            <div className="registerStudentForm">
                <h2>Register a New Student</h2>
                <form onSubmit={handleSubmit}>
                    <Input label="Student Name" id="studentName" type="text" placeholder="Student Name" onChange={handleChange} name="name" />
                    <Input label="Email" id="studentEmail" type="email" placeholder="Email" onChange={handleChange} name="email" />
                    <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleChange} name="password" />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" />
                    <Input label="Student LRN" id="studentLRN" type="text" placeholder="Student LRN" onChange={handleChange} name="lrn" />
                    <Input label="Student ID" id="studentID" type="text" placeholder="Student ID" onChange={handleChange} name="id" />
                    <SelectionField label="Student Strand" id="studentStrand" value={studentData.studentStrand} onChange={(e) => setStudentData({ ...studentData, studentStrand: e.target.value })}
                        options={[
                            "",
                            "ICT",
                            "HRCTO",
                            "GAS",
                            "HUMSS",
                            "ABM",
                            "STEM",
                            "AAD"
                        ]}
                    />
                    <Input label="Section" id="section" type="text" placeholder="Section" onChange={handleChange} name="section" />
                    
                    <button type="submit">Register Student</button>
                </form>
            </div>
            <div className="backButton">
                <BackButton />
            </div>
        </div>
    );
}
export default RegisterStudent;