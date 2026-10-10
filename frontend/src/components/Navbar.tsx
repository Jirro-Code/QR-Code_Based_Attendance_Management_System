import { useNavigate } from "react-router-dom";
import { type User } from "../services/users.ts";
import icp from "../assets/icp.png";


type NavbarProps = {
    dashPath: string;
    profilePath: string;
    user: Partial<User>;
}

export const Navbar = ({ dashPath, profilePath, user }: NavbarProps) => {
    const navigate = useNavigate();
    
    return(
        <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-md">
            <div className="flex items-center gap-2">
                <img src={icp} alt="Logo" className="h-10 w-10" />
                <p className="text-2xl font-bold text-gray-800 ">AttendScan</p>
            </div>
            <ul className="flex gap-2 tracking-tight">
                <li className="text-slate-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg py-1.5 px-3 font-semibold transition-colors"><button onClick={() => navigate(dashPath)}>Dashboard</button></li>
                <li className="text-slate-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg py-1.5 px-3 font-semibold transition-colors"><button onClick={() => navigate(profilePath, { state: { user: user } })}>Profile</button></li>
            </ul>
        </nav>
    )
}