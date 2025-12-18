import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    if (userId) {
      socketRef.current.emit("join", userId);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef;
};
