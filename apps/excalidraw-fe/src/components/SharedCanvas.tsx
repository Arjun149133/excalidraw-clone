"use client";
import { Game } from "@/draw/Game";
import { Tool } from "@/utils/types";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";
import { useWindowSize } from "@/hooks/useWindowSize";
import LoginButtons from "@/components/LoginButtons";
import RoomCode from "./RoomCode";
import LoadingSpinner from "./LoadingSpinner";

const SharedCanvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const [cursor, setCursor] = useState<"cursor-crosshair" | "cursor-move">(
    "cursor-crosshair"
  );
  const windowSize = useWindowSize();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const socket = useSocket(roomId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLoading(true);
    const token = localStorage.getItem("token");
    setToken(token);
    setLoading(false);
  }, []);

  useEffect(() => {
    game?.setTool(selectedTool);
    if (selectedTool === "select") {
      setCursor("cursor-move");
    } else {
      setCursor("cursor-crosshair");
    }
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    if (!socket) {
      return;
    }

    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);

    return () => {
      g.destroy();
    };
  }, [canvasRef.current, socket, windowSize]);

  if (loading) {
    return (
      <div className=" flex flex-col w-screen h-screen justify-center items-center">
        <div className=" text-white mb-2">
          <span>Connecting to server</span>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (!token) {
    return (
      <div className=" h-screen flex flex-col space-y-3 justify-center items-center">
        <h1 className=" text-4xl text-gray-600">Please login to continue</h1>
        <LoginButtons />
      </div>
    );
  }

  if (!socket) {
    return null;
  }

  return (
    <>
      <div className=" absolute top-2 left-5">
        <Topbar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          select={true}
        />
      </div>
      <div className=" absolute top-3 right-7">
        <RoomCode roomId={roomId} />
      </div>
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
        style={{
          width: windowSize.width,
          height: windowSize.height,
        }}
        className={`${cursor}`}
      ></canvas>
    </>
  );
};

export default SharedCanvas;
