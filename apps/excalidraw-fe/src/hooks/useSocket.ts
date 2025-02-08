import { useEffect, useState } from "react";

const url = `ws://localhost:8080`;

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket) return;
    const token = localStorage.getItem("token");

    const ws = new WebSocket(url + `/?token=${token}&roomId=${roomId}`);
    console.log("heelo:", roomId);

    ws.onopen = () => {
      setSocket(ws);
      console.log("connection made");
    };

    ws.onclose = () => {
      setSocket(null);
      console.log("connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};
