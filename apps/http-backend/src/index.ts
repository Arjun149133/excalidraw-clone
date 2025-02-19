import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import chatRouter from "./routes/chat";
import cors from "cors";
import db from "./db";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/chat", chatRouter);

app.use("/", async (req, res) => {
  try {
    const result = await db.user.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("http-backend on port 5000");
});
