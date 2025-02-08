import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

export const getExistingShapes = async (roomId: string, token: string) => {
  const res = await axios.get(`${HTTP_BACKEND_URL}/room/${roomId}/chats`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const existingShapes = res.data;

  return existingShapes;
};
