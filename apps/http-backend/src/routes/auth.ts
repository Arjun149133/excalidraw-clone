import { Router } from "express";
import { loginHandler, registerHandler } from "../handlers/authHandler";

const router: Router = Router();

router.get("/register", registerHandler);
router.get("/login", loginHandler);

export default router;
