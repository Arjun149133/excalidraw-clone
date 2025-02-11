import { Shape } from "@/utils/types";
import { Canvas } from "./Canvas";
import { getExistingShapes } from "./http";
import jwt from "jsonwebtoken";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";

export class Game extends Canvas {
  private roomId: string;
  private socket: WebSocket;
  private userId: string | null = null;
  private token: string | null = null;

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
    try {
      this.token = localStorage.getItem("token");
      if (!this.roomId) {
        return;
      }

      const result = await getExistingShapes(this.roomId, this.token!);
      const { existingChats } = result;
      const shapes: Shape[] = [];
      existingChats.map((s: any) => {
        let shape: Shape = JSON.parse(s.message);
        if (shape.shape === "freehand") {
          // @ts-ignore
          const points = JSON.parse(shape.params.points);
          shape.params.points = points;
        }
        shape.chatId = s.id;
        shapes.push(shape);
      });
      super.setExistingShapes(shapes);
    } catch (error) {
      console.error(error);
    }

    super.init();

    this.clear();
  }

  initUser() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      const decoded = jwt.decode(this.token) as any;
      this.userId = decoded.userId;
    }
    this.clear();
  }

  initMouseHandlers(): void {
    super.initMouseHandlers();
    super.getCanvas().addEventListener("mouseup", this.handleParentMouseUp);
  }

  destroy(): void {
    super.destroy();
    super.getCanvas().removeEventListener("mouseup", this.handleParentMouseUp);
  }

  async initSocketHandler() {
    this.socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "update_chat" && this.userId !== data.userId) {
        await this.init();
        this.clear();
      }

      if (data.type === "chat" && this.userId !== data.userId) {
        const shape: Shape = data.payload;

        if (shape.shape === "freehand") {
          // @ts-ignore
          const points = JSON.parse(shape.params.points);
          shape.params.points = points;
        }

        shape.chatId = data.chatId;
        super.setExistingShapes([...super.getExistingShapes(), shape]);
        this.clear();
      }

      if (data.type === "chat") {
        await this.init();
      }
    };
  }

  private handleParentMouseUp = async (e: MouseEvent) => {
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

        break;

      case "select":
        const selectedShape = super.getSelectedShape();
        if (!selectedShape) {
          break;
        }

        if (selectedShape.shape === "freehand") {
          // @ts-ignore
          const points = JSON.stringify(selectedShape.params.points);
          const newShape = { ...selectedShape, params: { points } };
          // @ts-ignore
          await this.updateChatOnDb(newShape);
        } else {
          await this.updateChatOnDb(selectedShape);
        }

        this.socket.send(
          JSON.stringify({
            type: "update_chat",
          })
        );

        break;
    }
  };

  updateChatOnDb = async (shape: Shape) => {
    try {
      if (!shape.chatId) {
        return;
      }

      const res = await axios.put(
        `${HTTP_BACKEND_URL}/chat/${shape.chatId}`,
        {
          message: JSON.stringify(shape),
        },
        {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
}
