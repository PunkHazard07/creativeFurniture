import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket?.connected) return;

    const serverUrl = import.meta.env.VITE_BASE_URL;

    // Ensure the URL is properly formatted
    if (!serverUrl) {
      console.error('Server URL is not defined in environment variables');
      return;
    }

    // Clean up any existing connection
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: this.maxReconnectAttempts,
      autoConnect: true,
      path: '/socket.io' // Ensure this matches your server configuration
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      
      // Join dashboard-updates room to receive dashboard events
      if (this.socket.connected) {
        this.socket.emit('join-dashboard');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // The server forcibly disconnected the socket, you might need to reconnect manually
        setTimeout(() => this.connect(), 1000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.unsubscribeAll();
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.socket.off('connect_error');
      this.socket.off('error');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event, callback) {
    if (!this.socket) {
      this.connect();
    }

    this.socket.on(event, callback);
    
    // Store the callback in our listeners map for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (!this.socket) return;
    
    this.socket.off(event, callback);
    
    // Remove from listeners map
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
      if (callbacks.length === 0) {
        this.listeners.delete(event);
      } else {
        this.listeners.set(event, callbacks);
      }
    }
  }

  unsubscribeAll() {
    if (!this.socket) return;
    
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket.off(event, callback);
      });
    });
    
    this.listeners.clear();
  }

  // Utility method to emit events
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket not connected, cannot emit event');
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;