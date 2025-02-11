import { useEffect, useState } from "react";

const url = `ws://localhost:8080`;

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket) return;
    const token = localStorage.getItem("token");

    const ws = new WebSocket(url + `/?token=${token}&roomId=${roomId}`);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};
