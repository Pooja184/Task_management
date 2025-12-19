"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/auth", auth_routes_1.default);
mainRouter.use("/task", task_routes_1.default);
exports.default = mainRouter;
