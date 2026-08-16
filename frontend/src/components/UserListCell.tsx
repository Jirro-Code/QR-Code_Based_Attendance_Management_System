import { type User } from "../services/users";
import { Trash2, Eye } from 'lucide-react';

type ListCellProps = {
    user: Partial<User>;
    number: number;
    onDelete: () => void;
    onLoadView: () => void;
};

export const UserListCell = ({
    user,
    number,
    onDelete,
    onLoadView,
}: ListCellProps) => {
    return (
        <div className={number%2 === 0 ? "bg-white grid grid-cols-6 items-center px-5 py-4 text-sm" : "bg-gray-200 grid grid-cols-6 items-center px-5 py-4 text-sm"}>
            {/* Number */}
            <div className="text-gray-500">
                {number}
            </div>

            {/* Name */}
            <div className="font-medium text-gray-800">
                {user.username}
            </div>

            {/* Strand */}
            <div className="text-gray-600">
                {user.studentStrand}
            </div>

            {/* Section */}
            <div className="text-gray-600">
                {user.studentSection}
            </div>

            {/* Student ID */}
            <div className="text-gray-600">
                {user.studentId}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onLoadView}
                    className="rounded-md px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                >
                    <Eye size={17} />
                </button>

                <button
                    onClick={onDelete}
                    className="rounded-md px-4 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};