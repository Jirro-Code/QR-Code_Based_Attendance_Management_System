import { type User } from "../services/users";

function ListCell({ user, onUpdate, onLoadUpdate, onDelete, onLoadDelete}: {  user: User, onUpdate: () => void, onDelete: () => void, onLoadUpdate: () => void, onLoadDelete: () => void }) {

    function handleUpdate() {
        onUpdate();
        onLoadUpdate();
    }
    function handleDelete() {
        onDelete();
        onLoadDelete();
    }
    
    return (
        <div className="list-cell">
            <p><b>Username:</b> {user.username}, <b>Email:</b> {user.email}, <b>Role:</b> {user.role}</p>
            <button onClick={handleUpdate}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default ListCell;