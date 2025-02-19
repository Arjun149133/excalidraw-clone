import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket) return;
    const token = localStorage.getItem("token");

    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL + `/?token=${token}&roomId=${roomId}`
    );

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
