import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  roomIds: string[];
}

interface Room {
  roomId: string;
  users: User[];
}

function findUserId(token: string): string | null {
  try {
    const decoded = jwt.verify(token, "SECR3T");
    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const userToRoomMap = new Map<string, Room[]>();
const roomToUserMap = new Map<string, User[]>();

wss.on("connection", (ws, req) => {
  ws.on("error", () => {
    console.error;
  });

  const url = req.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) return;

  const userId = findUserId(token);
  if (!userId) {
    ws.close();
    return;
  }

  const user: User = {
    ws,
    userId,
    roomIds: [],
  };
  userToRoomMap.set(userId, []);

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    if (data.type === "join") {
      const roomId = data.payload.roomId;
      if (!roomId) return;

      let room = roomToUserMap.get(roomId);
      if (!room) {
        roomToUserMap.set(roomId, []);
      }
      ws.send(
        JSON.stringify({
          type: "join_success",
          payload: {
            roomId,
          },
        })
      );
    }
  });
});
