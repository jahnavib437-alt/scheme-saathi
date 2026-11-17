import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useUiStore } from '../store/uiStore';
import { useTrackerStore } from '../store/trackerStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

let socketInstance = null;

export function useSocket() {
  const addToast = useUiStore((s) => s.addToast);
  const sessionId = useTrackerStore((s) => s.sessionId);
  const initialized = useRef(false);

  const getSocket = useCallback(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });
    }
    return socketInstance;
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const socket = getSocket();

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      if (sessionId) {
        socket.emit('session:join', { sessionId });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('scheme:created', (scheme) => {
      addToast({
        message: `New scheme added: ${scheme.name?.en || scheme.slug}`,
        type: 'info',
        duration: 5000,
      });
    });

    socket.on('announcement:new', (ann) => {
      addToast({
        message: ann.title,
        type: ann.severity === 'critical' ? 'error' : ann.severity === 'warning' ? 'warning' : 'info',
        duration: 8000,
      });
    });

    socket.on('application:update', (data) => {
      console.log('[Socket] Application update:', data);
    });

    return () => {
      // Don't disconnect on unmount — keep singleton alive across pages
    };
  }, [getSocket, sessionId, addToast]);

  return { getSocket };
}

export function joinAdminRoom(socket) {
  socket.emit('admin:join');
}

export function leaveAdminRoom(socket) {
  socket.emit('admin:leave');
}
