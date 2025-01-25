"use client";
import { Offline } from "@/draw/Offline";
import { Tool } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";
import { useWindowSize } from "@/hooks/useWindowSize";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offline, setOffline] = useState<Offline>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const windowSize = useWindowSize();

  useEffect(() => {
    offline?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const o = new Offline(canvasRef.current);
    o.clear();

    setOffline(o);

    return () => {
      o.destroy();
    };
  }, [canvasRef.current, windowSize]);

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

export default Canvas;
