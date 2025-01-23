import { getExistingShapes } from "./http";

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
        x: number;
        y: number;
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

export class Game {
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private ctx: CanvasRenderingContext2D;
  // private shapes: Shape[] = [];
  private socket: WebSocket;
  private existingShapes: Shape[] = [];

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.ctx = this.canvas.getContext("2d")!;
    this.clear();
    this.init();
    this.initMouseHandlers();
    this.initSocketHandler();
  }

  async init() {
    try {
      const result = await getExistingShapes(this.roomId);
      const { existingChats } = result;
      existingChats.map((s: any) => {
        let shape: Shape = JSON.parse(s.message);
        this.existingShapes.push(shape);
      });
      console.log(this.existingShapes);

      this.clear();
    } catch (error) {
      console.error(error);
    }
  }

  initSocketHandler() {
    console.log("initsockethandler");
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("whynot:,", data);

      if (data.type === "chat") {
        console.log(data);
      }
    };
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseDown = (e: MouseEvent) => {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.clicked = true;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const hei = e.clientY - this.startY;

      this.clear();
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.strokeRect(this.startX, this.startY, width, hei);
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    this.clicked = false;
    const w = e.clientX - this.startX;
    const h = e.clientY - this.startY;

    this.ctx.strokeStyle = "#ffffff";
    this.ctx.strokeRect(this.startX, this.startY, w, h);

    this.existingShapes.push({
      shape: "rect",
      params: {
        startX: this.startX,
        startY: this.startY,
        width: w,
        height: h,
      },
    });

    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        payload: {
          shape: "rect",
          params: {
            startX: this.startX,
            startY: this.startY,
            width: w,
            height: h,
          },
        },
      })
    );
  };

  handleMouseLeave = (e: MouseEvent) => {
    //Todo
    this.clicked = false;
  };

  clear = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    if (this.existingShapes) {
      this.existingShapes.forEach((s) => {
        if (s.shape === "rect") {
          const { startX, startY, width, height } = s.params;
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.strokeRect(startX, startY, width, height);
        }
      });
    }
  };
}
