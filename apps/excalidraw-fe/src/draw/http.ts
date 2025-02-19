import axios from "axios";

export const getExistingShapes = async (roomId: string, token: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/room/${roomId}/chats`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const existingShapes = res.data;

  return existingShapes;
};
