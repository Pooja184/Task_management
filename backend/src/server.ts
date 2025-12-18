import http from "http";
import app from "./app";
import "dotenv/config";

import { initSocket } from "./socket/index";

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
