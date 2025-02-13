import { CircleIcon, PenLineIcon, RectangleHorizontalIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tool } from "@/utils/types";
import DashLine from "@/icons/DashLine";

interface ShapeButton {
  icon: any;
  tool: Tool;
}

const shapeButtons: ShapeButton[] = [
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
    tool: "freehand",
  },
  {
    icon: DashLine,
    tool: "line",
  },
  // { // TODO: Implement eraser
  //   icon: EraserIcon,
  //   tool: "eraser",
  // },
  // {
  //   icon: ArrowUpLeft,
  //   tool: "select",
  // },
];

export default function Topbar({
  selectedTool,
  setSelectedTool,
  select = true,
}: {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  select?: boolean;
}) {
  return (
    <div className=" flex bg-gray-700 rounded-lg">
      <div>
        {shapeButtons.map((s, index) => (
          <Button
            key={index}
            onClick={() => {
              setSelectedTool(s.tool);
            }}
            className={`bg-gray-700 hover:bg-gray-600 ${selectedTool === s.tool ? "bg-gray-500" : ""}`}
          >
            <s.icon />
          </Button>
        ))}
      </div>
      {select && (
        <div>
          <Button
            onClick={() => {
              setSelectedTool("select");
            }}
            className={`bg-gray-700 hover:bg-gray-600 ${selectedTool === "select" ? "bg-gray-500" : ""}`}
          >
            select
          </Button>
        </div>
      )}
    </div>
  );
}
