import useNotifications from "../../hooks/useNotifications";

export default function NotificationCenter() {
  const notifications = useNotifications();

  return (
    <div className="notification-panel">
      {notifications.map((n, i) => (
        <div key={i} className="notification">
          {n.message}
        </div>
      ))}
    </div>
  );
}
