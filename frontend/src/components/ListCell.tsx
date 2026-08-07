import { type User } from "../services/users";

function ListCell({ user, onUpdate }: {  user: User, onUpdate: () => void }) {
    return (
        <div className="list-cell">
            <p><b>Username:</b> {user.username}, <b>Email:</b> {user.email}, <b>Role:</b> {user.role}</p>
            <button onClick={() => onUpdate()}>Edit</button>
            <button onClick={() => console.log("Delete user:", user)}>Delete</button>
        </div>
    );
}

export default ListCell;