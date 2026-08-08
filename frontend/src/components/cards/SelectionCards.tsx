import {useNavigate} from "react-router-dom";

type SelectionCardProps = {
    onClose: () => void;
};

function SelectionCard({ onClose }: SelectionCardProps) {
    
    const navigate = useNavigate();
    
    return (
        <div className="selection-cards">
            <h1>Create User</h1>
            <p>Welcome to the create user page!</p>
            <div className="createUserForm">
                <h2>Create a New User</h2>
                <button onClick={() => {navigate("/create-student");}}>STUDENT</button>
                <button onClick={() => {navigate("/create-admin");}}>ADMIN</button>
            </div>
            <div className="backButton">
                <button onClick={() => onClose()}>Back</button>
            </div>  
        </div>
    )
}


export default SelectionCard;