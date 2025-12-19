import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mainRouter from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: true, 
  credentials: true,
};

app.use(cors(corsOptions)); 

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api/v1", mainRouter);

export default app;
