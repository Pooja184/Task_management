import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getIO } from "../socket";
import { Priority, Status } from "@prisma/client";


export const createTask = async (req: Request, res: Response) => {
  try {
    // extracting required fields from request body
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedToId,
    } = req.body;

    // basic validation to ensure no field is missing
    if (
      !title ||
      !description ||
      !dueDate ||
      !priority ||
      !status ||
      !assignedToId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // creating task in database using prisma
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate), // converting string date to Date object
        priority: priority as Priority,
        status: status as Status,
        assignedToId,
        creatorId: req.userId, // taking creator id from JWT, not from client
      },
    });

    // emitting socket event so frontend can update in real time
    getIO().emit("task-created", task);

    // sending success response
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error: any) {
    // logging error for debugging
    console.error("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    // fetching all tasks with creator and assigned user details
    const tasks = await prisma.task.findMany({
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" }, // latest tasks first
    });

    // sending tasks list with count
    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (error: any) {
    console.error("Get Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const tasks = await prisma.task.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        creator: {
          select: { name: true },
        },
        assignedTo: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch my tasks",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // task id from url params

    // extracting only updatable fields
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedToId,
    } = req.body;

    // checking if task exists before updating
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // updating task details
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority as Priority | undefined,
        status: status as Status | undefined,
        assignedToId,
      },
    });

    // emitting update event for realtime UI updates
    getIO().emit("task-updated", updatedTask);

    // emitting separate event if task is reassigned to another user
    if (assignedToId && assignedToId !== existingTask.assignedToId) {
      getIO().to(assignedToId).emit("task-assigned", updatedTask);
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (error: any) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;       // from auth middleware
    const { id } = req.params;       // task id

    // console.log(id,"id",userId,"user")
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Task id is required",
      });
    }
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // auth check
    if (task.creatorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this task",
      });
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    //  Emit socket event
    getIO().emit("task-deleted", id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task",
    });
  }
};


export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //  Only assigned user can update status
    if (task.assignedToId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only assigned user can update status",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    // SOCKET EMIT (REAL-TIME UPDATE)
    getIO().emit("task-status-updated", {
      taskId,
      status,
    });

    return res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAssignedToMeTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;

    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId, //assigned to logged-in user
      },
      include: {
        creator: {
          select: { name: true },
        },
        assignedTo: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch assigned tasks",
    });
  }
};


export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const today = new Date();

    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          lt: today, //  due date before today
        },
        status: {
          not: "Completed", //  not completed
        },
        OR: [
          { creatorId: userId },     // created by me
          { assignedToId: userId },  // assigned to me
        ],
      },
      include: {
        creator: {
          select: { name: true },
        },
        assignedTo: {
          select: { name: true },
        },
      },
      orderBy: {
        dueDate: "asc", // oldest overdue first
      },
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    console.error("Overdue Task Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch overdue tasks",
    });
  }
};




