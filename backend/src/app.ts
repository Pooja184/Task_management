import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mainRouter from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api/v1", mainRouter);

export default app;
