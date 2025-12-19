import { Priority, Status } from "@prisma/client";

type CreateTaskInput = {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
  assignedToId?: string;
};

export const validateCreateTask = (
  data: CreateTaskInput,
  userId?: string
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const {
    title,
    description,
    dueDate,
    priority,
    status,
    assignedToId,
  } = data;

  if (
    !title ||
    !description ||
    !dueDate ||
    !priority ||
    !status ||
    !assignedToId
  ) {
    throw new Error("All fields are required");
  }

  return {
    ...data,
    creatorId: userId,
  };
};
