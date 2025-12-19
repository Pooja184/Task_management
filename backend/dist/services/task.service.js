"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTask = void 0;
const validateCreateTask = (data, userId) => {
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const { title, description, dueDate, priority, status, assignedToId, } = data;
    if (!title ||
        !description ||
        !dueDate ||
        !priority ||
        !status ||
        !assignedToId) {
        throw new Error("All fields are required");
    }
    return {
        ...data,
        creatorId: userId,
    };
};
exports.validateCreateTask = validateCreateTask;
