"use client";
import { Game } from "@/draw/Game";
import { Tool } from "@/utils/types";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { LoginButtons } from "@/app/page";

const SharedCanvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const windowSize = useWindowSize();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const socket = useSocket(roomId);

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

  if (!token) {
    return (
      <div className=" h-screen flex flex-col space-y-3 justify-center items-center">
        <h1 className=" text-4xl text-gray-600">Please login to continue</h1>
        <LoginButtons />
      </div>
    );
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
