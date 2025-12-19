import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { UserSummary } from "../types/user";

const AllUsers = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/summary");
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
        <p className="text-sm text-gray-500">
          Overview of users and their task statistics
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600">
          <span>User Name</span>
          <span className="text-center">Tasks Created</span>
          <span className="text-center">Tasks Assigned To</span>
          <span className="text-center text-red-600">Overdue Tasks</span>
        </div>

        {/* Rows */}
        {users.length === 0 && (
          <div className="p-6 text-gray-500 text-center">
            No users found
          </div>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-4 gap-4 px-6 py-4 border-t items-center hover:bg-gray-50 transition"
          >
            {/* Name */}
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>

            {/* Tasks Created */}
            <div className="text-center font-medium">
              {user.tasksCreated}
            </div>

            {/* Tasks Assigned */}
            <div className="text-center font-medium">
              {user.tasksAssigned}
            </div>

            {/* Overdue */}
            <div
              className={`text-center font-semibold ${
                user.overdueTasks > 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {user.overdueTasks}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
