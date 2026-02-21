import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSocket } from "./useSocket";
import { useAuth } from "../features/auth/AuthContext";

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

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
    });

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user?._id]);

  return { notifications };
}
