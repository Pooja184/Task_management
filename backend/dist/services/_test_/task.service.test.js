"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = require("../task.service");
const client_1 = require("@prisma/client");
describe("validateCreateTask", () => {
    // test 1: user not logged in
    it("should throw error if userId is missing", () => {
        expect(() => (0, task_service_1.validateCreateTask)({
            title: "Test Task",
            description: "Test Desc",
            dueDate: "2025-03-10",
            priority: client_1.Priority.High,
            status: client_1.Status.Todo,
            assignedToId: "user123",
        }, undefined)).toThrow("Unauthorized");
    });
    // test 2: missing fields
    it("should throw error if required fields are missing", () => {
        expect(() => (0, task_service_1.validateCreateTask)({
            title: "Test Task",
        }, "creator123")).toThrow("All fields are required");
    });
    // test 3: valid input
    it("should return valid task data when input is correct", () => {
        const result = (0, task_service_1.validateCreateTask)({
            title: "Valid Task",
            description: "Valid Description",
            dueDate: "2025-03-10",
            priority: client_1.Priority.Medium,
            status: client_1.Status.Todo,
            assignedToId: "user123",
        }, "creator123");
        expect(result.creatorId).toBe("creator123");
        expect(result.title).toBe("Valid Task");
    });
});
