import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

type PetDetails = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
};

type Adoption = {
  _id: string;

  userId?: {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };

  petId?: PetDetails;

  petName: string;

  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;

  status:
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled";

  createdAt: string;
};

function ShelterDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // GET SHELTER ADOPTION REQUESTS
  // =====================================================

  const getShelterAdoptions = async () => {
    const token = getToken();

    const response = await api.get(
      "/adoptions/shelter",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

  // =====================================================
  // APPROVE ADOPTION
  // =====================================================

  const approveAdoption = async (
    id: string
  ) => {
    const token = getToken();

    const response = await api.patch(
      `/adoptions/shelter/${id}/approve`,
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

  const rejectAdoption = async (
    id: string
  ) => {
    const token = getToken();

    const response = await api.patch(
      `/adoptions/shelter/${id}/reject`,
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
  // LOAD SHELTER DASHBOARD
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    const userData =
      localStorage.getItem("user");

    // ---------------------------------------------------
    // CHECK LOGIN
    // ---------------------------------------------------

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    // ---------------------------------------------------
    // CHECK SHELTER ROLE
    // ---------------------------------------------------

    try {
      const user = JSON.parse(userData);

      if (user.role !== "shelter") {
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");

      return;
    }

    // ---------------------------------------------------
    // FETCH REQUESTS
    // ---------------------------------------------------

    const fetchShelterData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getShelterAdoptions();

          setAdoptions(
            data.adoptions || []
          );
        } catch (error: any) {
          console.error(
            "Shelter Dashboard Error:",
            error
          );

          // Unauthorized
          if (
            error.response?.status ===
            401
          ) {
            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "user"
            );

            navigate("/login");

            return;
          }

          // Forbidden
          if (
            error.response?.status ===
            403
          ) {
            navigate("/dashboard");

            return;
          }

          setError(
            error.response?.data
              ?.message ||
              "Unable to load shelter dashboard."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchShelterData();
  }, [navigate]);

  // =====================================================
  // APPROVE HANDLER
  // =====================================================

  const handleApprove = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to approve this adoption request?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      await approveAdoption(id);

      // Update status immediately
      setAdoptions(
        (currentAdoptions) =>
          currentAdoptions.map(
            (adoption) =>
              adoption._id === id
                ? {
                    ...adoption,
                    status: "approved",
                  }
                : adoption
          )
      );

      alert(
        "Adoption request approved successfully."
      );
    } catch (error: any) {
      console.error(
        "Approve Error:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to approve adoption request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // REJECT HANDLER
  // =====================================================

  const handleReject = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to reject this adoption request?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      await rejectAdoption(id);

      // Update status immediately
      setAdoptions(
        (currentAdoptions) =>
          currentAdoptions.map(
            (adoption) =>
              adoption._id === id
                ? {
                    ...adoption,
                    status: "rejected",
                  }
                : adoption
          )
      );

      alert(
        "Adoption request rejected successfully."
      );
    } catch (error: any) {
      console.error(
        "Reject Error:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to reject adoption request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold">
          Loading shelter dashboard...
        </h2>
      </div>
    );
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const pendingCount =
    adoptions.filter(
      (item) =>
        item.status === "pending"
    ).length;

  const approvedCount =
    adoptions.filter(
      (item) =>
        item.status === "approved"
    ).length;

  const rejectedCount =
    adoptions.filter(
      (item) =>
        item.status === "rejected"
    ).length;

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold">
                🏠 Shelter Dashboard
              </h1>

              <p className="text-gray-600 mt-2">
                Review and manage adoption
                requests for your shelter.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  navigate("/pets")
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                🐾 View Pets
              </button>

              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            ROLE INFORMATION
        ================================================== */}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">

          <h2 className="text-lg font-bold text-blue-800">
            🏠 Shelter Responsibility
          </h2>

          <p className="text-blue-700 mt-2">
            Your shelter receives adoption
            requests for pets assigned to your
            shelter. You are responsible for
            reviewing each request and approving
            or rejecting it.
          </p>

        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          {/* TOTAL */}

          <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500">
              Total Requests
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
              {pendingCount}
            </h2>

          </div>

          {/* APPROVED */}

          <div className="bg-green-50 rounded-xl shadow p-5">

            <p className="text-green-700">
              Approved
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-1">
              {approvedCount}
            </h2>

          </div>

          {/* REJECTED */}

          <div className="bg-red-50 rounded-xl shadow p-5">

            <p className="text-red-700">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-700 mt-1">
              {rejectedCount}
            </h2>

          </div>

        </div>

        {/* =================================================
            ADOPTION REQUESTS
        ================================================== */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-2">
            📋 Adoption Requests
          </h2>

          <p className="text-gray-500 mb-6">
            These requests belong to pets
            assigned to your shelter.
          </p>

          {adoptions.length === 0 ? (

            <div className="text-center py-12">

              <div className="text-5xl mb-4">
                📭
              </div>

              <p className="text-gray-500 text-lg">
                No adoption requests found.
              </p>

              <p className="text-gray-400 mt-2">
                New requests will appear here
                when an adopter applies for one
                of your pets.
              </p>

            </div>

          ) : (

            <div className="grid gap-6">

              {adoptions.map(
                (adoption) => (

                  <div
                    key={adoption._id}
                    className="border rounded-xl p-6 hover:shadow-md transition"
                  >

                    {/* ==========================================
                        PET INFORMATION + STATUS
                    =========================================== */}

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                      <div className="flex gap-4">

                        {/* PET IMAGE */}

                        {adoption.petId?.image && (
                          <img
                            src={
                              adoption
                                .petId
                                .image
                            }
                            alt={
                              adoption
                                .petId
                                .name
                            }
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                        )}

                        {/* PET DETAILS */}

                        <div>

                          <h3 className="text-xl font-bold">
                            🐾{" "}
                            {adoption
                              .petId
                              ?.name ||
                              adoption.petName}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            Breed:{" "}
                            {adoption
                              .petId
                              ?.breed ||
                              "N/A"}
                          </p>

                          <p className="text-gray-500 text-sm">
                            Age:{" "}
                            {adoption
                              .petId
                              ?.age ||
                              "N/A"}
                          </p>

                        </div>

                      </div>

                      {/* STATUS */}

                      <span
                        className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-semibold ${
                          adoption.status ===
                          "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : adoption.status ===
                              "approved"
                            ? "bg-green-100 text-green-700"
                            : adoption.status ===
                              "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {adoption.status.toUpperCase()}
                      </span>

                    </div>

                    {/* ==========================================
                        REQUEST INFORMATION
                    =========================================== */}

                    <div className="grid md:grid-cols-2 gap-5 mt-6">

                      {/* APPLICANT */}

                      <div>

                        <p className="text-sm text-gray-500">
                          Applicant
                        </p>

                        <p className="font-semibold">
                          {adoption
                            .userId
                            ?.name ||
                            "N/A"}
                        </p>

                      </div>

                      {/* EMAIL */}

                      <div>

                        <p className="text-sm text-gray-500">
                          Email
                        </p>

                        <p className="font-medium break-all">
                          {adoption.email}
                        </p>

                      </div>

                      {/* PHONE */}

                      <div>

                        <p className="text-sm text-gray-500">
                          Phone
                        </p>

                        <p className="font-medium">
                          {adoption.phone}
                        </p>

                      </div>

                      {/* OCCUPATION */}

                      <div>

                        <p className="text-sm text-gray-500">
                          Occupation
                        </p>

                        <p className="font-medium">
                          {adoption.occupation}
                        </p>

                      </div>

                      {/* SUBMITTED */}

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

                      {/* REQUEST ID */}

                      <div>

                        <p className="text-sm text-gray-500">
                          Request ID
                        </p>

                        <p className="font-medium text-sm break-all">
                          {adoption._id}
                        </p>

                      </div>

                    </div>

                    {/* ==========================================
                        ADDRESS
                    =========================================== */}

                    <div className="mt-5">

                      <p className="text-sm text-gray-500">
                        Address
                      </p>

                      <p className="font-medium">
                        {adoption.address}
                      </p>

                    </div>

                    {/* ==========================================
                        REASON
                    =========================================== */}

                    <div className="mt-5">

                      <p className="text-sm text-gray-500">
                        Reason for Adoption
                      </p>

                      <p className="font-medium">
                        {adoption.reason}
                      </p>

                    </div>

                    {/* ==========================================
                        ACTION BUTTONS
                    =========================================== */}

                    {adoption.status ===
                      "pending" && (

                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t">

                        {/* APPROVE */}

                        <button
                          onClick={() =>
                            handleApprove(
                              adoption._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            adoption._id
                          }
                          className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          {actionLoading ===
                          adoption._id
                            ? "Processing..."
                            : "✓ Approve Adoption"}
                        </button>

                        {/* REJECT */}

                        <button
                          onClick={() =>
                            handleReject(
                              adoption._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            adoption._id
                          }
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          {actionLoading ===
                          adoption._id
                            ? "Processing..."
                            : "✕ Reject Adoption"}
                        </button>

                      </div>

                    )}

                    {/* ==========================================
                        COMPLETED MESSAGE
                    =========================================== */}

                    {adoption.status ===
                      "approved" && (

                      <div className="mt-6 pt-5 border-t">

                        <p className="text-green-700 font-semibold">
                          ✅ This adoption request
                          has been approved.
                        </p>

                      </div>

                    )}

                    {adoption.status ===
                      "rejected" && (

                      <div className="mt-6 pt-5 border-t">

                        <p className="text-red-700 font-semibold">
                          ❌ This adoption request
                          has been rejected.
                        </p>

                      </div>

                    )}

                    {adoption.status ===
                      "cancelled" && (

                      <div className="mt-6 pt-5 border-t">

                        <p className="text-gray-600 font-semibold">
                          This adoption request was
                          cancelled by the adopter.
                        </p>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ShelterDashboard;