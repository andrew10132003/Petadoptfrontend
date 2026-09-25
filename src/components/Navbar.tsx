import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type User = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: "admin" | "shelter" | "adopter" | "foster";
};

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // LOAD USER FROM LOCAL STORAGE
  // =====================================================

  const loadUser = () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      setUser(null);
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to read user data:", error);
      setUser(null);
    }
  };

  // =====================================================
  // LISTEN FOR LOGIN / LOGOUT
  // =====================================================

  useEffect(() => {
    // Load when Navbar first appears
    loadUser();

    // Works when localStorage changes from another tab
    window.addEventListener("storage", loadUser);

    // Works when login/logout happens in THIS tab
    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  // =====================================================
  // ROLE BASED DASHBOARD
  // =====================================================

  const getDashboardPath = () => {
    switch (user?.role) {
      case "admin":
        return "/admin-dashboard";

      case "shelter":
        return "/shelter-dashboard";

      case "adopter":
        return "/dashboard";

      case "foster":
        return "/foster-dashboard";

      default:
        return "/login";
    }
  };

  // =====================================================
  // ROLE NAME
  // =====================================================

  const getRoleName = () => {
    switch (user?.role) {
      case "admin":
        return "Admin";

      case "shelter":
        return "Shelter";

      case "adopter":
        return "Adopter";

      case "foster":
        return "Foster";

      default:
        return "";
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Immediately update Navbar
    setUser(null);

    // Close mobile menu
    setMenuOpen(false);

    // Tell other components that authentication changed
    window.dispatchEvent(new Event("authChanged"));

    // Go to homepage
    navigate("/");
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // NAVBAR
  // =====================================================

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">
              🐾
            </span>

            <span className="text-xl font-bold text-blue-600">
              Pet Adoption🐶
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden md:flex items-center gap-6">

            {/* HOME */}

            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>

            {/* PETS */}

            <Link
              to="/pets"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Pets
            </Link>

            {/* FAVORITES */}

            <Link
              to="/favorites"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              ❤️ Favorites
            </Link>

            {user ? (
              <>
                {/* DASHBOARD */}

                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>

                {/* USER INFORMATION */}

                <div className="flex items-center gap-3">

                  <div className="text-right">

                    <p className="text-sm font-semibold text-gray-800">
                      {user.name || "User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {getRoleName()}
                    </p>

                  </div>

                  {/* LOGOUT */}

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Logout
                  </button>

                </div>
              </>
            ) : (
              <>
                {/* LOGIN */}

                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>

                {/* REGISTER */}

                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Register
                </Link>
              </>
            )}

          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================== */}

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">

            <div className="flex flex-col gap-2">

              {/* HOME */}

              <Link
                to="/"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                🏠 Home
              </Link>

              {/* PETS */}

              <Link
                to="/pets"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                🐾 Pets
              </Link>

              {/* FAVORITES */}

              <Link
                to="/favorites"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                ❤️ Favorites
              </Link>

              {user ? (
                <>
                  {/* DASHBOARD */}

                  <Link
                    to={getDashboardPath()}
                    onClick={closeMenu}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    📊 Dashboard
                  </Link>

                  {/* USER INFORMATION */}

                  <div className="border-t pt-4 mt-2 px-3">

                    <p className="font-semibold text-gray-800">
                      {user.name || "User"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {getRoleName()}
                    </p>

                    {user.email && (
                      <p className="text-xs text-gray-400 mt-1 break-all">
                        {user.email}
                      </p>
                    )}

                  </div>

                  {/* LOGOUT */}

                  <button
                    onClick={handleLogout}
                    className="mx-3 mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* LOGIN */}

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    🔐 Login
                  </Link>

                  {/* REGISTER */}

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mx-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center"
                  >
                    📝 Register
                  </Link>
                </>
              )}

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;