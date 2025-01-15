import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createRoomHandler, deleteRoomHandler } from "../handlers/roomHandler";

const router: Router = Router();

router.post("/create", authenticate, createRoomHandler);
router.delete("/delete", authenticate, deleteRoomHandler);

export default router;
