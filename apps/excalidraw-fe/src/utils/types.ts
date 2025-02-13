export type Tool =
  | "rect"
  | "circle"
  | "line"
  | "freehand"
  | "eraser"
  | "select";

export type Shape =
  | {
      chatId?: number;
      shape: "rect";
      params: {
        startX: number;
        startY: number;
        width: number;
        height: number;
      };
    }
  | {
      chatId?: number;
      shape: "circle";
      params: {
        startX: number;
        startY: number;
        radius: number;
      };
    }
  | {
      chatId?: number;
      shape: "line";
      params: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
      };
    }
  | {
      chatId?: number;
      shape: "freehand";
      params: {
        points: { x: number; y: number; pressure: number }[];
      };
    };

export type RectShape = {
  startX: number;
  startY: number;
  width: number;
  height: number;
};

export type CircleShape = {
  startX: number;
  startY: number;
  radius: number;
};

export type LineShape = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type FreeHandShape = {
  points: { x: number; y: number; pressure: number }[];
};
