import { io, Socket } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "") || "http://localhost:5000";

// Singleton socket instance
export let socket: Socket | null = null;

export const getSocket = (userId?: string) => {
  if (!socket && userId) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      query: { userId },
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ["websocket"]
    });
    console.log("🔌 Socket initialized for user:", userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected");
  }
};
