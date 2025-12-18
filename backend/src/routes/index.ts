import { Router } from "express";
import authRouter from "./auth.routes";
import taskRouter from "./task.routes";

const mainRouter=Router();

mainRouter.use("/auth",authRouter);
mainRouter.use("/task",taskRouter)
export default mainRouter;