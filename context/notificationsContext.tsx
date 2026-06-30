"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getSocket }  from "@/hooks/useStocket";
import Cookies from "js-cookie";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  amount?: number;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const BASE_URL = "https://back-end-crm-project.vercel.app/api/notifications";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.data || []);
      setUnreadCount((data.data || []).filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = Cookies.get("admin_token");
      await fetch(`${BASE_URL}/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = Cookies.get("admin_token");
      await fetch(`${BASE_URL}/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  // ✅ بنعمل fetch مباشرة من غير استدعاء دالة setState جوا الـ effect
  const loadNotifications = async () => {
    try {
      const token = Cookies.get("admin_token");
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.data || []);
      setUnreadCount((data.data || []).filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error(error);
    }
  };

  loadNotifications(); 

  const socket = getSocket();
  socket.on("newNotification", (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  return () => {
    socket.off("newNotification");
  };
}, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}