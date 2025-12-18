import http from "http";
import app from "./app";
import "dotenv/config";

import { initSocket } from "./socket/index";
import prisma from "./utils/prisma"; 

const server = http.createServer(app);

//  Check MongoDB connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log(" MongoDB connected successfully");

    initSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" MongoDB connection failed");
    console.error(error);
    process.exit(1); // stop server if DB fails
  }
}

startServer();
