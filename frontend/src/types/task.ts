export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Todo" | "InProgress" | "Review" | "Completed";
  creator: { name: string };
  assignedTo: { name: string };
};
