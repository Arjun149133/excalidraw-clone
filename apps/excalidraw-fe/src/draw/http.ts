import { token } from "@/hooks/useSocket";
import { HTTP_URL } from "@/utils/config";
import axios from "axios";

export const getExistingShapes = async (roomId: string) => {
  const res = await axios.get(`${HTTP_URL}/room/${roomId}/chats`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const existingShapes = res.data;

  return existingShapes;
};
