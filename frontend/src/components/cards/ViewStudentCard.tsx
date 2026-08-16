import { type User } from "../../services/users.ts";
import { CancelButton } from "../Button/Button.tsx";

type ViewStudentCardProps = {
    student: Partial<User>;
    onClose: () => void;
    onUpdate: () => void;
};

export const ViewStudentCard = ({ student, onClose, onUpdate }: ViewStudentCardProps) => {
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
            <div className="flex flex-col w-full max-w-md h-3/4 items-center justify-center">
            
                <div className="bg-blue-800 p-6 rounded-t-lg shadow-md flex flex-col justify-center max-w-md w-3/4 h-20 relative">
                    <div className="absolute top-4 right-4"><CancelButton onClose={onClose} /></div>
                    <p className="text-white text-xl ml-5"><b>{student.username}</b></p>
                </div>
                
                <div className="bg-white p-6 rounded-b-lg shadow-md flex flex-col justify-center items-center gap-2 max-w-md w-3/4 h-2/3 relative">
                    <div>
                        <p className="text-gray-700"><b>Email:</b> {student.email}</p>
                        <p className="text-gray-700"><b>Student ID:</b> {student.studentId}</p>
                        <p className="text-gray-700"><b>Student LRN:</b> {student.studentLRN}</p>
                        <p className="text-gray-700"><b>Student Strand:</b> {student.studentStrand}</p>
                        <p className="text-gray-700"><b>Student Section:</b> {student.studentSection}</p>
                        <p className="text-gray-500 text-sm"><b>Created At:</b> {student.createdAt}</p>
                        <p className="text-gray-500 text-sm"><b>Updated At:</b> {student.updatedAt}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={onUpdate} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-3 rounded">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}