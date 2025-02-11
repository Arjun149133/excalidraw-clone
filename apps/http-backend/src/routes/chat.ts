import { Router } from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.put("/:chatId", authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const message = req.body.message;

    if (typeof message !== "string") {
      res.status(400).json({
        message: "message must be a string",
      });
      return;
    }

    if (!chatId) {
      res.status(400).json({
        message: "no chatId provided",
      });
      return;
    }

    const chat = await db.chat.findFirst({
      where: {
        id: parseInt(chatId),
      },
    });

    if (!chat) {
      res.status(404).json({
        message: "chat not found",
      });
      return;
    }

    const updatedChat = await db.chat.update({
      where: {
        id: parseInt(chatId),
      },
      data: {
        message: message,
      },
    });

    res.status(200).json({
      message: "chat updated",
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
