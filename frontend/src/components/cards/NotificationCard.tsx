import { CancelButton } from "../Button.tsx";

type NotificationProps = {
    title: string;
    message: string;
    onClose: () => void;
};


export const NotificationCard = ({ title, message, onClose }: NotificationProps) => {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border min-h-27 border-gray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2 max-w-sm w-full z-200">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <CancelButton onClose={onClose} color="gray-800" />
            </div>
            <p className="text-gray-600 text-sm">{message}</p>
        </div>
    );
}
