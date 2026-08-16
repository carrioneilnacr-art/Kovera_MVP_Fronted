import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Conexión directa al backend para evitar el warning de WebSocket en el proxy de Vite
const SOCKET_URL = 'http://localhost:3000';

export const useKoveraSockets = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastNotification, setLastNotification] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Conectado a Kovera WebSockets');
    });

    newSocket.on('price_dropped', (data) => {
      console.log('¡Bajó el precio!', data);
      setLastNotification({ type: 'price_dropped', data });
    });

    newSocket.on('campaign_started', (data) => {
      console.log('¡Campaña iniciada!', data);
      setLastNotification({ type: 'campaign_started', data });
      // Se podría mostrar un toast global o refrescar estado
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, lastNotification, clearNotification: () => setLastNotification(null) };
};
