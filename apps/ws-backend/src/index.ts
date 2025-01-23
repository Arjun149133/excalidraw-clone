import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { getUser } from "./db/auth";
import db from "./db/index";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  roomIds: string[];
}

const roomMapping = new Map<string, User[]>();
const users: User[] = [];

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

wss.on("connection", async (ws, req) => {
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

  const userInDb = await getUser(userId);
  if (!userInDb) {
    ws.close();
    return;
  }

  const user: User = { ws, userId, roomIds: [] };

  users.push(user);

  ws.on("message", async (message) => {
    const data = JSON.parse(message.toString());
    console.log("herererer: ", data);

    if (data.type === "join_room") {
      const roomId = data.roomId;
      if (!roomId || typeof roomId !== "string") {
        return;
      }
      let room = roomMapping.get(roomId);
      if (!room) {
        roomMapping.set(roomId, []);
        room = roomMapping.get(roomId);
      }

      // const u = room?.find((u) => u.userId === userId);
      // if (u) {
      //   console.log("user exists already in this room");
      //   return;
      // }
      room?.push(user);
      user.roomIds.push(roomId);
      room?.forEach((u) => {
        u.ws.send(
          JSON.stringify({
            type: "joined_room",
            payload: {
              userId: userId,
            },
          })
        );
      });
    }

    if (data.type === "leave_room") {
      const roomId = data.roomId;
      let room = roomMapping.get(roomId);
      if (!room) {
        return;
      }

      const newRoom = room.filter((u) => u.userId !== userId);

      roomMapping.delete(roomId);
      roomMapping.set(roomId, newRoom);

      room = roomMapping.get(roomId);
      room?.forEach((u) => {
        u.ws.send(
          JSON.stringify({
            type: "left_room",
            payload: {
              userId: userId,
            },
          })
        );
      });
    }

    if (data.type === "chat") {
      try {
        const roomId = data.roomId;
        let room = roomMapping.get(roomId);
        if (!room) {
          console.log("returning no room");
          return;
        }

        if (!data.payload || !data.payload.shape || !data.payload.params) {
          console.log("returning no data payload");
          return;
        }

        const chat = await db.chat.create({
          data: {
            roomId: parseInt(roomId),
            message: JSON.stringify(data.payload),
            userId: userId,
          },
        });
        console.log(chat);

        room.forEach((u) => {
          console.log(u.userId);
          u.ws.send(
            JSON.stringify({
              type: "chat",
              roomId: roomId,
              payload: {
                shape: data.payload.shape,
                params: data.payload.params,
              },
            })
          );
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
});
