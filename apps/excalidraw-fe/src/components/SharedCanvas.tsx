"use client";

import { Game } from "@/draw/Game";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";

const SharedCanvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState();
  const socket = useSocket();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!socket) return;
    console.log("whyyy", roomId);
    const g = new Game(canvasRef.current, roomId, socket);

    return () => {
      g.destroy();
    };
  }, [canvasRef.current, socket]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
};

export default SharedCanvas;
