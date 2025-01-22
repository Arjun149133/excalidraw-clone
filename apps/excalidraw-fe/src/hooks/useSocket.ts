import { useEffect, useState } from "react";

const url =
  "ws://localhost:8080/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MjAwNzg4OC1mYTBhLTQyM2UtOGRjMS1mZTUxODFmOTYyNjgiLCJlbWFpbCI6ImFyakBnbWFpbC5jb20iLCJpYXQiOjE3Mzc0NzgwNTF9.7fPUjM8gaRulPdCGeWxnq6RdPYq0bBskzwFnhv-uKiY";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket) return;

    const ws = new WebSocket(url);
    console.log("heelo");

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
