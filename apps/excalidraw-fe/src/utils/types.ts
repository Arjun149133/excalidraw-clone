export type Tool =
  | "rect"
  | "circle"
  | "line"
  | "freehand"
  | "eraser"
  | "select";

export type Shape =
  | {
      shape: "rect";
      params: {
        startX: number;
        startY: number;
        width: number;
        height: number;
      };
    }
  | {
      shape: "circle";
      params: {
        startX: number;
        startY: number;
        radius: number;
      };
    }
  | {
      shape: "line";
      params: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
      };
    }
  | {
      shape: "freehand";
      params: {
        points: { x: number; y: number; pressure: number }[];
      };
    };
