type NotificationProps = {
    title: string;
    message: string;
    onClose: () => void;
};


export const NotificationCard = ({ title, message, onClose }: NotificationProps) => {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2 max-w-sm w-full z-50">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
            <button onClick={onClose} className="self-end bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold py-1 px-3 rounded">Close</button>
        </div>
    );
}
