
function NotificationCard({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
    return (
        <div className="notification-card">
            <h3>{title}</h3>
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default NotificationCard;