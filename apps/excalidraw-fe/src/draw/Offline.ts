import { Shape, Tool } from "@/utils/types";

export class Offline {
  private canvas: HTMLCanvasElement;
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private selectedTool: Tool = "rect";

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.clear();
    this.init();
    this.initMouseHandlers();
  }

  async init() {
    const shapesString = localStorage.getItem("existingShapes");
    if (!shapesString) {
      localStorage.setItem("existingShapes", JSON.stringify([]));
      return;
    }

    const shapes: Shape[] = JSON.parse(shapesString);
    this.existingShapes = shapes;
    console.log(this.existingShapes);

    this.clear();
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

  setTool(tool: Tool) {
    console.log("setting tool");
    this.selectedTool = tool;
  }

  handleMouseDown = (e: MouseEvent) => {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.clicked = true;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.clicked) {
      switch (this.selectedTool) {
        case "rect":
          const width = e.clientX - this.startX;
          const hei = e.clientY - this.startY;

          this.clear();
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.strokeRect(this.startX, this.startY, width, hei);
          break;

        case "circle":
          const radius = Math.abs(e.clientX - this.startX);
          this.clear();
          this.ctx.beginPath();
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
          this.ctx.stroke();
          this.ctx.closePath();
          break;

        case "line":
          this.clear();
          this.ctx.beginPath();
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(e.clientX, e.clientY);
          this.ctx.stroke();
          this.ctx.closePath();
          break;

        default:
          break;
      }
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    this.clicked = false;

    switch (this.selectedTool) {
      case "rect":
        const w = e.clientX - this.startX;
        const h = e.clientY - this.startY;
        this.existingShapes.push({
          shape: "rect",
          params: {
            startX: this.startX,
            startY: this.startY,
            width: w,
            height: h,
          },
        });

        this.clear();
        break;

      case "circle":
        const radius = Math.abs(e.clientX - this.startX);
        this.existingShapes.push({
          shape: "circle",
          params: {
            startX: this.startX,
            startY: this.startY,
            radius: radius,
          },
        });

        this.clear();

        break;

      case "line":
        this.existingShapes.push({
          shape: "line",
          params: {
            startX: this.startX,
            startY: this.startY,
            endX: e.clientX,
            endY: e.clientY,
          },
        });

        this.clear();

        break;

      default:
        break;
    }

    localStorage.removeItem("existingShapes");
    localStorage.setItem("existingShapes", JSON.stringify(this.existingShapes));
  };

  handleMouseLeave = (e: MouseEvent) => {
    //Todo
    this.clicked = false;
  };

  resize = () => {
    console.log("calae");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  clear = () => {
    console.log("can", this.canvas.width, this.canvas.height);
    this.resize();
    console.log("win", window.innerWidth, window.innerHeight);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.existingShapes) {
      this.existingShapes.forEach((s) => {
        switch (s.shape) {
          case "rect":
            const { startX, startY, width, height } = s.params;
            this.ctx.strokeStyle = "#ffffff";
            this.ctx.strokeRect(startX, startY, width, height);
            break;
          case "circle":
            const { startX: x, startY: y, radius } = s.params;
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#ffffff";
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
            break;
          case "line":
            const { startX: lineX, startY: lineY, endX, endY } = s.params;
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#ffffff";
            this.ctx.moveTo(lineX, lineY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            this.ctx.closePath();

            break;

          default:
            break;
        }
      });
    }
  };
}
