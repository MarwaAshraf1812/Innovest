import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE } from '../../../config/api';

export function useSocket({ currentUserId, onMessageReceived }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!currentUserId) return;

    // Establish WebSocket Connection
    const socket = io(API_BASE, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Join private user room to receive target notifications/messages
      socket.emit('join', currentUserId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen to real-time incoming messages
    socket.on('receiveMessage', (message) => {
      onMessageReceived(message);
    });

    // Listen to real-time typing indicators
    socket.on('user_typing', ({ sender_id }) => {
      setTypingUsers((prev) => ({ ...prev, [sender_id]: true }));
    });

    socket.on('user_stop_typing', ({ sender_id }) => {
      setTypingUsers((prev) => ({ ...prev, [sender_id]: false }));
    });

    // Cleanup connection & listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receiveMessage');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.disconnect();
    };
  }, [currentUserId, onMessageReceived]);

  const sendTypingEvent = (receiverId, isTyping) => {
    if (!socketRef.current) return;
    const eventName = isTyping ? 'typing' : 'stopTyping';
    // Emit event to server room
    socketRef.current.emit(eventName, {
      sender_id: currentUserId,
      receiver_id: receiverId,
    });
  };

  return {
    socket: socketRef.current,
    isConnected,
    typingUsers,
    sendTypingEvent,
  };
}
