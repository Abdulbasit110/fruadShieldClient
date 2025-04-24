import { io } from "socket.io-client";
import { API_BASE_URL } from "../config";

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect() {
    if (this.socket) return; // Already connected

    // Connect to the socket server
    this.socket = io(API_BASE_URL, {
      transports: ["websocket"],
      path: "/socket.io",
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    // Set up connection event handlers
    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for new transaction events
    this.socket.on("new_transaction", (data) => {
      console.log("New transaction notification received:", data);
      if (this.callbacks["new_transaction"]) {
        this.callbacks["new_transaction"].forEach((callback) => callback(data));
      }
    });
  }

  // Subscribe to events
  subscribe(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  // Unsubscribe from events
  unsubscribe(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
