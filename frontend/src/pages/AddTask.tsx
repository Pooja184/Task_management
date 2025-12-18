import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Creating task...");

    try {
      await api.post("/task/add-task", {
        title,
        description,
        priority,
        status: "Todo",
        dueDate,
        assignedToId: null,
      });

      toast.success("Task created successfully", { id: toastId });
      navigate("/");
    } catch (error) {
      toast.error("Failed to create task", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-1">Create New Task</h1>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details to add a new task
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-black"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg p-2.5 h-24 resize-none focus:ring-2 focus:ring-black"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-black"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-black"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 transition"
            >
              Create Task
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 border py-2.5 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
