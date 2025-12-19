import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import toast from "react-hot-toast";

const OverdueTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverdueTasks = async () => {
    try {
      const res = await api.get("/task/overdue");
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load overdue tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueTasks();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading overdue tasks...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-600">
          Overdue Tasks
        </h1>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <p className="text-gray-500">
           No overdue tasks. You’re on track!
        </p>
      )}

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default OverdueTasks;
