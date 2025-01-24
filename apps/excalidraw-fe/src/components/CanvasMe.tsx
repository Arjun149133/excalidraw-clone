"use client";
import { Offline } from "@/draw/Offline";
import { Tool } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offline, setOffline] = useState<Offline>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");

  useEffect(() => {
    console.log("se:,", selectedTool);
    offline?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const o = new Offline(canvasRef.current);

    setOffline(o);

    return () => {
      o.destroy();
    };
  }, [canvasRef.current]);

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

export default Canvas;
