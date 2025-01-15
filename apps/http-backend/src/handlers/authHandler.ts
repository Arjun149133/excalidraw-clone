import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = await req.body;
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      msg: "User register successfull",
      email: user.email,
    });
  } catch (error) {
    console.error(error);
  }
};

const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    //TODO: common package
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      "SECR3T"
    );

    res.status(200).json({
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

export { registerHandler, loginHandler };
