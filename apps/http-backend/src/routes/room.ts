import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createRoomHandler,
  deleteRoomHandler,
  getRoomChats,
} from "../handlers/roomHandler";

const router: Router = Router();

router.post("/create", authenticate, createRoomHandler);
router.delete("/delete", authenticate, deleteRoomHandler);
router.get("/:roomId/chats", authenticate, getRoomChats);

export default router;
