import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Pets from "../pages/Pets";
import Petdetails from "../pages/Petdetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Favorites from "../pages/Favorites";
import Adopt from "../pages/Adopt";
import AdminDashboard from "../pages/adminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pets" element={<Pets />} />
      <Route path="/pets/:id" element={<Petdetails />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/adopt" element={<Adopt />} />

      {/* Admin */}
      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-gray-600 mt-2">
                Page not found
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;