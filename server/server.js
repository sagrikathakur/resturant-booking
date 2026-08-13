import express from "express";
import dotenv from "dotenv";

dotenv.config();

const myServer = express();
const port = process.env.PORT || 5000;

myServer.get("/", (req, res) => {
  res.send("hello server is running");
});

myServer.listen(port, () => {
  console.log(`app is running on port ${port}`);
});