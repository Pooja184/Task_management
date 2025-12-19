import { validateCreateTask } from "../task.service";
import { Priority, Status } from "@prisma/client";

describe("validateCreateTask", () => {

  // test 1: user not logged in
  it("should throw error if userId is missing", () => {
    expect(() =>
      validateCreateTask(
        {
          title: "Test Task",
          description: "Test Desc",
          dueDate: "2025-03-10",
          priority: Priority.High,
          status: Status.Todo,
          assignedToId: "user123",
        },
        undefined
      )
    ).toThrow("Unauthorized");
  });

  // test 2: missing fields
  it("should throw error if required fields are missing", () => {
    expect(() =>
      validateCreateTask(
        {
          title: "Test Task",
        },
        "creator123"
      )
    ).toThrow("All fields are required");
  });

  // test 3: valid input
  it("should return valid task data when input is correct", () => {
    const result = validateCreateTask(
      {
        title: "Valid Task",
        description: "Valid Description",
        dueDate: "2025-03-10",
        priority: Priority.Medium,
        status: Status.Todo,
        assignedToId: "user123",
      },
      "creator123"
    );

    expect(result.creatorId).toBe("creator123");
    expect(result.title).toBe("Valid Task");
  });

});
