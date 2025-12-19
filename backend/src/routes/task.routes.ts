import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { createTask, deleteTask, getAssignedToMeTasks, getMyTasks, getTasks, updateTask, updateTaskStatus } from "../controllers/task.controller";

const taskRouter=Router();

taskRouter.post("/add-task",protect,createTask)
taskRouter.get("/get-tasks",protect,getTasks);
taskRouter.put("/:id",protect,updateTask)
taskRouter.delete("/:id",protect,deleteTask)
taskRouter.get("/my-tasks",protect,getMyTasks)
taskRouter.patch("/:taskId/status",protect,updateTaskStatus)
taskRouter.get("/assigned-to-me",protect,getAssignedToMeTasks)
export default taskRouter;