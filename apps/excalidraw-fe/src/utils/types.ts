export type Tool = "rect" | "circle" | "line";

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
    };
