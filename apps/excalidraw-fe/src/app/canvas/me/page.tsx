import Canvas from "@/components/CanvasMe";
import Topbar from "@/components/Topbar";

const CanvasMePage = () => {
  return (
    <div className=" overflow-hidden">
      <div className=" absolute top-2 left-5">{/* <Topbar /> */}</div>
      <Canvas />
    </div>
  );
};

export default CanvasMePage;
