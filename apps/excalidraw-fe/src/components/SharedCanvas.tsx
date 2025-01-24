"use client";

import { Game, Tool } from "@/draw/Game";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";

const SharedCanvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const socket = useSocket(roomId);
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");

  useEffect(() => {
    console.log("se:,", selectedTool);
    game?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!socket) return;

    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);

    return () => {
      g.destroy();
    };
  }, [canvasRef.current, socket]);

  if (!socket) {
    <div>connecting to server...</div>;
  }

  return (
    <>
      <div className=" absolute top-2 left-5">
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </>
  );
};

export default SharedCanvas;
