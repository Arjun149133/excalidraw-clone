import SharedCanvas from "@/components/SharedCanvas";
import Topbar from "@/components/Topbar";

const CanvasCollabPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const roomId = (await params).roomId;

  return (
    <div className=" overflow-hidden">
      <SharedCanvas roomId={roomId} />
    </div>
  );
};

export default CanvasCollabPage;
