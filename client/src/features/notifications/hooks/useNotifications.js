import { useState, useEffect, useCallback, useRef } from 'react';
import {
  notificationService,
  acquireSocket,
  releaseSocket,
  registerUserRoom,
} from '../services/notificationService';

const POLL_INTERVAL_MS = 30_000; // Fallback REST poll every 30s

/**
 * useNotifications – isolated real-time notification hook.
 *
 * Manages three channels simultaneously:
 *  • directMessage    – incoming DMs
 *  • communityAlert   – community administrative events
 *  • system           – platform-wide announcements & account events
 *
 * Returns the unified notification list, unread count, loading flag,
 * and action handlers for the UI layer.
 *
 * @param {string|number|null} userId – The authenticated user's ID.
 */
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const pollRef = useRef(null);

  // ─── Fetch / Hydrate ───────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      console.warn('[useNotifications] REST fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ─── Prepend a new real-time notification (dedup by _id) ──────────────────
  const ingestNotification = useCallback((raw) => {
    setNotifications((prev) => {
      const already = prev.some((n) => n._id === raw._id);
      if (already) return prev;
      return [{ ...raw, channel: resolveChannelFromType(raw.type) }, ...prev];
    });
  }, []);

  // Inline resolver (avoids circular import)
  function resolveChannelFromType(type) {
    if (!type) return 'system';
    const t = type.toLowerCase();
    if (t.includes('message') || t.includes('chat')) return 'directMessage';
    if (t.includes('community') || t.includes('join') || t.includes('approve') || t.includes('reject')) return 'communityAlert';
    return 'system';
  }

  // ─── Socket Lifecycle ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const socket = acquireSocket(userId);
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      registerUserRoom(userId);
    };
    const onDisconnect = () => setConnected(false);
    const onNewNotification = (notification) => {
      ingestNotification(notification);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_notification', onNewNotification);

    // Sync connected state for already-connected sockets
    if (socket.connected) {
      setConnected(true);
      registerUserRoom(userId);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_notification', onNewNotification);
      releaseSocket();
    };
  }, [userId, ingestNotification]);

  // ─── Initial Load + Polling Fallback ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    pollRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [userId, fetchNotifications]);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const markRead = useCallback(async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    try {
      await notificationService.markRead(notificationId);
    } catch (err) {
      console.warn('[useNotifications] markRead failed:', err.message);
      // Revert optimistic update on failure
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllRead();
    } catch (err) {
      console.warn('[useNotifications] markAllRead failed:', err.message);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // ─── Derived State ─────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  const byChannel = {
    directMessage:  notifications.filter((n) => n.channel === 'directMessage'),
    communityAlert: notifications.filter((n) => n.channel === 'communityAlert'),
    system:         notifications.filter((n) => n.channel === 'system'),
  };

  return {
    notifications,
    unreadCount,
    byChannel,
    loading,
    connected,
    markRead,
    markAllRead,
    refresh: fetchNotifications,
  };
}
