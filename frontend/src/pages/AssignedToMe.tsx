import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import toast from "react-hot-toast";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/authContext";

const AssignedToMe = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  //  Get logged-in user
  const { user } = useAuth();
  const userId = user?.id;

  //  Socket connection
  const socketRef = useSocket(userId);

  const fetchAssignedTasks = async () => {
    try {
      const res = await api.get("/task/assigned-to-me");
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load assigned tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
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

  const handleStatusChange = async (
    taskId: string,
    status: Task["status"]
  ) => {
    const toastId = toast.loading("Updating status...");

    try {
      await api.patch(`/task/${taskId}/status`, { status });

      // instant ui
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status } : t
        )
      );

      toast.success("Status updated", { id: toastId });
    } catch {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading tasks...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assigned To Me</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500">
          No tasks assigned to you.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            canUpdateStatus={true}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default AssignedToMe;
