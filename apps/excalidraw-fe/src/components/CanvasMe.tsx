"use client";
import { Offline } from "@/draw/Offline";
import { Tool } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import Topbar from "./Topbar";
import { useWindowSize } from "@/hooks/useWindowSize";
import Bottombar from "./Bottombar";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offline, setOffline] = useState<Offline>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const [cursor, setCursor] = useState<"cursor-crosshair" | "cursor-move">(
    "cursor-crosshair"
  );
  const [scale, setScale] = useState(1);
  const windowSize = useWindowSize();

  useEffect(() => {
    offline?.setTool(selectedTool);
    if (selectedTool === "select") {
      setCursor("cursor-move");
    } else {
      setCursor("cursor-crosshair");
    }
  }, [selectedTool]);

  useEffect(() => {
    offline?.setScale(scale);
  }, [scale]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const o = new Offline(canvasRef.current);

    setOffline(o);
    return () => {
      o.destroy();
    };
  }, [canvasRef.current, windowSize]);

  const handleUndo = () => {
    offline?.setHistoryIndexMinus();
  };
  const handleRedo = () => {
    offline?.setHistoryIndexPlus();
  };

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
        className={`${cursor}`}
      ></canvas>
      <div className=" absolute bottom-4 left-5 text-white">
        <Bottombar
          canvas={canvasRef.current}
          scale={scale}
          setScale={setScale}
          setHistoryIndexMinus={handleUndo}
          setHistoryIndexPlus={handleRedo}
        />
      </div>
    </>
  );
};

export default Canvas;
