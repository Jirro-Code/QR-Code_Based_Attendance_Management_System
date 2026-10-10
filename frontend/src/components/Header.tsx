import { BackButton } from "./Button.tsx";

type HeaderProps = {
    title: string;
    path: string;
}

export const Header = ({ title, path }: HeaderProps) => {
    return(
        <header className="top-0 z-50 flex items-center bg-white px-3 sm:px-6 py-4 shadow-md">
            <BackButton path={path} />
            <div className="min-w-0 text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <h1 className="truncate" title={title}>{title}</h1>
            </div>
        </header>
    )
}