import axios from 'axios';
import { io } from 'socket.io-client';
import { API_URL, API_BASE } from '../../../config/api';

// ─── Notification Categories ──────────────────────────────────────────────────
export const NOTIFICATION_CHANNELS = {
  DIRECT_MESSAGE: 'directMessage',
  COMMUNITY_ALERT: 'communityAlert',
  SYSTEM: 'system',
};

// Maps server-emitted `type` strings to a channel category
export const resolveChannel = (type) => {
  if (!type) return NOTIFICATION_CHANNELS.SYSTEM;
  const t = type.toLowerCase();
  if (t.includes('message') || t.includes('chat')) return NOTIFICATION_CHANNELS.DIRECT_MESSAGE;
  if (t.includes('community') || t.includes('join') || t.includes('approve') || t.includes('reject') || t.includes('kick') || t.includes('ban')) return NOTIFICATION_CHANNELS.COMMUNITY_ALERT;
  return NOTIFICATION_CHANNELS.SYSTEM;
};

// ─── REST API calls ───────────────────────────────────────────────────────────
export const notificationService = {
  /** Fetch the full notification list for the authenticated user. */
  async getAll() {
    const { data } = await axios.get(`${API_URL}/user/notifications`);
    return (data || []).map((n) => ({
      ...n,
      channel: resolveChannel(n.type),
    }));
  },

  /** Mark a single notification as read. */
  async markRead(notificationId) {
    const { data } = await axios.put(`${API_URL}/user/notifications/${notificationId}/read`);
    return data;
  },

  /** Mark all notifications as read. */
  async markAllRead() {
    const { data } = await axios.put(`${API_URL}/user/notifications/mark-all-read`);
    return data;
  },
};

// ─── Singleton Socket Manager ─────────────────────────────────────────────────
let _socket = null;
let _refCount = 0;

/**
 * Returns (or creates) the shared socket connection.
 * Increments reference count — call `releaseSocket()` when the consumer unmounts.
 */
export function acquireSocket(userId) {
  _refCount++;
  if (_socket && _socket.connected) return _socket;

  _socket = io(API_BASE, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  _socket.on('connect', () => {
    if (userId) {
      _socket.emit('registerUserSocket', userId);
    }
  });

  return _socket;
}

/** Decrements reference count. Disconnects socket when no consumers remain. */
export function releaseSocket() {
  _refCount = Math.max(0, _refCount - 1);
  if (_refCount === 0 && _socket) {
    _socket.disconnect();
    _socket = null;
  }
}

/** Re-registers the user room when the userId becomes available post-connect. */
export function registerUserRoom(userId) {
  if (_socket && userId) {
    _socket.emit('registerUserSocket', userId);
  }
}
