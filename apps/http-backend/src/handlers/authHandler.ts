import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@repo/common/types";

//TODO: name route

const registerHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = await req.body;
    const userShcema = User.safeParse({
      email: email,
      password: password,
    });

    if (!userShcema.success) {
      res.status(400).json({
        message: "Invalid input",
        err: userShcema.error.errors,
      });
      return;
    }

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
    const userShcema = User.safeParse({
      email: email,
      password: password,
    });

    if (!userShcema.success) {
      res.status(400).json({
        message: "Invalid input",
        err: userShcema.error.errors,
      });
      return;
    }

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

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
