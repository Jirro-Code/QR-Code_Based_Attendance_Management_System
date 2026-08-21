import { type User } from "../../services/users";
import { Trash2, Eye } from 'lucide-react';

type ListCellProps = {
    user: Partial<User>;
    number: number;
    onDelete: () => void;
    onLoadView: () => void;
};

export const UserListCell = ({ user, number, onDelete, onLoadView }: ListCellProps) => {
    return (
        <div className={number%2 === 0 ? "bg-white grid grid-cols-[0.3fr_repeat(5,1fr)] items-center px-5 py-4 text-sm" : "bg-gray-200 grid grid-cols-[0.3fr_repeat(5,1fr)] items-center px-5 py-4 text-sm"}>
            <div className="text-gray-500">{number}</div>
            <div className="font-medium text-gray-800">{user.username}</div>
            <div className="text-gray-600">{user.studentStrand}</div>
            <div className="text-gray-600">{user.studentSection}</div>
            <div className="text-gray-600">{user.studentId}</div>
            
            <div className="flex items-center">
                <button onClick={onLoadView} className="rounded-md px-2 py-1 text-sm text-blue-800 hover:bg-blue-50 flex flex-col items-center">
                    <Eye size={15} />
                    View
                </button>
                
                <button onClick={onDelete} className="rounded-md px-2 py-1 text-sm text-red-800 hover:bg-red-50 flex flex-col items-center">
                    <Trash2 size={15} />
                    Delete
                </button>
            </div>
        </div>
    );
};