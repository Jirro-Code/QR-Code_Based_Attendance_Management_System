import icp from "../assets/icp.png";

type NavbarProps = {
    dashPath: string;
    profilePath: string;
}

export const Navbar = ({ dashPath, profilePath }: NavbarProps) => {
    return(
        <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-md">
            <div className="flex items-center gap-2">
                <img src={icp} alt="Logo" className="h-10 w-10" />
                <p className="text-2xl font-bold text-gray-800 ">AttendScan</p>
            </div>
            <ul className="flex gap-4 tracking-tight">
                <li className="text-slate-700 hover:text-gray-900 font-semibold transition-colors"><a href={dashPath}>Dashboard</a></li>
                <li className="text-slate-700 hover:text-gray-900 font-semibold transition-colors"><a href={profilePath}>Profile</a></li>
            </ul>
        </nav>
    )
}