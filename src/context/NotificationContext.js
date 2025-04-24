import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import socketService from "../api/services/socketService";
import userService from "../api/services/userService";

// Create a context for notifications
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch existing notifications from the database
  useEffect(() => {
    const fetchExistingNotifications = async () => {
      setLoading(true);
      try {
        const response = await userService.getNotifications();

        if (response && Array.isArray(response.notifications)) {
          console.log("Existing notifications:", response);
          // Format notifications to match our expected structure
          const formattedNotifications = response.notifications.map(
            (notification) => ({
              id:
                notification.transaction_id ||
                notification._id ||
                notification.id,
              message: notification.message,
              sender_name: notification.sender_name,
              mobile_number: notification.mobile_number,
              amount: notification.amount,
              status: notification.status,
              high_alert_date: notification.high_alert_date,
              confidence: notification.confidence,
              read: notification.read || false,
              timestamp:
                notification.timestamp ||
                notification.created_at ||
                new Date().toISOString(),
            })
          );

          setNotifications(formattedNotifications);

          // Count unread notifications
          const unreadCount = formattedNotifications.filter(
            (n) => !n.read
          ).length;
          setUnreadCount(unreadCount);
        }
      } catch (error) {
        console.error("Error fetching existing notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingNotifications();
  }, []);

  // Connect to socket when the provider mounts
  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    // Subscribe to new transaction notifications
    socketService.subscribe("new_transaction", handleNewTransaction);

    // Clean up on unmount
    return () => {
      socketService.unsubscribe("new_transaction", handleNewTransaction);
      socketService.disconnect();
    };
  }, []);

  // Handle new transaction notifications
  const handleNewTransaction = (data) => {
    // Add the notification to our state
    const newNotification = {
      id: data.transaction_id || Date.now().toString(),
      message: data.message,
      sender_name: data.sender_name,
      mobile_number: data.mobile_number,
      amount: data.amount,
      status: data.status,
      high_alert_date: data.high_alert_date,
      confidence: data.confidence,
      read: false,
      timestamp: new Date().toISOString(),
    };

    // Check if notification already exists to avoid duplicates
    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === newNotification.id);
      if (exists) return prev;
      return [newNotification, ...prev];
    });

    setUnreadCount((prev) => prev + 1);

    // Show toast notification based on status
    if (data.status === "Suspicious") {
      toast.error(
        <div>
          <strong>Suspicious Transaction Detected!</strong>
          <div>ID: {data.transaction_id}</div>
          <div>Amount: {data.amount}</div>
          <div>Confidence: {data.confidence}</div>
        </div>,
        { autoClose: 8000 }
      );
    } else {
      toast.success(
        <div>
          <strong>New Genuine Transaction</strong>
          <div>ID: {data.transaction_id}</div>
          <div>Amount: {data.amount}</div>
        </div>,
        { autoClose: 5000 }
      );
    }
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
