"use client";

import { useAuth } from "@payloadcms/ui";
import {
  Bell,
  BookOpen,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  session_date: string;
  is_read: boolean;
  class?: {
    id: string;
    name?: string;
  };
}

export default function BeforeDashboard() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(
        `/api/get-notifications?recipientId=${user.id}&limit=20`,
      );
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/get-notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      // Cập nhật state: đánh dấu đã đọc (không xóa ngay)
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await fetch("/api/get-notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      // Xóa khỏi state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Lỗi khi xóa thông báo:", err);
    }
  };

  const formatSessionTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const formatSessionDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center bg-slate-50 gap-80">
        <Image src="/logo.png" alt="Logo" width={100} height={48} priority />
        <h2 className="text-4xl text-center text-red-600">
          Chào mừng năm mới 2026
        </h2>
         <div className="relative ml-6 flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: unreadCount > 0
                ? "linear-gradient(135deg, #f97316, #f59e0b)"
                : "#e2e8f0",
              boxShadow: unreadCount > 0
                ? "0 4px 14px rgba(249, 115, 22, 0.4)"
                : "none",
              transition: "all 0.3s ease",
            }}
          >
            <Bell
              size={22}
              className={unreadCount > 0 ? "text-white" : "text-gray-500"}
              style={{
                animation: unreadCount > 0 ? "bellShake 2s ease-in-out infinite" : "none",
              }}
            />
          </div>
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              style={{ background: "#dc2626" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Welcome + Bell Icon */}
      <div className="mt-10 flex items-center ml-32">
        <Image
          src="/tutor_hello.png"
          alt="Logo"
          width={150}
          height={48}
          priority
        />
        <h3 className="text-3xl text-center text-blue-950">
          Chào mừng bạn đến với hệ thống quản lý trung tâm IELTS THE TUTORS
        </h3>

        {/* Bell Icon with Badge */}
       
      </div>

      {/* Notification Panel */}
      {notifications.length > 0 && (
        <div className="mt-8 mx-4">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#ffffff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              border: "1px solid #fed7aa",
            }}
          >
            {/* Panel Header */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #f97316, #f59e0b)",
              }}
            >
              <Bell className="text-white" size={22} />
              <h3 className="text-lg font-bold text-white">
                Nhắc nhở điểm danh
              </h3>
              {unreadCount > 0 && (
                <span
                  className="text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center ml-auto"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    color: "#ea580c",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Scrollable Notification List — max 3 visible, scroll for more */}
            <div
              className="divide-y divide-gray-100 overflow-y-auto"
              style={{ maxHeight: "330px" }}
            >
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-6 py-4 flex items-start gap-4 transition-all duration-200"
                  style={{
                    background: notification.is_read ? "#f9fafb" : "#fffbeb",
                    opacity: notification.is_read ? 0.7 : 1,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
                    style={{
                      background: notification.is_read ? "#e5e7eb" : "#ffedd5",
                    }}
                  >
                    <BookOpen
                      size={20}
                      className={
                        notification.is_read
                          ? "text-gray-400"
                          : "text-orange-600"
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-base"
                      style={{
                        fontWeight: notification.is_read ? 400 : 600,
                        color: notification.is_read ? "#6b7280" : "#111827",
                        textDecoration: notification.is_read
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {notification.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatSessionTime(notification.session_date)}
                      </span>
                      <span>
                        {formatSessionDate(notification.session_date)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col gap-2 mt-1">
                    {/* Mark as Read */}
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded-lg p-2 transition-all duration-200"
                        style={{
                          color: "#16a34a",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dcfce7";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}

                    {/* Delete — chỉ hiện khi đã đọc */}
                    {notification.is_read && (
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="rounded-lg p-2 transition-all duration-200"
                        style={{
                          color: "#dc2626",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                        title="Xóa thông báo"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-8 mx-4 text-center text-gray-400 py-4">
          Đang tải thông báo...
        </div>
      )}

      {/* Bell shake animation */}
      <style>{`
        @keyframes bellShake {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(12deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(8deg); }
          40% { transform: rotate(-6deg); }
          50% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
