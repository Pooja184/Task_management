import type { Task } from "../types/task";

const statusColor = {
  Todo: "bg-gray-200 text-gray-800",
  InProgress: "bg-blue-100 text-blue-800",
  Review: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
};

const priorityColor = {
  Low: "border-green-400 text-green-600",
  Medium: "border-blue-400 text-blue-600",
  High: "border-orange-400 text-orange-600",
  Urgent: "border-red-400 text-red-600",
};

type TaskCardProps = {
  task: Task;
  canUpdateStatus?: boolean;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  canDelete?: boolean;
  onDelete?: (taskId: string) => void;
};

const TaskCard = ({
  task,
  canUpdateStatus = false,
  onStatusChange,
  canDelete = false,
  onDelete,
}: TaskCardProps) => {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow transition flex flex-col">
      {/* Title */}
      <h3 className="font-semibold text-lg mb-1 truncate">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Status & Priority */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-xs px-2 py-1 rounded ${statusColor[task.status]}`}
        >
          {task.status}
        </span>

        <span
          className={`text-xs px-2 py-1 rounded border ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 space-y-1 mb-3">
        <p>
          <span className="font-medium">Due:</span>{" "}
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Created by:</span>{" "}
          {task.creator?.name || "N/A"}
        </p>
        <p>
          <span className="font-medium">Assigned to:</span>{" "}
          {task.assignedTo?.name || "Unassigned"}
        </p>
      </div>

      {/* ACTIONS */}
      {(canUpdateStatus || canDelete) && (
        <div className="mt-auto pt-3 border-t space-y-2">
          {/* Status Update */}
          {canUpdateStatus && onStatusChange && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Update Status
              </label>
              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange(task.id, e.target.value as Task["status"])
                }
                className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black"
              >
                <option value="Todo">Todo</option>
                <option value="InProgress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* Delete (CREATOR ONLY) */}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="w-full text-sm text-red-600 border border-red-300 rounded py-1.5 hover:bg-red-50 transition"
            >
              Delete Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
