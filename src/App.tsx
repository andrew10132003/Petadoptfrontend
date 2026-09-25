import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { FavoritesProvider } from "./context/FavoritesContext";

type UserRole =
  | "admin"
  | "shelter"
  | "adopter"
  | "foster"
  | null;

function App() {
  const [role, setRole] = useState<UserRole>(null);

  const loadUserRole = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setRole(null);
        return;
      }

      const user = JSON.parse(storedUser);

      setRole(user.role || null);
    } catch (error) {
      console.error("Unable to read user role:", error);
      setRole(null);
    }
  };

  useEffect(() => {
    loadUserRole();

    window.addEventListener("authChanged", loadUserRole);
    window.addEventListener("storage", loadUserRole);

    return () => {
      window.removeEventListener("authChanged", loadUserRole);
      window.removeEventListener("storage", loadUserRole);
    };
  }, []);

  const getBackgroundColor = () => {
    switch (role) {
      case "adopter":
        return "bg-blue-100";

      case "shelter":
        return "bg-red-100";

      case "foster":
        return "bg-purple-300";

      case "admin":
        return "bg-sky-200";

      default:
        return "bg-gray-150";
    }
  };

  return (
    <FavoritesProvider>
      <div
        className={`${getBackgroundColor()} min-h-screen transition-colors duration-300`}
      >
        <Navbar />

        <main className="min-h-[80vh]">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </FavoritesProvider>
  );
}

export default App;