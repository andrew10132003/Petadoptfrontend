import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Pets from "../pages/Pets";
import Petdetails from "../pages/Petdetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Adopt from "../pages/Adopt";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ShelterDashboard from "../pages/ShelterDashboard";
import FosterDashboard from "../pages/FosterDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/pets" element={<Pets />} />

      <Route path="/pets/:id" element={<Petdetails />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Adoption Route */}
      <Route path="/adopt" element={<Adopt />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/shelter-dashboard"
        element={<ShelterDashboard />}
      />

      <Route
        path="/foster-dashboard"
        element={<FosterDashboard />}
      />
    </Routes>
  );
}

export default AppRoutes;