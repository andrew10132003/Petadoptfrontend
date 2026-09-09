import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Navbar() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  // Get login information
  const token = localStorage.getItem("token");

  // Get user information
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check whether logged-in user is admin
  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        {/* ============================= */}
        {/* LOGO */}
        {/* ============================= */}

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          🐾 PetAdopt 🐾
        </Link>

        {/* ============================= */}
        {/* NAVIGATION */}
        {/* ============================= */}

        <div className="flex items-center space-x-6">

          {/* Home */}
          <Link
            to="/"
            className="hover:text-blue-700"
          >
            Home
          </Link>

          {/* Pets */}
          <Link
            to="/pets"
            className="hover:text-blue-700"
          >
            Pets
          </Link>

          {/* Favorites */}
          <Link
            to="/favorites"
            className="font-semibold hover:text-blue-700"
          >
            ❤️ Favorites ({favorites.length})
          </Link>

          {/* ============================= */}
          {/* LOGGED IN USER */}
          {/* ============================= */}

          {token ? (
            <>
              {/* ============================= */}
              {/* ADMIN DASHBOARD */}
              {/* ============================= */}

              {isAdmin ? (
                <Link
                  to="/admin-dashboard"
                  className="font-semibold hover:text-blue-700"
                >
                  🛠️ Admin Dashboard
                </Link>
              ) : (
                /* ============================= */
                /* NORMAL USER DASHBOARD */
                /* ============================= */

                <Link
                  to="/dashboard"
                  className="font-semibold hover:text-blue-700"
                >
                  Dashboard
                </Link>
              )}

              {/* ============================= */}
              {/* LOGOUT */}
              {/* ============================= */}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* ============================= */}
              {/* LOGIN */}
              {/* ============================= */}

              <Link
                to="/login"
                className="font-semibold hover:text-blue-700"
              >
                Login
              </Link>

              {/* ============================= */}
              {/* REGISTER */}
              {/* ============================= */}

              <Link
                to="/register"
                className="font-semibold hover:text-blue-700"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;