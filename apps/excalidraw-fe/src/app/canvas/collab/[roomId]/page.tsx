import SharedCanvas from "@/components/SharedCanvas";

const CanvasCollabPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const roomId = (await params).roomId;

  if (!roomId) {
    return <div>no room id</div>;
  }

  return (
    <div className=" overflow-hidden">
      <SharedCanvas roomId={roomId} />
    </div>
  );
};

export default CanvasCollabPage;
