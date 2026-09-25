import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Pets from "../pages/Pets";
import Petdetails from "../pages/Petdetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Adopt from "../pages/Adopt";
import Favorites from "../pages/Favorites";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ShelterDashboard from "../pages/ShelterDashboard";
import FosterDashboard from "../pages/FosterDashboard";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/" element={<Home />} />

      <Route path="/pets" element={<Pets />} />

      <Route path="/pets/:id" element={<Petdetails />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =====================================================
          FAVORITES
      ===================================================== */}

      <Route
        path="/favorites"
        element={<Favorites />}
      />

      {/* =====================================================
          ADOPTION PAGE
      ===================================================== */}

      <Route
        path="/adopt"
        element={
          <ProtectedRoute allowedRoles={["adopter"]} />
        }
      >
        <Route index element={<Adopt />} />
      </Route>

      {/* =====================================================
          ADOPTER
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["adopter"]} />
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>

      {/* =====================================================
          ADMIN
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]} />
        }
      >
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
      </Route>

      {/* =====================================================
          SHELTER
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["shelter"]} />
        }
      >
        <Route
          path="/shelter-dashboard"
          element={<ShelterDashboard />}
        />
      </Route>

      {/* =====================================================
          FOSTER
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["foster"]} />
        }
      >
        <Route
          path="/foster-dashboard"
          element={<FosterDashboard />}
        />
      </Route>

    </Routes>
  );
}

export default AppRoutes;