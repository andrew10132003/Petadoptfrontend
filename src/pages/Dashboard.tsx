import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyAdoptions,
  cancelAdoption,
} from "../api/adoptionService";

type Adoption = {
  _id: string;
  petId: string;
  petName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
  status: "pending" | "cancelled" | "approved" | "rejected";
  createdAt: string;
};
function Dashboard() {
  const navigate = useNavigate();

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAdoptions = async () => {
      try {
        const data = await getMyAdoptions();

        setAdoptions(data.adoptions || []);
      } catch (error: any) {
        console.error("Dashboard Error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load adoption requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, [navigate]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading dashboard...
        </h2>
      </div>
    );
  }
  const handleCancel = async (id: string) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this adoption request?"
  );

  if (!confirmCancel) {
    return;
  }

  try {
    await cancelAdoption(id);

    alert("Adoption request cancelled successfully.");

    // Update UI immediately
    setAdoptions((prev) =>
      prev.map((adoption) =>
        adoption._id === id
          ? { ...adoption, status: "cancelled" }
          : adoption
      )
    );
  } catch (error: any) {
    console.error("Cancel Error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to cancel adoption request"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <h1 className="text-3xl font-bold">
            Welcome, {user.name || "User"} 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your pet adoption requests here.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Adoption Requests */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">
            My Adoption Requests
          </h2>

          {adoptions.length === 0 ? (
            <div className="text-center py-10">

              <p className="text-gray-500 text-lg">
                You haven't submitted any adoption requests yet.
              </p>

              <button
                onClick={() => navigate("/pets")}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Browse Pets
              </button>

            </div>
          ) : (
            <div className="grid gap-6">

              {adoptions.map((adoption) => (
                <div
                  key={adoption._id}
                  className="border rounded-xl p-5"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="text-xl font-bold">
                        🐾 {adoption.petName}
                      </h3>

                      <p className="text-gray-500">
                        Pet ID: {adoption.petId}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        adoption.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : adoption.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : adoption.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"}`}
                        >
                          {adoption.status.charAt(0).toUpperCase() +
                          adoption.status.slice(1)}
                          </span>

                      {adoption.status === "pending" && (
                        <button
                          onClick={() => handleCancel(adoption._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-5">

                    <div>
                      <p className="text-sm text-gray-500">
                        Email
                      </p>

                      <p className="font-medium">
                        {adoption.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>

                      <p className="font-medium">
                        {adoption.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Occupation
                      </p>

                      <p className="font-medium">
                        {adoption.occupation}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Submitted
                      </p>

                      <p className="font-medium">
                        {new Date(
                          adoption.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">

                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="font-medium">
                      {adoption.address}
                    </p>

                  </div>
                  <div className="mt-4">
                     <p className="text-sm text-gray-500">
                      Reason for Adoption
                      </p>
                      <p className="font-medium">
                        {adoption.reason}
                        </p>
                        </div>
                        {adoption.status === "pending" && (
                          <button
                          onClick={() => handleCancel(adoption._id)}
                          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-semibold"
                          >Cancel Request
                          </button>)}

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;