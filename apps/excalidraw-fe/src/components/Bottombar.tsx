import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const Bottombar = ({
  canvas,
  scale,
  setScale,
}: {
  canvas: HTMLCanvasElement | null;
  scale: number;
  setScale: any;
}) => {
  useEffect(() => {
    if (!canvas) return;
    const handleMouseWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.metaKey || e.ctrlKey) {
        setScale((prev: any) => {
          const newScale = Math.min(Math.max(0.1, prev - e.deltaY * 0.01), 20);
          return newScale;
        });
      }
    };

    canvas.addEventListener("wheel", handleMouseWheel);
    return () => {
      canvas.removeEventListener("wheel", handleMouseWheel);
    };
  }, [canvas]);

  return (
    <div className=" bg-gray-900 rounded-lg">
      <Button
        className=" bg-gray-900"
        onClick={() => {
          setScale((prev: any) => {
            const newScale = Math.min(Math.max(0.1, prev - 0.01), 20);
            return newScale;
          });
        }}
      >
        -
      </Button>
      <Button
        className=" bg-gray-900"
        onClick={() => {
          setScale(1);
        }}
      >
        {Math.floor(scale * 100)}%
      </Button>
      <Button
        className=" bg-gray-900"
        onClick={() => {
          setScale((prev: any) => {
            const newScale = Math.min(Math.max(0.1, prev + 0.01), 20);
            return newScale;
          });
        }}
      >
        +
      </Button>
    </div>
  );
};

export default Bottombar;
