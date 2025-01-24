import {
  CircleIcon,
  EraserIcon,
  PenLineIcon,
  RectangleHorizontalIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tool } from "@/draw/Game";

const shapeButtons = [
  {
    icon: RectangleHorizontalIcon,
    tool: "rect",
  },
  {
    icon: CircleIcon,
    tool: "circle",
  },
  {
    icon: PenLineIcon,
    tool: "line",
  },
  {
    icon: EraserIcon,
    tool: "eraser",
  },
];

export default function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: any;
}) {
  return (
    <div className=" bg-gray-700 rounded-lg">
      {shapeButtons.map((s, index) => (
        <Button
          key={index}
          onClick={() => {
            setSelectedTool(s.tool);
          }}
          className=" bg-gray-700 hover:bg-gray-600 "
        >
          <s.icon />
        </Button>
      ))}
    </div>
  );
}
