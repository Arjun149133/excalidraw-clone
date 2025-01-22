import { Request, Response } from "express";
import db from "../db";
import { Room } from "@repo/common/types";

const createRoomHandler = async (req: Request, res: Response) => {
  try {
    const { name } = await req.body;
    const roomSchema = Room.safeParse({
      name: name,
    });

    if (!roomSchema.success) {
      res.status(400).json({
        message: "Invalid input",
        err: roomSchema.error.errors,
      });
      return;
    }

    const existingRoom = await db.room.findFirst({
      where: {
        slug: name,
      },
    });

    if (existingRoom) {
      res.status(400).json({
        message: "Room already exists",
      });
      return;
    }

    const room = await db.room.create({
      data: {
        slug: name,
        adminId: req.body.userId, // from authenticate middleware
      },
    });

    res.status(201).json({
      message: "Room created successfully",
      room: room,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getRoomChats = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      res.status(400).json({
        msg: "no roomId provided",
      });
      return;
    }

    const existingChats = await db.chat.findMany({
      where: {
        roomId: parseInt(roomId),
      },
    });

    res.status(200).json({
      existingChats: existingChats,
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteRoomHandler = async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    const roomId = parseInt(data.roomId);

    const room = await db.room.findFirst({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }
    if (room.adminId !== req.body.userId) {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }

    await db.room.delete({
      where: {
        id: roomId,
      },
    });

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

export { createRoomHandler, deleteRoomHandler };
