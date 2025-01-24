"use client";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { getExistingShapes } from "@/draw/http";

type Shape = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let clicked = false;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      clicked = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (clicked) {
        const width = e.clientX - startX;
        const hei = e.clientY - startY;

        clear();
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(startX, startY, width, hei);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      clicked = false;
      const w = e.clientX - startX;
      const h = e.clientY - startY;

      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(startX, startY, w, h);

      setShapes((s) => [
        ...s,
        {
          x: startX,
          y: startY,
          w,
          h,
        },
      ]);
      console.log(shapes);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      //Todo
      clicked = false;
    };

    const clear = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = "rgba(0, 0, 0)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      if (shapes) {
        shapes.forEach((s) => {
          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(s.x, s.y, s.w, s.h);
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    canvasRef.current?.addEventListener("mousedown", handleMouseDown);
    canvasRef.current?.addEventListener("mouseup", handleMouseUp);
    canvasRef.current?.addEventListener("mousemove", handleMouseMove);
    canvasRef.current?.addEventListener("mouseleave", handleMouseLeave);
    clear();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasRef.current?.removeEventListener("mousedown", handleMouseDown);
      canvasRef.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef, shapes]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;
