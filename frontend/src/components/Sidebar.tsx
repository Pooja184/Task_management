import { NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r p-4 flex flex-col gap-3 z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Manager</h2>
          <button onClick={onClose} className="md:hidden">
            <FiX size={20} />
          </button>
        </div>

        <NavItem to="/" label="Profile" onClick={onClose} />
        <NavItem to="/users" label="All Users" onClick={onClose} />
        <NavItem to="/add-task" label="Add Task" onClick={onClose} />
        <NavItem to="/all-tasks" label="All Tasks" onClick={onClose} />
        <NavItem to="/my-tasks" label="My Tasks" onClick={onClose} />
        <NavItem to="/assigned" label="Assigned to Me" onClick={onClose} />
        <NavItem to="/overdue" label="Overdue Tasks" onClick={onClose} />

        <div className="mt-auto">
          <button className="w-full border p-2 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) => (
  <NavLink
    to={to}
    end
    onClick={onClick}
    className={({ isActive }) =>
      `block p-2 rounded border ${
        isActive ? "bg-black text-white" : "hover:bg-gray-100"
      }`
    }
  >
    {label}
  </NavLink>
);

export default Sidebar;
