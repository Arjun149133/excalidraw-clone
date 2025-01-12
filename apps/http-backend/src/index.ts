import express from "express";
import db from "./db";

const app = express();

app.use(express.json());

app.get("/create-user", async (req, res) => {
  const random = Math.floor(Math.random() * 100);

  await db.user.create({
    data: {
      name: "arjun@" + random,
      email: "something@gmail.com",
      password: "password@" + random,
    },
  });

  const users = await db.user.findMany();

  res.json({
    users: users,
  });
});

app.listen(5000, () => {
  console.log("http-backend on port 5000");
});
