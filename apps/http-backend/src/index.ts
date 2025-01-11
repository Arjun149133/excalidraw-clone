import express from "express";

const app = express();

app.listen(5000, () => {
  console.log("http-backend on port 5000");
});
