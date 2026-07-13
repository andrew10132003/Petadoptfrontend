import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import PetsPage from "../pages/Pets";
import Petdetails from "../pages/Petdetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Favorites from "../pages/Favorites";
import Adopt from "../pages/Adopt";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/pets/:id" element={<Petdetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;