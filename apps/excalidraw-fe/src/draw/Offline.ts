import { Shape, Tool } from "@/utils/types";

export class Offline {
  private canvas: HTMLCanvasElement;
  private startX: number = 0;
  private startY: number = 0;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private selectedTool: Tool = "rect";
  private leftMouseDown = false;
  private rightMouseDown = false;
  private action: "resize" | "move" = "move";
  private selectedShape: Shape | null = null;
  private selectedShapeOffSetX: number = 0;
  private selectedShapeOffSetY: number = 0;
  private panOffSetX: number = 0;
  private panOffSetY: number = 0;
  public scale: number = 1;
  private scaleOffSetX: number = 0;
  private scaleOffSetY: number = 0;
  private history: Shape[][] = [];
  private historyIndex: number = 0;
  private existingShapesLength: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
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
    this.existingShapes = [...shapes];
    this.existingShapesLength = shapes.length;
    this.history = [];
    this.historyIndex = -1;

    this.updateHistory(this.existingShapes);
    console.log("where", this.history.length, this.historyIndex, this.history);
    this.clear();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    this.startX = 0;
    this.startY = 0;
    if (this.selectedTool === "select") {
      this.action = "move";
    }
  }

  setScale(scale: number) {
    this.scale = scale;
    let scaledWidth = this.canvas.width * this.scale;
    let scaledHeight = this.canvas.height * this.scale;
    this.scaleOffSetX = (scaledWidth - this.canvas.width) / 2;
    this.scaleOffSetY = (scaledHeight - this.canvas.height) / 2;
    this.clear();
  }

  setHistoryIndexPlus() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.existingShapes = [...this.history[this.historyIndex]];
      this.updateLocalStorage();
      console.log("indie", this.historyIndex);
      this.clear();
    }
  }

  setHistoryIndexMinus() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.existingShapes = [...this.history[this.historyIndex]];
      this.updateLocalStorage();
      this.clear();
    }
  }

  updateLocalStorage() {
    localStorage.removeItem("existingShapes");
    localStorage.setItem("existingShapes", JSON.stringify(this.existingShapes));
  }

  resetHistory() {
    this.history = [...this.history.slice(0, this.historyIndex + 1)];
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
    this.canvas.addEventListener("wheel", this.handleMouseWheel);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseDown = (e: MouseEvent) => {
    const { clientX, clientY } = this.getMouseCoordinates(e);

    if (e.button === 0) {
      this.leftMouseDown = true;
      this.rightMouseDown = false;
    }

    if (e.button === 2) {
      this.rightMouseDown = true;
      this.leftMouseDown = false;
    }

    this.startX = clientX;
    this.startY = clientY;

    if (this.selectedTool === "select") {
      this.updateHistory(this.existingShapes);
      console.log("history", this.history);
      if (this.action === "move") {
        const x = clientX;
        const y = clientY;

        this.existingShapes.forEach((s, index) => {
          switch (s.shape) {
            case "rect":
              const updatedParams = { ...s.params };
              const { startX, startY, width, height } = updatedParams;
              if (Math.abs(startX - x) < 5 && Math.abs(startY - y) < 5) {
                this.selectedShape = s;
                updatedParams.startX += width;
                updatedParams.startY += height;
                updatedParams.width = -width;
                updatedParams.height = -height;

                this.updateShape(s, updatedParams);
                this.action = "resize";
              }
              if (
                Math.abs(startX + width - x) < 5 &&
                Math.abs(startY + height - y) < 5
              ) {
                this.selectedShape = s;
                this.action = "resize";
              }
              if (
                Math.abs(startX - x) < 5 &&
                Math.abs(startY + height - y) < 5
              ) {
                this.selectedShape = s;
                updatedParams.startX += width;
                updatedParams.width = -width;
                this.updateShape(s, updatedParams);
                this.action = "resize";
              }
              if (
                Math.abs(startX + width - x) < 5 &&
                Math.abs(startY - y) < 5
              ) {
                this.selectedShape = s;
                updatedParams.startY += height;
                updatedParams.height = -height;
                this.updateShape(s, updatedParams);
                this.action = "resize";
              }
              if (
                x > startX &&
                x < startX + width &&
                y > startY &&
                y < startY + height
              ) {
                this.selectedShape = s;
                this.selectedShapeOffSetX = x - startX;
                this.selectedShapeOffSetY = y - startY;
              }
              break;

            case "circle":
              const { startX: cx, startY: cy, radius } = s.params;
              if (
                radius - 5 < this.distance(x, y, cx, cy) &&
                this.distance(x, y, cx, cy) < radius + 5
              ) {
                this.action = "resize";
                this.selectedShape = s;
                console.log("resize");
              }
              if (this.distance(x, y, cx, cy) < radius) {
                this.selectedShape = s;
                this.selectedShapeOffSetX = x - cx;
                this.selectedShapeOffSetY = y - cy;
              }
              break;

            case "line":
              const { startX: x0, startY: y0, endX: x1, endY: y1 } = s.params;
              if (Math.abs(x - x0) < 5 && Math.abs(y - y0) < 5) {
                this.action = "resize";
                this.selectedShape = s;
                s.params.startX = x1;
                s.params.startY = y1;
              }

              if (Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5) {
                this.action = "resize";
                this.selectedShape = s;
                console.log("resize");
              }
              if (this.mouseOnTheLine(x, y, x0, y0, x1, y1)) {
                this.selectedShape = s;
                this.selectedShapeOffSetX = x - x0;
                this.selectedShapeOffSetY = y - y0;
              }
              break;

            default:
              break;
          }
        });
      }
    } else {
      this.startX = clientX;
      this.startY = clientY;
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = this.getMouseCoordinates(e);
    if (this.leftMouseDown) {
      switch (this.selectedTool) {
        case "rect":
          const width = clientX - this.startX;
          const hei = clientY - this.startY;

          this.clear();
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.strokeRect(
            this.startX * this.scale +
              this.panOffSetX * this.scale -
              this.scaleOffSetX,
            this.startY * this.scale +
              this.panOffSetY * this.scale -
              this.scaleOffSetY,
            width * this.scale,
            hei * this.scale
          );
          break;

        case "circle":
          const radius = Math.abs(clientX - this.startX);
          this.clear();
          this.ctx.beginPath();
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.arc(
            (this.startX + this.panOffSetX) * this.scale - this.scaleOffSetX,
            (this.startY + this.panOffSetY) * this.scale - this.scaleOffSetY,
            radius * this.scale,
            0,
            2 * Math.PI
          );
          this.ctx.stroke();
          this.ctx.closePath();
          break;

        case "freehand":
          this.clear();
          this.drawLine(
            (this.startX + this.panOffSetX) * this.scale - this.scaleOffSetX,
            (this.startY + this.panOffSetY) * this.scale - this.scaleOffSetY,
            (clientX + this.panOffSetX) * this.scale - this.scaleOffSetX,
            (clientY + this.panOffSetY) * this.scale - this.scaleOffSetY
          );

          this.existingShapes.push({
            shape: "line",
            params: {
              startX: this.startX,
              startY: this.startY,
              endX: clientX,
              endY: clientY,
            },
          });
          if (this.startX !== clientX && this.startY !== clientY) {
            this.startX = clientX;
            this.startY = clientY;
          }
          break;

        case "line":
          this.clear();
          this.drawLine(
            (this.startX + this.panOffSetX) * this.scale - this.scaleOffSetX,
            (this.startY + this.panOffSetY) * this.scale - this.scaleOffSetY,
            (clientX + this.panOffSetX) * this.scale - this.scaleOffSetX,
            (clientY + this.panOffSetY) * this.scale - this.scaleOffSetY
          );

          break;

        case "select":
          if (this.action === "move") {
            if (this.selectedShape) {
              const updatedParams = { ...this.selectedShape.params };
              switch (this.selectedShape.shape) {
                case "rect":
                  const { startX, startY } = updatedParams;
                  updatedParams.startX = startX + clientX - this.startX;
                  updatedParams.startY = startY + clientY - this.startY;
                  break;

                case "circle":
                  const { startX: cx, startY: cy } = updatedParams;
                  updatedParams.startX = cx + clientX - this.startX;
                  updatedParams.startY = cy + clientY - this.startY;
                  break;

                case "line":
                  const {
                    startX: x0,
                    startY: y0,
                    endX: x1,
                    endY: y1,
                  } = updatedParams;
                  updatedParams.startX = x0 + (clientX - this.startX);
                  updatedParams.startY = y0 + (clientY - this.startY);
                  updatedParams.endX = x1 + (clientX - this.startX);
                  updatedParams.endY = y1 + (clientY - this.startY);
                  break;

                default:
                  break;
              }

              this.startX = updatedParams.startX + this.selectedShapeOffSetX;
              this.startY = updatedParams.startY + this.selectedShapeOffSetY;
              this.updateShape(this.selectedShape, updatedParams);
              this.clear();
            }
          } else if (this.action === "resize") {
            if (this.selectedShape) {
              const updatedParams = { ...this.selectedShape.params };
              switch (this.selectedShape.shape) {
                case "rect":
                  const { startX, startY, width, height } = updatedParams;
                  updatedParams.width = clientX - startX;
                  updatedParams.height = clientY - startY;
                  break;

                case "circle":
                  const { startX: cx, startY: cy } = updatedParams;
                  const radius = this.distance(cx, cy, clientX, clientY);
                  updatedParams.radius = radius;
                  break;

                case "line":
                  updatedParams.endX = clientX;
                  updatedParams.endY = clientY;
                  break;

                default:
                  break;
              }
              this.updateShape(this.selectedShape, updatedParams);
              this.clear();
            }
          }

          break;

        default:
          break;
      }
    }

    if (this.rightMouseDown) {
      this.clear();
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    const { clientX, clientY } = this.getMouseCoordinates(e);

    // this.clicked = false;
    this.leftMouseDown = false;
    this.rightMouseDown = false;

    switch (this.selectedTool) {
      case "rect":
        const { newX, newY, newW, newH } = this.correctRectangleParams(
          e,
          this.startX,
          this.startY
        );
        this.existingShapes.push({
          shape: "rect",
          params: {
            startX: newX,
            startY: newY,
            width: newW,
            height: newH,
          },
        });

        this.updateHistory(this.existingShapes);
        this.clear();
        break;

      case "circle":
        const radius = Math.abs(clientX - this.startX);
        this.existingShapes.push({
          shape: "circle",
          params: {
            startX: this.startX,
            startY: this.startY,
            radius: radius,
          },
        });

        this.updateHistory(this.existingShapes);
        this.clear();

        break;

      case "freehand":
        this.existingShapes.push({
          shape: "line",
          params: {
            startX: this.startX,
            startY: this.startY,
            endX: clientX,
            endY: clientY,
          },
        });

        this.clear();

      case "line":
        this.existingShapes.push({
          shape: "line",
          params: {
            startX: this.startX,
            startY: this.startY,
            endX: clientX,
            endY: clientY,
          },
        });

        this.updateHistory(this.existingShapes);
        this.clear();

        break;

      case "select":
        if (this.action === "resize") {
          this.action = "move";
          switch (this.selectedShape?.shape) {
            case "rect":
              const updatedParams = { ...this.selectedShape.params };
              const { startX, startY, width, height } = updatedParams;
              const { newX, newY, newW, newH } = this.correctRectangleParams(
                e,
                startX,
                startY
              );
              updatedParams.startX = newX;
              updatedParams.startY = newY;
              updatedParams.width = newW;
              updatedParams.height = newH;

              this.updateShape(this.selectedShape, updatedParams);
              this.updateHistory(this.existingShapes);

              break;

            default:
              break;
          }
        }

        console.log("up", this.history);

        this.selectedShape = null;
        break;

      default:
        break;
    }

    this.updateLocalStorage();
  };

  handleMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.shiftKey) {
      this.panOffSetX += -e.deltaY;
    } else if (e.ctrlKey || e.metaKey) {
      this.scale = Math.min(Math.max(0.1, this.scale - e.deltaY * 0.01), 20);
      let scaledWidth = this.canvas.width * this.scale;
      let scaledHeight = this.canvas.height * this.scale;
      this.scaleOffSetX = (scaledWidth - this.canvas.width) / 2;
      this.scaleOffSetY = (scaledHeight - this.canvas.height) / 2;
    } else {
      this.panOffSetX += -e.deltaX;
      this.panOffSetY += -e.deltaY;
    }

    this.clear();
  };

  handleMouseLeave = (e: MouseEvent) => {
    //Todo
    // this.clicked = false;
  };

  drawLine = (x0: number, y0: number, x1: number, y1: number) => {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  drawCircle = (x: number, y: number, radius: number) => {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.closePath();
  };

  drawRect = (x: number, y: number, width: number, height: number) => {
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);
  };

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  updateHistory(newShapes: Shape[]): void {
    this.resetHistory();
    const newExistingShapes = newShapes.map((s) => {
      return { ...s };
    });
    this.history.push([...this.existingShapes]);

    this.existingShapes = [...newExistingShapes];
    this.historyIndex++;
  }

  clear = () => {
    //resize()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "rgba(255, 255, 255)";
    this.ctx.save();
    this.ctx.translate(
      this.panOffSetX * this.scale - this.scaleOffSetX,
      this.panOffSetY * this.scale - this.scaleOffSetY
    );
    this.ctx.scale(this.scale, this.scale);

    if (this.existingShapes) {
      this.existingShapes.forEach((s) => {
        switch (s.shape) {
          case "rect":
            const { startX, startY, width, height } = s.params;
            this.drawRect(startX, startY, width, height);
            break;
          case "circle":
            const { startX: x, startY: y, radius } = s.params;
            this.drawCircle(x, y, radius);
            break;
          case "line":
            const { startX: lineX, startY: lineY, endX, endY } = s.params;
            this.drawLine(lineX, lineY, endX, endY);

            break;

          default:
            break;
        }
      });
    }

    this.ctx.restore();
  };

  getMouseCoordinates = (e: MouseEvent) => {
    const clientX =
      (e.clientX - this.panOffSetX * this.scale + this.scaleOffSetX) /
      this.scale;
    const clientY =
      (e.clientY - this.panOffSetY * this.scale + this.scaleOffSetY) /
      this.scale;

    return { clientX, clientY };
  };

  distance = (x0: number, y0: number, x1: number, y1: number) => {
    return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
  };

  mouseOnTheLine = (
    x: number,
    y: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) => {
    if (
      this.distance(x, y, x0, y0) +
        this.distance(x, y, x1, y1) -
        this.distance(x0, y0, x1, y1) <
      0.5
    ) {
      return true;
    }
    return false;
  };

  updateShape = (shape: Shape, updatedParams: any) => {
    const index = this.existingShapes.findIndex((s) => s === shape);
    if (index === -1) return;

    this.existingShapes[index].params = updatedParams;
    localStorage.removeItem("existingShapes");
    localStorage.setItem("existingShapes", JSON.stringify(this.existingShapes));
  };

  correctRectangleParams = (e: MouseEvent, x: number, y: number) => {
    const { clientX, clientY } = this.getMouseCoordinates(e);
    let w = clientX - x;
    let h = clientY - y;
    if (clientX < x && clientY < y) {
      x = clientX;
      y = clientY;
      w = -w;
      h = -h;
    }
    if (clientX < x && clientY > y) {
      x = clientX;
      w = -w;
    }
    if (clientX > x && clientY < y) {
      y = clientY;
      h = -h;
    }

    return { newX: x, newY: y, newW: w, newH: h };
  };
}
