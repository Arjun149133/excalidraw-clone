import { Shape } from "@/utils/types";
import { Canvas } from "./Canvas";

export class Offline extends Canvas {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.initMouseHandlers();
  }

  async init() {
    const shapesString = localStorage.getItem("existingShapes");
    if (!shapesString) {
      localStorage.setItem("existingShapes", JSON.stringify([]));
      return;
    }

    const shapes: Shape[] = JSON.parse(shapesString);
    super.setExistingShapes(shapes);

    super.init();
    this.clear();
  }

  initMouseHandlers(): void {
    super.initMouseHandlers();
    super.getCanvas().addEventListener("mouseup", this.handleParentMouseUp);
  }

  updateLocalStorage() {
    localStorage.removeItem("existingShapes");
    localStorage.setItem(
      "existingShapes",
      JSON.stringify(super.getExistingShapes())
    );
    this.clear();
  }

  private handleParentMouseUp = (e: MouseEvent) => {
    console.log("handleParentMouseUp");

    this.handleMouseUp(e);
    this.clear();

    this.updateLocalStorage();
  };
}
