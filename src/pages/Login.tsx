import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type UserRole =
  | "admin"
  | "shelter"
  | "adopter"
  | "foster";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type LoginResponse = {
  token: string;
  user: User;
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // API URL
  // =====================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://petadoptbackend.onrender.com/api";

  // =====================================================
  // ROLE BASED REDIRECT
  // =====================================================

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
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
  // LOGIN
  // =====================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!email || !password) {
      setError(
        "Please enter email and password."
      );

      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // LOGIN API
      // -------------------------------------------------

      const response =
        await axios.post<LoginResponse>(
          `${API_URL}/auth/login`,
          {
            email,
            password,
          }
        );

      // -------------------------------------------------
      // GET RESPONSE DATA
      // -------------------------------------------------

      const token =
        response.data.token;

      const user =
        response.data.user;

      console.log(
        "Login successful:",
        user
      );

      // -------------------------------------------------
      // SAVE TOKEN
      // -------------------------------------------------

      localStorage.setItem(
        "token",
        token
      );

      // -------------------------------------------------
      // SAVE USER
      // -------------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // -------------------------------------------------
      // TELL NAVBAR THAT LOGIN HAPPENED
      // -------------------------------------------------

      window.dispatchEvent(
        new Event("authChanged")
      );
      navigate(getDashboardPath(user.role));
      // -------------------------------------------------
      // GET ROLE
      // -------------------------------------------------

      const dashboardPath =
        getDashboardPath(user.role);

      console.log(
        "User role:",
        user.role
      );

      console.log(
        "Redirecting to:",
        dashboardPath
      );

      // -------------------------------------------------
      // REDIRECT TO ROLE DASHBOARD
      // -------------------------------------------------

      navigate(dashboardPath);

    } catch (error: any) {

      console.error(
        "Login Error:",
        error
      );

      // -------------------------------------------------
      // REMOVE OLD AUTH DATA IF LOGIN FAILED
      // -------------------------------------------------

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      window.dispatchEvent(
        new Event("authChanged")
      );

      // -------------------------------------------------
      // SHOW ERROR
      // -------------------------------------------------

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* =================================================
              TITLE
          ================================================== */}

          <div className="text-center mb-8">

            <div className="text-5xl mb-3">
              🐾
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-2">
              Login to your Pet Adoption account
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================== */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* =================================================
              REGISTER
          ================================================== */}

          <p className="text-center text-gray-600 mt-6">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;