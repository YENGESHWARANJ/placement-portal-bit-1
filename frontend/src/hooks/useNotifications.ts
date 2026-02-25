import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSocket } from "./useSocket";
import { useAuth } from "../features/auth/AuthContext";
import api from "../services/api";

export const READ_IDS_KEY = "placement_notifications_read";

export const loadReadIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

export const saveReadIds = (ids: Set<string>) => {
  localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event('notifications_read_updated'));
};

export function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get<{ notices: any[] }>("/notices");
        const notices = res.data?.notices || [];
        const readIds = loadReadIds();
        setUnreadCount(notices.filter(n => !readIds.has(n._id || n.id)).length);
      } catch (e) {
        // ignore
      }
    };
    fetchUnread();

    const handleUpdate = () => fetchUnread();
    window.addEventListener('notifications_read_updated', handleUpdate);
    return () => window.removeEventListener('notifications_read_updated', handleUpdate);
  }, []);

  return unreadCount;
}

export default function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Only connect if user is logged in AND has an ID (avoiding stale state)
    if (!user?._id) return;

    const socket = getSocket(user._id);
    if (!socket) return;

    // Handle connection logic
    socket.on("connect", () => {
      console.log(`✅ Socket connected as ${user.name}`);
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);

      // Toast notification
      toast(data.message, {
        icon: "🔔",
        style: {
          borderRadius: "12px",
          background: "#1e293b",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "bold"
        }
      });
    });

    socket.on("global_notification", (data) => {
      toast(data.message, {
        icon: data.type === 'success' ? '🏆' : '🚀',
        duration: 5000,
        style: {
          borderRadius: "16px",
          background: "rgba(30, 41, 59, 0.85)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "bold",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }
      });
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
    });

    return () => {
      socket.off("notification");
      socket.off("global_notification");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user?._id]);

  return { notifications };
}
