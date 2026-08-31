import { type User } from "../../../services/users.ts";
import { CancelButton } from "../../Button.tsx";
import { UserPen } from "lucide-react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";
import { useView } from "../../../hooks/useView.ts";
import { useEffect, useState } from "react";

type ViewStudentCardProps = {
    student: Partial<User>;
    onClose: () => void;
    onUpdate: () => void;
};

export const ViewStudentCard = ({ student, onClose, onUpdate }: ViewStudentCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    const { useViewProfilePicture } = useView();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (student.id) {
                setIsLoadingPicture(true);
                const picture = await useViewProfilePicture(student.id, () => {});
                setProfilePicture(picture);
                setIsLoadingPicture(false);
            }
        };
        fetchProfilePicture();
    }, [student.id, student.updatedAt]);
    
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center h-full justify-center z-30 backdrop-blur-[2px]">
            <div className="flex flex-col w-full max-w-175 items-center justify-center">
                
                <div className="bg-blue-800 border-t-2 border-l-2 border-r-2 border-black p-6 rounded-t-lg shadow-md flex items-center justify-between w-3/4 h-20 relative">
                    <p className="text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap"><b>{student.username}</b></p>
                    <CancelButton onClose={() => onClose()} />
                </div>
                
                <div className="bg-white border-2 border-black rounded-b-lg shadow-md flex flex-col w-3/4 px-6 py-6 gap-2">
                    
                    <div className="flex justify-center items-center mb-1">
                        {isLoadingPicture ? (
                            <div className="w-40 h-40 rounded-sm bg-gray-100 ring-4 ring-gray-50 animate-pulse" />
                        ) : profilePicture ? (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="w-40 h-40 rounded-sm object-cover ring-4 ring-gray-100"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-sm bg-gray-100 ring-4 ring-gray-50 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No Photo</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full flex flex-col divide-y divide-gray-100 border-y border-gray-100">
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="font-medium text-gray-900">Email:</span>
                            <span className="text-gray-700">{student.email}</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="font-medium text-gray-900">Student ID:</span>
                            <span className="text-gray-700">{student.studentId}</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="font-medium text-gray-900">Student LRN:</span>
                            <span className="text-gray-700">{student.studentLRN}</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="font-medium text-gray-900">Student Strand:</span>
                            <span className="text-gray-700">{student.studentStrand}</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="font-medium text-gray-900">Student Section:</span>
                            <span className="text-gray-700">{student.studentSection}</span>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2 mt-1 flex flex-col gap-1">
                        <p className="text-gray-500 text-sm"><b>Created at:</b> {formatDateTime(student.createdAt!)}</p>
                        <p className="text-gray-500 text-sm"><b>Last updated at:</b> {formatDateTime(student.updatedAt!)}</p>
                    </div>
                    
                    <div className="flex justify-center items-center mt-5">
                        <button onClick={onUpdate} className="flex items-center w-full justify-center gap-2 bg-none border border-blue-900 hover:bg-gray-100 text-blue-900 py-1 px-4 rounded transition-colors">
                            <UserPen size={16} /> Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}