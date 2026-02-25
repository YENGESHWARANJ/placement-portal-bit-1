import useNotifications from "../../hooks/useNotifications";

export default function NotificationCenter() {
  const notificationsHook = useNotifications();
  const notifications: any[] = Array.isArray(notificationsHook) ? notificationsHook : (notificationsHook as any)?.notifications ?? [];

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
