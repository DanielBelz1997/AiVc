import { useEffect, useRef, useState, useCallback } from "react";

export interface WebSocketMessage {
  type: string;
  conversation_id: string;
  agent_type?: string;
  message?: string;
  is_typing?: boolean;
  status?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);
        setConnectionError(null);
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("Connection error occurred");
        setIsConnecting(false);
        onError?.(error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        onClose?.();

        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts((prev) => prev + 1);
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Attempting to reconnect... (${
                reconnectAttempts + 1
              }/${maxReconnectAttempts})`
            );
            connect();
          }, reconnectInterval);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          setConnectionError("Maximum reconnection attempts reached");
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionError("Failed to create connection");
      setIsConnecting(false);
    }
  }, [
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval,
    maxReconnectAttempts,
    reconnectAttempts,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Intentional disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setReconnectAttempts(0);
  }, []);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
      return false;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
  };
};
