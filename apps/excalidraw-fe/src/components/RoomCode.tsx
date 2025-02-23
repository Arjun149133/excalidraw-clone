const RoomCode = ({ roomId }: { roomId: string }) => {
  return (
    <div className=" bg-slate-300 rounded-md px-3 py-1">
      Room Code: {roomId}{" "}
    </div>
  );
};

export default RoomCode;
