import { Navigate, Outlet } from "react-router-dom";

type UserRole =
  | "admin"
  | "shelter"
  | "adopter"
  | "foster";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // User must be logged in
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  // Get user's role
  let userRole: UserRole | null = null;

  try {
    const user = JSON.parse(storedUser);
    userRole = user.role || null;
  } catch (error) {
    console.error("Unable to read user role:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Check whether user's role is allowed
  if (
    allowedRoles &&
    (!userRole || !allowedRoles.includes(userRole))
  ) {
    return <Navigate to="/" replace />;
  }

  // Access allowed
  return <Outlet />;
}

export default ProtectedRoute;