import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/room", roomRouter);

app.listen(5000, () => {
  console.log("http-backend on port 5000");
});
