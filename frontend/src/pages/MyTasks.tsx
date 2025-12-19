import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import toast from "react-hot-toast";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/authContext";

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Logged-in user
  const { user } = useAuth();
  const userId = user?.id;

  // 🔌 Socket connection
  const socketRef = useSocket(userId);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/task/my-tasks");
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load my tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  //  SOCKET LISTENERS
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Status updated by assignee
    socket.on("task-status-updated", ({ taskId, status }) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    });

    // Task deleted (other tab / session)
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

  //  Creator delete
  const handleDelete = async (taskId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting task...");

    try {
      await api.delete(`/task/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete task", { id: toastId });
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading my tasks...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <p className="text-gray-500">
          You haven’t created any tasks yet.
        </p>
      )}

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            canDelete={true}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
