import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import chatRouter from "./routes/chat";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/chat", chatRouter);

app.listen(3001, () => {
  console.log("http-backend on port 3001");
});
