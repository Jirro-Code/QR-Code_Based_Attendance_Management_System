import {useNavigate} from "react-router-dom";
import { BackButton } from "../../../components/Button.tsx";

function CreateUser() {
    
    const navigate = useNavigate();
    
    return (
        <div className="createUserPage">
            <h1>Create User</h1>
            <p>Welcome to the create user page!</p>
            <div className="createUserForm">
                <h2>Create a New User</h2>
                <button onClick={() => {navigate("/create-student");}}>STUDENT</button>
                <button onClick={() => {navigate("/create-admin");}}>ADMIN</button>
            </div>
            <div className="backButton">
                <BackButton />
            </div>  
        </div>
    )
}


export default CreateUser;