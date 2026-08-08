type NotificationProps = {
    title: string;
    message: string;
    onClose: () => void;
};



function NotificationCard({ title, message, onClose }: NotificationProps) {
    return (
        <div className="notification-card">
            <h3>{title}</h3>
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default NotificationCard;