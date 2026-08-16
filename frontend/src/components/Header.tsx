import { BackButton } from "./Button/Button.tsx";

type HeaderProps = {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    return(
        <header className="top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-md">
            <div className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <h1>{title}</h1>
            </div>
            <BackButton path="/admin-dashboard" />
        </header>
    )
}