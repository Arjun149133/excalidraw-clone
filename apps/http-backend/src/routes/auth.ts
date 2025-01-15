import { Router } from "express";
import { loginHandler, registerHandler } from "../handlers/authHandler";

const router: Router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);

export default router;
