import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/room", roomRouter);

app.listen(3001, () => {
  console.log("http-backend on port 3001");
});
