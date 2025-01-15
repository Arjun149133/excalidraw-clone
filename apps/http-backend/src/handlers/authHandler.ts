import { Request, Response } from "express";
import db from "../db";

const registerHandler = async (req: Request, res: Response) => {
  const { email, password } = await req.body;
  try {
    //TODO: zod package here
    const existingUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const user = await db.user.create({
      data: {
        email: email,
        password: password,
      },
    });

    res.status(201).json({
      msg: "User register successfull",
      user: user,
    });
  } catch (error) {
    console.error(error);
  }
};

const loginHandler = (req: Request, res: Response) => {
  res.json({
    hello: "helo login",
  });
};

export { registerHandler, loginHandler };
