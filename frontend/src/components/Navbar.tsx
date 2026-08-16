import icp from "../assets/icp.png";

type NavbarProps = {
    dashPath: string;
    profilePath: string;
}

export const Navbar = ({ dashPath, profilePath }: NavbarProps) => {
    return(
        <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-md">
            <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <img src={icp} alt="Logo" className="h-10 w-10" />
                <p>AttendScan</p>
            </div>
            <ul className="flex gap-4 tracking-tight text-slate-900">
                <li><a href={dashPath}>Dashboard</a></li>
                <li><a href={profilePath}>Profile</a></li>
            </ul>
        </nav>
    )
}