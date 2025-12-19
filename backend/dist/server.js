"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const index_1 = require("./socket/index");
const prisma_1 = __importDefault(require("./utils/prisma"));
const server = http_1.default.createServer(app_1.default);
//  Check MongoDB connection
async function startServer() {
    try {
        await prisma_1.default.$connect();
        console.log(" MongoDB connected successfully");
        (0, index_1.initSocket)(server);
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(" MongoDB connection failed");
        console.error(error);
        process.exit(1); // stop server if DB fails
    }
}
startServer();
