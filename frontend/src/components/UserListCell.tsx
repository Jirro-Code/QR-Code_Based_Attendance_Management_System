import { type User } from "../services/users";

type ListCellProps = {
    user: Partial<User>;
    onDelete: () => void;
    onLoadView: () => void;
};

export const UserListCell = ({ user, onDelete, onLoadView }: ListCellProps) => {     
    return (
        <div className="list-cell">
            <p><b>Username:</b> {user.username}, <b>Email:</b> {user.email}, <b>Role:</b> {user.role}</p>
            <button onClick={onDelete}>Delete</button>
            <button onClick={onLoadView}>View</button>
        </div>
    );
}