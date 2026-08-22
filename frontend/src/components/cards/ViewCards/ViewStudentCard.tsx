import { type User } from "../../../services/users.ts";
import { CancelButton } from "../../Button.tsx";
import { UserPen } from "lucide-react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";

type ViewStudentCardProps = {
    student: Partial<User>;
    onClose: () => void;
    onUpdate: () => void;
};

export const ViewStudentCard = ({ student, onClose, onUpdate }: ViewStudentCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center h-full justify-center z-30 p-4 backdrop-blur-[2px]">
            <div className="flex flex-col w-full max-w-md h-3/4 items-center justify-center">
                
                <div className="bg-blue-800 p-6 rounded-t-lg shadow-md flex flex-col justify-center max-w-md w-3/4 h-20 relative">
                    <div className="absolute top-4 right-4"><CancelButton onClose={onClose} /></div>
                    <p className="text-white text-xl ml-5"><b>{student.username}</b></p>
                </div>
                
                <div className="bg-white rounded-b-lg shadow-md flex flex-col justify-center items-center gap-2 max-w-md w-3/4 h-2/3 relative">
                    <div className="flex flex-col gap-2" >
                        <p className="text-gray-700"><b>Email:</b> {student.email}</p>
                        <p className="text-gray-700"><b>Student ID:</b> {student.studentId}</p>
                        <p className="text-gray-700"><b>Student LRN:</b> {student.studentLRN}</p>
                        <p className="text-gray-700"><b>Student Strand:</b> {student.studentStrand}</p>
                        <p className="text-gray-700"><b>Student Section:</b> {student.studentSection}</p>
                        <p className="text-gray-500 text-sm"><b>Created at:</b> {formatDateTime(student.createdAt!)}</p>
                        <p className="text-gray-500 text-sm"><b>Last updated at:</b> {formatDateTime(student.updatedAt!)}</p>
                        <button onClick={onUpdate} className="mt-5 flex items-center justify-center gap-2 bg-none border border-blue-900 hover:bg-gray-100 text-blue-900 py-1 px-4 rounded"><UserPen size={16} /> Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}