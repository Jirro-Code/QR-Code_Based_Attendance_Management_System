import { type User } from "../services/users";

type ListCellProps = {
    user: Partial<User>;
    onUpdate: () => void;
    onLoadUpdate: () => void;
    onDelete: () => void;
    onLoadDelete: () => void;
    onLoadView: () => void;
};

export const ListCell = ({ user, onUpdate, onLoadUpdate, onDelete, onLoadDelete, onLoadView }: ListCellProps) => {
    
    const handleUpdate = () => {
        onUpdate();
        onLoadUpdate();
    }
    const handleDelete = () => {
        onDelete();
        onLoadDelete();
    }
    
    return (
        <div className="list-cell">
            <p><b>Username:</b> {user.username}, <b>Email:</b> {user.email}, <b>Role:</b> {user.role}</p>
            <button onClick={handleUpdate}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => { onLoadView(); }}>View</button>
        </div>
    );
}