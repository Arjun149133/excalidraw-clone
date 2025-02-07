import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createRoomHandler,
  deleteRoomHandler,
  getRoomChats,
  joinRoomHandler,
} from "../handlers/roomHandler";

const router: Router = Router();

router.post("/create", authenticate, createRoomHandler);
router.delete("/delete", authenticate, deleteRoomHandler);
router.get("/:roomId/chats", authenticate, getRoomChats);
router.get("/join/:roomId", authenticate, joinRoomHandler);

export default router;
