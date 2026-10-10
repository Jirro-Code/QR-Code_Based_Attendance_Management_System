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
        <div className={`${number % 2 === 0 ? "bg-white" : "bg-gray-50"} min-w-160 grid grid-cols-[0.3fr_repeat(5,1fr)] items-center px-5 py-3.5 text-sm hover:bg-blue-50/50 transition-colors`}>
            <div className="text-gray-500 truncate">{number}</div>
            <div className="font-semibold text-gray-800 truncate">{user.username}</div>
            <div className="text-gray-600">{user.studentStrand}</div>
            <div className="text-gray-600">{user.studentSection}</div>
            <div className="text-gray-600">{user.studentId}</div>
            
            <div className="flex shrink-0 items-center whitespace-nowrap">
                <button onClick={onLoadView} className="rounded-md px-2 py-1 text-sm text-blue-800 hover:bg-blue-50 flex flex-col items-center">
                    <Eye size={17} />
                </button>
                {
                    onArchive && (
                        <button onClick={onArchive} className="rounded-md px-2 py-1 text-sm text-red-800 hover:bg-red-50 flex flex-col items-center">
                            <Archive size={17} />
                        </button>
                    )
                }
                {
                    onRestore && (
                        <button onClick={onRestore} className="rounded-md px-2 py-1 text-sm text-green-800 hover:bg-green-50 flex flex-col items-center">
                            <ArchiveRestore size={17} />
                        </button>
                    )
                }
            </div>
        </div>
    );
};