import { BACKEND_URL } from "@/lib/config";
import axios from "axios";

export const getExistingShapes = async (roomId: string, token: string) => {
  const res = await axios.get(`${BACKEND_URL}/room/${roomId}/chats`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const existingShapes = res.data;

  return existingShapes;
};
