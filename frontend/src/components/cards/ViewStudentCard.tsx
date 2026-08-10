import { type User } from "../../services/users";

type ViewStudentCardProps = {
    student: Partial<User>;
    onClose: () => void;
};

export const ViewStudentCard = ({ student, onClose }: ViewStudentCardProps) => {
    
    return (
        <div className="view-student-card">
            <p><b>Username:</b> {student.username}</p>
            <p><b>Email:</b> {student.email}</p>
            <p><b>Student ID:</b> {student.studentId}</p>
            <p><b>Student LRN:</b> {student.studentLRN}</p>
            <p><b>Student Strand:</b> {student.studentStrand}</p>
            <p><b>Student Section:</b> {student.studentSection}</p>
            <p><b>Created At:</b> {student.createdAt}</p>
            <p><b>Updated At:</b> {student.updatedAt}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}