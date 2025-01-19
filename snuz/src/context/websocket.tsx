import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from './auth';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WS_ROOT = 'ws://alvicorn-fastapi--8000.prod1.defang.dev/ws';

interface WebSocketMessage {
  operation: string;
  username: string;
  data: any;
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { username } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (!username) return;

    // Clean up existing connection if any
    if (ws.current) {
      ws.current.close();
    }

    // Connect to WebSocket with username
    const wsUrl = `${WS_ROOT}/${username}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      setIsConnected(true);
      // Clear any existing reconnect timeout
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = undefined;
      }
    };

    ws.current.onmessage = async (e) => {
      try {
        const message: WebSocketMessage = JSON.parse(e.data);
        console.log('Message from server:', message);

        // Handle sleep status notifications
        if (message.operation === 'sleep_status') {
          const { username: sleepingUser, data } = message;
          const action = data.is_asleep ? 'went to sleep' : 'woke up';
          
          // Show notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Sleep Update 😴',
              body: `${sleepingUser} ${action}!`,
              sound: true,
              data: { username: sleepingUser, ...data },
            },
            trigger: null, // Send immediately
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error:', e);
      setIsConnected(false);
    };

    ws.current.onclose = (e) => {
      console.log('WebSocket connection closed:', e.code, e.reason);
      setIsConnected(false);
      
      // Attempt to reconnect after 5 seconds
      reconnectTimeout.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 5000);
    };
  };

  useEffect(() => {
    connect();

    // Clean up function
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [username]);

  const sendMessage = (message: any) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected, attempting to reconnect...');
      connect();
      return;
    }
    try {
      ws.current.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  };

  const value = {
    isConnected,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
