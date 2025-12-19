import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import toast from "react-hot-toast";

const AllTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  //  Filters & Sort
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

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

  //  Filter + Sort Logic
  const filteredTasks = tasks
    .filter((task) => {
      if (statusFilter !== "All" && task.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "All" && task.priority !== priorityFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (loading) {
    return <p className="text-gray-500">Loading tasks...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Tasks</h1>
        <p className="text-sm text-gray-500">
          Filter and sort tasks by status, priority, and due date
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Status Filter */}
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          className="border rounded px-3 py-2"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        {/* Sort */}
        <select
          className="border rounded px-3 py-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Due Date ↑</option>
          <option value="desc">Due Date ↓</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <p className="text-gray-500">No tasks match the filters</p>
      )}

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default AllTasks;
