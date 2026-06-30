"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      transports: ["websocket"],
    });
  }
  return socket;
};

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();

    return () => {
      // لا نغلق الاتصال لأنه Shared
    };
  }, []);

  return socketRef.current;
};