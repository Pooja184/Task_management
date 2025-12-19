import { useState } from "react";
import api from "../api/axios";

const TaskForm = ({ onCreate }: { onCreate: () => void }) => {
  const [title, setTitle] = useState("");

  const submit = async () => {
    await api.post("/task/add-task", {
      title,
      description: "Task description",
      dueDate: new Date(),
      priority: "Medium",
      status: "Todo",
      assignedToId: "",
    });
    setTitle("");
    onCreate();
  };

  return (
    <div className="flex gap-2">
      <input className="border p-2 flex-1"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} />
      <button onClick={submit} className="bg-black text-white px-4">
        Add
      </button>
    </div>
  );
};

export default TaskForm;
