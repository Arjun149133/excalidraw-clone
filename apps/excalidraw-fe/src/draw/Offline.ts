import { Shape, Tool } from "@/utils/types";

export class Offline {
  private canvas: HTMLCanvasElement;
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private selectedTool: Tool = "rect";
  private offsetX: number = 0;
  private offsetY: number = 0;
  private scale: number = 1;
  private prevTouches: TouchList | [null, null] = [null, null];
  private singleTouch = false;
  private doubleTouch = false;
  private leftMouseDown = false;
  private rightMouseDown = false;
  private cursorX = 0;
  private cursorY = 0;
  private prevCursorX = 0;
  private prevCursorY = 0;

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
    this.existingShapes = shapes;

    this.clear();
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
    this.canvas.addEventListener("wheel", this.onMouseWheel);

    this.canvas.addEventListener("touchstart", this.onTouchStart);
    this.canvas.addEventListener("touchmove", this.onTouchMove);
    this.canvas.addEventListener("touchend", this.onTouchEnd);
    this.canvas.addEventListener("touchcancel", this.onTouchEnd);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }

  toScreenX = (xTrue: number) => {
    return (xTrue + this.offsetX) * this.scale;
  };

  toScreenY = (yTrue: number) => {
    return (yTrue + this.offsetY) * this.scale;
  };

  toTrueX = (xScreen: number) => {
    return xScreen / this.scale - this.offsetX;
  };

  toTrueY = (yScreen: number) => {
    return yScreen / this.scale - this.offsetY;
  };

  trueHeight = () => {
    return this.canvas.clientHeight / this.scale;
  };

  trueWidth = () => {
    return this.canvas.clientWidth / this.scale;
  };

  setTool(tool: Tool) {
    console.log("setting tool");
    this.selectedTool = tool;
  }

  onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.singleTouch = true;
      this.doubleTouch = false;
    }

    if (e.touches.length >= 2) {
      this.singleTouch = false;
      this.doubleTouch = true;
    }

    this.prevTouches[0] = e.touches[0];
    this.prevTouches[1] = e.touches[1];
  };

  onTouchMove = (event: TouchEvent) => {
    if (this.prevTouches[0] === null || this.prevTouches[1] === null) {
      return;
    }

    // get first touch coordinates
    const touch0X = event.touches[0].pageX;
    const touch0Y = event.touches[0].pageY;
    const prevTouch0X = this.prevTouches[0].pageX;
    const prevTouch0Y = this.prevTouches[0].pageY;

    const scaledX = this.toTrueX(touch0X);
    const scaledY = this.toTrueY(touch0Y);
    const prevScaledX = this.toTrueX(prevTouch0X);
    const prevScaledY = this.toTrueY(prevTouch0Y);

    if (this.singleTouch) {
      // add to history
      switch (this.selectedTool) {
        case "line":
          this.existingShapes.push({
            shape: "line",
            params: {
              startX: prevScaledX,
              startY: prevScaledY,
              endX: scaledX,
              endY: scaledY,
            },
          });

          break;

        case "rect":
          const width = touch0X - this.toScreenX(this.startX);
          const hei = touch0Y - this.toScreenY(this.startY);

          this.existingShapes.push({
            shape: "rect",
            params: {
              startX: this.toTrueX(this.startX),
              startY: this.toTrueY(this.startY),
              width: width,
              height: hei,
            },
          });

          break;

        case "circle":
          this.existingShapes.push({
            shape: "circle",
            params: {
              startX: this.toTrueX(this.startX),
              startY: this.toTrueY(this.startY),
              radius:
                Math.abs(touch0X - this.toScreenX(this.startX)) * this.scale,
            },
          });

          break;

        default:
          break;
      }

      this.clear();
    }

    if (this.doubleTouch) {
      if (this.prevTouches[0] === null || this.prevTouches[1] === null) {
        return;
      }

      // get second touch coordinates
      const touch1X = event.touches[1].pageX;
      const touch1Y = event.touches[1].pageY;
      const prevTouch1X = this.prevTouches[1].pageX;
      const prevTouch1Y = this.prevTouches[1].pageY;

      // get midpoints
      const midX = (touch0X + touch1X) / 2;
      const midY = (touch0Y + touch1Y) / 2;
      const prevMidX = (prevTouch0X + prevTouch1X) / 2;
      const prevMidY = (prevTouch0Y + prevTouch1Y) / 2;

      // calculate the distances between the touches
      const hypot = Math.sqrt(
        Math.pow(touch0X - touch1X, 2) + Math.pow(touch0Y - touch1Y, 2)
      );
      const prevHypot = Math.sqrt(
        Math.pow(prevTouch0X - prevTouch1X, 2) +
          Math.pow(prevTouch0Y - prevTouch1Y, 2)
      );

      // calculate the screen scale change
      var zoomAmount = hypot / prevHypot;
      this.scale = this.scale * zoomAmount;
      const scaleAmount = 1 - zoomAmount;

      // calculate how many pixels the midpoints have moved in the x and y direction
      const panX = midX - prevMidX;
      const panY = midY - prevMidY;
      // scale this movement based on the zoom level
      this.offsetX += panX / this.scale;
      this.offsetY += panY / this.scale;

      // Get the relative position of the middle of the zoom.
      // 0, 0 would be top left.
      // 0, 1 would be top right etc.
      var zoomRatioX = midX / this.canvas.clientWidth;
      var zoomRatioY = midY / this.canvas.clientHeight;

      // calculate the amounts zoomed from each edge of the screen
      const unitsZoomedX = this.trueWidth() * scaleAmount;
      const unitsZoomedY = this.trueHeight() * scaleAmount;

      const unitsAddLeft = unitsZoomedX * zoomRatioX;
      const unitsAddTop = unitsZoomedY * zoomRatioY;

      this.offsetX += unitsAddLeft;
      this.offsetY += unitsAddTop;

      this.clear();
    }
    this.prevTouches[0] = event.touches[0];
    this.prevTouches[1] = event.touches[1];

    console.log("scale", this.scale);
  };
  onTouchEnd = (event: TouchEvent) => {
    this.singleTouch = false;
    this.doubleTouch = false;
  };

  onMouseWheel = (e: WheelEvent) => {
    const deltaY = e.deltaY;
    const scaleAmount = -deltaY / 500;
    this.scale = this.scale * (1 + scaleAmount);

    let distX = e.pageX / this.canvas.clientWidth;
    let distY = e.pageY / this.canvas.clientHeight;

    const unitsZoomedX = this.trueWidth() * scaleAmount;
    const unitsZoomedY = this.trueHeight() * scaleAmount;

    const unitsAddLeft = unitsZoomedX * distX;
    const unitsAddTop = unitsZoomedY * distY;

    this.offsetX -= unitsAddLeft;
    this.offsetY -= unitsAddTop;

    console.log("scale", this.scale);

    this.clear();
  };

  handleMouseDown = (e: MouseEvent) => {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.clicked = true;

    if (e.button === 0) {
      this.leftMouseDown = true;
      this.rightMouseDown = false;
    }

    if (e.button === 2) {
      this.rightMouseDown = true;
      this.leftMouseDown = false;
    }

    this.cursorX = e.pageX;
    this.cursorY = e.pageY;
    this.prevCursorX = e.pageX;
    this.prevCursorY = e.pageY;
  };

  handleMouseMove = (e: MouseEvent) => {
    this.cursorX = e.pageX;
    this.cursorY = e.pageY;
    const scaledX = this.toTrueX(this.cursorX);
    const scaledY = this.toTrueY(this.cursorY);
    const prevScaledX = this.toTrueX(this.prevCursorX);
    const prevScaledY = this.toTrueY(this.prevCursorY);

    if (this.leftMouseDown) {
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
          this.existingShapes.push({
            shape: "line",
            params: {
              startX: prevScaledX,
              startY: prevScaledY,
              endX: scaledX,
              endY: scaledY,
            },
          });
          this.drawLine(
            this.prevCursorX,
            this.prevCursorY,
            this.cursorX,
            this.cursorY
          );
          break;

        default:
          break;
      }
    }

    if (this.rightMouseDown) {
      this.offsetX += (this.cursorX - this.prevCursorX) / this.scale;
      this.offsetY += (this.cursorY - this.prevCursorY) / this.scale;
      this.clear();
    }

    this.prevCursorX = this.cursorX;
    this.prevCursorY = this.cursorY;
  };

  handleMouseUp = (e: MouseEvent) => {
    this.clicked = false;
    this.leftMouseDown = false;
    this.rightMouseDown = false;

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
    this.ctx.strokeRect(x, y, width, height);
  };

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  clear = () => {
    //resize()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.existingShapes) {
      this.existingShapes.forEach((s) => {
        switch (s.shape) {
          case "rect":
            const { startX, startY, width, height } = s.params;
            this.drawRect(
              this.toTrueX(startX),
              this.toTrueY(startY),
              width * this.scale,
              height * this.scale
            );
            break;
          case "circle":
            const { startX: x, startY: y, radius } = s.params;
            this.drawCircle(
              this.toScreenX(x),
              this.toScreenY(y),
              radius * this.scale
            );
            break;
          case "line":
            const { startX: lineX, startY: lineY, endX, endY } = s.params;
            this.drawLine(
              this.toScreenX(lineX),
              this.toScreenY(lineY),
              this.toScreenX(endX),
              this.toScreenY(endY)
            );

            break;

          default:
            break;
        }
      });
    }
  };
}
