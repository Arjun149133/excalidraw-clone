import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, "SECR3T");
    if (!decoded || typeof decoded !== "object") {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("erorr here:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { authenticate };
