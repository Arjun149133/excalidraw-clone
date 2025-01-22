import Canvas from "@/components/CanvasMe";
import { Button } from "@/components/ui/button";
import {
  CircleIcon,
  EraserIcon,
  PenLineIcon,
  RectangleHorizontalIcon,
} from "lucide-react";

const CanvasMePage = () => {
  return (
    <div className=" overflow-hidden">
      <div className=" absolute top-2 left-5">
        <Topbar />
      </div>
      <Canvas />
    </div>
  );
};

export default CanvasMePage;

const shapeButtons = [
  {
    icon: RectangleHorizontalIcon,
  },
  {
    icon: CircleIcon,
  },
  {
    icon: PenLineIcon,
  },
  {
    icon: EraserIcon,
  },
];

export function Topbar() {
  return (
    <div className=" bg-gray-700 rounded-lg">
      {shapeButtons.map((s, index) => (
        <Button key={index} className=" bg-gray-700 hover:bg-gray-600 ">
          <s.icon />
        </Button>
      ))}
    </div>
  );
}
