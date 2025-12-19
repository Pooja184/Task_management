import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import Profile from "./pages/Profile";
import AllTasks from "./pages/AllTask";
import MyTasks from "./pages/MyTasks";
import AssignedToMe from "./pages/AssignedToMe";
import OverdueTasks from "./pages/OverdueTasks";
import AllUsers from "./pages/AllUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes */}
          <Route path="add-task" element={<AddTask />} />
          <Route path="/" element={<Profile />} />
          <Route path="all-tasks" element={<AllTasks/>}/>
          <Route path="my-tasks" element={<MyTasks/>}/>
          <Route path="assigned" element={<AssignedToMe/>}/>
          <Route path="overdue" element={<OverdueTasks/>}/>
          <Route path="summary" element={<AllUsers/>}/> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
