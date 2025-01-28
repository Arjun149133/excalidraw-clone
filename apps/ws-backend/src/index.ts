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
  console.log("Connection made");
  ws.on("error", () => {
    console.error;
  });

  ws.on("close", () => {
    console.log("Connection closed");
    // Clean up user and room mappings
    const userIndex = users.findIndex((u) => u.ws === ws);
    if (userIndex !== -1) {
      const user = users[userIndex];
      if (!user) return;
      console.log("close: ", user.userId);
      user.roomIds.forEach((roomId) => {
        const room = roomMapping.get(roomId);
        if (room) {
          const updatedRoom = room.filter((u) => u.userId !== user.userId);
          roomMapping.set(roomId, updatedRoom);
        }
      });
      users.splice(userIndex, 1);
    }
  });

  const url = req.url;
  if (!url) {
    console.log("no url");
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    console.log("no token");
    return;
  }

  const userId = findUserId(token);
  if (!userId) {
    console.log("no user id");
    ws.close();
    return;
  }

  const userInDb = await getUser(userId);
  if (!userInDb) {
    console.log("no user in db");
    ws.close();
    return;
  }

  const user: User = { ws, userId, roomIds: [] };

  users.push(user);

  ws.on("message", async (message) => {
    console.log("we are in msg");
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
          console.log("returning no room ", roomId);
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

        console.log("created chat");
        room.forEach((u) => {
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
