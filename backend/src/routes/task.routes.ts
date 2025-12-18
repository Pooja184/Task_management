import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller";

const taskRouter=Router();

taskRouter.post("/add-task",protect,createTask)
taskRouter.get("/get-tasks",protect,getTasks);
taskRouter.put("/:id",protect,updateTask)
taskRouter.delete("/:id",protect,deleteTask)

export default taskRouter;