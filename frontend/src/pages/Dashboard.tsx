import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
