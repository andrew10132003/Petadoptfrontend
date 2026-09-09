import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

type Adoption = {
  _id: string;
  petId: string;
  petName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;

  userId?: {
    name: string;
    email: string;
    phone?: string;
  };
};

// =====================================================
// GET ALL ADOPTIONS
// =====================================================
const getAllAdoptions = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/admin/adoptions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =====================================================
// APPROVE ADOPTION
// =====================================================
const approveAdoption = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/admin/adoptions/${id}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =====================================================
// REJECT ADOPTION
// =====================================================
const rejectAdoption = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/admin/adoptions/${id}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================
function AdminDashboard() {
  const navigate = useNavigate();

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  // ===================================================
  // CHECK ADMIN + FETCH ADOPTIONS
  // ===================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // No login
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    // Check user
    try {
      const user = JSON.parse(userData);

      if (user.role !== "admin") {
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
      return;
    }

    // Fetch adoption requests
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllAdoptions();

        setAdoptions(data.adoptions || []);
      } catch (error: any) {
        console.error("Admin Dashboard Error:", error);

        // Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        // Not admin
        if (error.response?.status === 403) {
          navigate("/dashboard");
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

  // ===================================================
  // APPROVE
  // ===================================================
  const handleApprove = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this adoption request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      await approveAdoption(id);

      // Update UI immediately
      setAdoptions((currentAdoptions) =>
        currentAdoptions.map((adoption) =>
          adoption._id === id
            ? {
                ...adoption,
                status: "approved",
              }
            : adoption
        )
      );

      alert("Adoption request approved successfully.");
    } catch (error: any) {
      console.error("Approve Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to approve adoption request"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ===================================================
  // REJECT
  // ===================================================
  const handleReject = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this adoption request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      await rejectAdoption(id);

      // Update UI immediately
      setAdoptions((currentAdoptions) =>
        currentAdoptions.map((adoption) =>
          adoption._id === id
            ? {
                ...adoption,
                status: "rejected",
              }
            : adoption
        )
      );

      alert("Adoption request rejected successfully.");
    } catch (error: any) {
      console.error("Reject Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject adoption request"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ===================================================
  // LOADING
  // ===================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold">
          Loading admin dashboard...
        </h2>
      </div>
    );
  }

  // ===================================================
  // DASHBOARD
  // ===================================================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold">
            🛠️ Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Manage all pet adoption requests.
          </p>
        </div>

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ========================================= */}
        {/* STATISTICS */}
        {/* ========================================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          {/* TOTAL */}

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">
              Total
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {adoptions.length}
            </h2>
          </div>

          {/* PENDING */}

          <div className="bg-yellow-50 rounded-xl shadow p-5">
            <p className="text-yellow-700">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-700 mt-1">
              {
                adoptions.filter(
                  (item) => item.status === "pending"
                ).length
              }
            </h2>
          </div>

          {/* APPROVED */}

          <div className="bg-green-50 rounded-xl shadow p-5">
            <p className="text-green-700">
              Approved
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-1">
              {
                adoptions.filter(
                  (item) => item.status === "approved"
                ).length
              }
            </h2>
          </div>

          {/* REJECTED */}

          <div className="bg-red-50 rounded-xl shadow p-5">
            <p className="text-red-700">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-700 mt-1">
              {
                adoptions.filter(
                  (item) => item.status === "rejected"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* ========================================= */}
        {/* ALL ADOPTION REQUESTS */}
        {/* ========================================= */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">
            All Adoption Requests
          </h2>

          {/* NO REQUESTS */}

          {adoptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No adoption requests found.
              </p>
            </div>
          ) : (

            <div className="grid gap-6">

              {adoptions.map((adoption) => (

                <div
                  key={adoption._id}
                  className="border rounded-xl p-6 hover:shadow-md transition"
                >

                  {/* ================================= */}
                  {/* PET + STATUS */}
                  {/* ================================= */}

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                    <div>
                      <h3 className="text-xl font-bold">
                        🐾 {adoption.petName}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Pet ID: {adoption.petId}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Request ID: {adoption._id}
                      </p>
                    </div>

                    {/* STATUS */}

                    <span
                      className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-semibold ${
                        adoption.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : adoption.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : adoption.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {adoption.status.toUpperCase()}
                    </span>

                  </div>

                  {/* ================================= */}
                  {/* APPLICANT INFORMATION */}
                  {/* ================================= */}

                  <div className="grid md:grid-cols-2 gap-5 mt-6">

                    {/* Applicant */}

                    <div>
                      <p className="text-sm text-gray-500">
                        Applicant
                      </p>

                      <p className="font-semibold">
                        {adoption.userId?.name || "N/A"}
                      </p>
                    </div>

                    {/* Email */}

                    <div>
                      <p className="text-sm text-gray-500">
                        Email
                      </p>

                      <p className="font-medium break-all">
                        {adoption.email}
                      </p>
                    </div>

                    {/* Phone */}

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>

                      <p className="font-medium">
                        {adoption.phone}
                      </p>
                    </div>

                    {/* Occupation */}

                    <div>
                      <p className="text-sm text-gray-500">
                        Occupation
                      </p>

                      <p className="font-medium">
                        {adoption.occupation}
                      </p>
                    </div>

                    {/* Submitted */}

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

                  {/* ================================= */}
                  {/* ADDRESS */}
                  {/* ================================= */}

                  <div className="mt-5">

                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="font-medium">
                      {adoption.address}
                    </p>

                  </div>

                  {/* ================================= */}
                  {/* REASON */}
                  {/* ================================= */}

                  <div className="mt-5">

                    <p className="text-sm text-gray-500">
                      Reason for Adoption
                    </p>

                    <p className="font-medium">
                      {adoption.reason}
                    </p>

                  </div>

                  {/* ================================= */}
                  {/* ACTION BUTTONS */}
                  {/* ================================= */}

                  {adoption.status === "pending" && (

                    <div className="flex gap-3 mt-6 pt-5 border-t">

                      {/* APPROVE */}

                      <button
                        onClick={() =>
                          handleApprove(adoption._id)
                        }
                        disabled={
                          actionLoading === adoption._id
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-2 rounded-lg font-semibold transition"
                      >
                        {actionLoading === adoption._id
                          ? "Processing..."
                          : "✓ Approve"}
                      </button>

                      {/* REJECT */}

                      <button
                        onClick={() =>
                          handleReject(adoption._id)
                        }
                        disabled={
                          actionLoading === adoption._id
                        }
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-2 rounded-lg font-semibold transition"
                      >
                        {actionLoading === adoption._id
                          ? "Processing..."
                          : "✕ Reject"}
                      </button>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;