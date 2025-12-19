import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import toast from "react-hot-toast";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/authContext";

const AllTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Logged-in user(for socket)
  const { user } = useAuth();
  const userId = user?.id;

  // 🔌 Socket connection
  const socketRef = useSocket(userId);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/task/get-tasks");
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //  SOCKET LISTENERS
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Status updated
    socket.on("task-status-updated", ({ taskId, status }) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    });

    // Task deleted
    socket.on("task-deleted", (taskId: string) => {
      setTasks((prev) =>
        prev.filter((task) => task.id !== taskId)
      );
    });

    return () => {
      socket.off("task-status-updated");
      socket.off("task-deleted");
    };
  }, [socketRef]);

  if (loading) {
    return <p className="text-gray-500">Loading tasks...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Tasks</h1>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <p className="text-gray-500">No tasks available</p>
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

export default AllTasks;
