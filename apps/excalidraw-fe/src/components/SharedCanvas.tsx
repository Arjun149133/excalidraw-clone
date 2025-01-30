"use client";
import { Game } from "@/draw/Game";
import { Tool } from "@/utils/types";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";
import { useWindowSize } from "@/hooks/useWindowSize";

const SharedCanvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const socket = useSocket(roomId);
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const windowSize = useWindowSize();

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log("no canvas");
      return;
    }
    if (!socket) {
      console.log("no socket");
      return;
    }

    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);

    return () => {
      g.destroy();
    };
  }, [canvasRef.current, socket, windowSize]);

  if (!socket) {
    <div className=" bg-black">connecting to server...</div>;
  }

  return (
    <>
      <div className=" absolute top-2 left-5">
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      </div>
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
        style={{
          width: windowSize.width,
          height: windowSize.height,
        }}
      ></canvas>
    </>
  );
};

export default SharedCanvas;
