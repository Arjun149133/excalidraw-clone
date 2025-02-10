import { Shape } from "@/utils/types";
import { Canvas } from "./Canvas";
import { getExistingShapes } from "./http";
import jwt from "jsonwebtoken";

export class Game extends Canvas {
  private roomId: string;
  private socket: WebSocket;
  private userId: string | null = null;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    super(canvas);
    this.roomId = roomId;
    this.socket = socket;
    this.initMouseHandlers();
    this.initSocketHandler();
    this.init();
    this.initUser();
    this.clear();
  }

  async init() {
    this.clear();
    try {
      const token = localStorage.getItem("token");
      const result = await getExistingShapes(this.roomId, token!);
      const { existingChats } = result;
      const shapes: Shape[] = [];
      existingChats.map((s: any) => {
        let shape: Shape = JSON.parse(s.message);
        if (shape.shape === "freehand") {
          // @ts-ignore
          const points = JSON.parse(shape.params.points);
          shape.params.points = points;
        }
        shapes.push(shape);
      });
      super.setExistingShapes(shapes);

      this.clear();
    } catch (error) {
      console.error(error);
    }

    super.init();
    this.clear();
  }

  initUser() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token) as any;
      this.userId = decoded.userId;
    }
    this.clear();
  }

  initMouseHandlers(): void {
    super.initMouseHandlers();
    super.getCanvas().addEventListener("mouseup", this.handleParentMouseUp);
    this.clear();
  }

  initSocketHandler() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat" && this.userId !== data.userId) {
        const shape: Shape = data.payload;
        console.log("received shape", shape);

        if (shape.shape === "freehand") {
          // @ts-ignore
          const points = JSON.parse(shape.params.points);
          shape.params.points = points;
        }

        super.setExistingShapes([...super.getExistingShapes(), shape]);
        this.clear();
      }
    };
  }

  private handleParentMouseUp = (e: MouseEvent) => {
    this.clear();
    this.handleMouseUp(e);

    switch (super.getSelectedTool()) {
      case "rect":
        const { x, y } = super.getStartCoordinates();
        const { width, height } = super.getRectWidthHeight();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            payload: {
              shape: "rect",
              params: {
                startX: x,
                startY: y,
                width: width,
                height: height,
              },
            },
          })
        );
        this.clear();
        break;
      case "circle":
        const { x: x1, y: y1 } = super.getStartCoordinates();
        const radius = super.getCircleRadius();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            payload: {
              shape: "circle",
              params: {
                startX: x1,
                startY: y1,
                radius: radius,
              },
            },
          })
        );
        this.clear();
        break;

      case "line":
        const { x: x2, y: y2 } = super.getStartCoordinates();
        const { endX: x3, endY: y3 } = super.getLineEndCoordinates();
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            payload: {
              shape: "line",
              params: {
                startX: x2,
                startY: y2,
                endX: x3,
                endY: y3,
              },
            },
          })
        );

        this.clear();

        break;

      case "freehand":
        const points = super.getFreeHandPoints();

        if (points.length === 0) {
          break;
        }

        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            payload: {
              shape: "freehand",
              params: {
                points: JSON.stringify(points),
              },
            },
          })
        );

        this.clear();

        break;
    }

    this.clear();
  };
}
