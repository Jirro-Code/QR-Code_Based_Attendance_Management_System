import { type User } from "../../services/users";
import { Archive, ArchiveRestore, Eye } from 'lucide-react';

type ListCellProps = {
    user: Partial<User>;
    number: number;
    onArchive?: () => void;
    onRestore?: () => void;
    onLoadView: () => void;
};

export const UserListCell = ({ user, number, onArchive, onRestore, onLoadView }: ListCellProps) => {
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
                {
                    onArchive && (
                        <button onClick={onArchive} className="rounded-md px-2 py-1 text-sm text-red-800 hover:bg-red-50 flex flex-col items-center">
                            <Archive size={15} />
                            Archive
                        </button>
                    )
                }
                {
                    onRestore && (
                        <button onClick={onRestore} className="rounded-md px-2 py-1 text-sm text-blue-800 hover:bg-blue-50 flex flex-col items-center">
                            <ArchiveRestore size={15} />
                            Restore
                        </button>
                    )
                }
            </div>
        </div>
    );
};