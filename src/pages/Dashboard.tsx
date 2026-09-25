import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  getMyAdoptions,
  cancelAdoption,
} from "../api/adoptionService";

// =====================================================
// TYPES
// =====================================================

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  description?: string;
};

type Adoption = {
  _id: string;

  userId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
      };

  petId: Pet;

  petName: string;

  shelterId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
      };

  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;

  status:
    | "pending"
    | "cancelled"
    | "approved"
    | "rejected";

  createdAt?: string;
  updatedAt?: string;
};
type User = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
};

// =====================================================
// COMPONENT
// =====================================================

function Dashboard() {
  const navigate = useNavigate();

  // ===================================================
  // STATES
  // ===================================================

  const [user, setUser] =
    useState<User | null>(null);

  const [adoptions, setAdoptions] =
    useState<Adoption[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [cancelLoading, setCancelLoading] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  // ===================================================
  // GET USER
  // ===================================================

  useEffect(() => {
    const userData =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("token");

    // -----------------------------------------------
    // NO LOGIN
    // -----------------------------------------------

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser: User =
        JSON.parse(userData);

      // ---------------------------------------------
      // THIS PAGE IS FOR ADOPTERS
      // ---------------------------------------------

      if (parsedUser.role !== "adopter") {
        if (parsedUser.role === "admin") {
          navigate("/admin-dashboard");
          return;
        }

        if (parsedUser.role === "shelter") {
          navigate("/shelter-dashboard");
          return;
        }

        if (parsedUser.role === "foster") {
          navigate("/foster-dashboard");
          return;
        }

        navigate("/");
        return;
      }

      setUser(parsedUser);

    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  }, [navigate]);

  // ===================================================
  // FETCH ADOPTIONS
  // ===================================================

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await getMyAdoptions();

      console.log(
        "My Adoption Response:",
        response
      );

      // ------------------------------------------------
      // BACKEND RETURNS:
      //
      // {
      //   adoptions: [...]
      // }
      // ------------------------------------------------

      const adoptionData =
        response?.adoptions || [];

      setAdoptions(adoptionData);

    } catch (error: unknown) {

      console.error(
        "Dashboard Error:",
        error
      );

      // -----------------------------------------------
      // AXIOS ERROR
      // -----------------------------------------------

      if (axios.isAxiosError(error)) {

        // ---------------------------------------------
        // TOKEN EXPIRED / INVALID
        // ---------------------------------------------

        if (
          error.response?.status === 401
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

        // ---------------------------------------------
        // FORBIDDEN
        // ---------------------------------------------

        if (
          error.response?.status === 403
        ) {
          setError(
            error.response?.data?.message ||
              "You do not have permission to view these requests."
          );

          return;
        }

        // ---------------------------------------------
        // OTHER SERVER ERROR
        // ---------------------------------------------

        setError(
          error.response?.data?.message ||
            "Unable to load adoption requests."
        );

        return;
      }

      setError(
        "Unable to load adoption requests."
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH AFTER USER IS VERIFIED
  // ===================================================

  useEffect(() => {
    if (user?.role === "adopter") {
      fetchAdoptions();
    }
  }, [user]);

  // ===================================================
  // CANCEL ADOPTION
  // ===================================================

  const handleCancel = async (
    adoptionId: string
  ) => {

    // -----------------------------------------------
    // CONFIRMATION
    // -----------------------------------------------

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this adoption request?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setCancelLoading(adoptionId);

      setError("");

      // ---------------------------------------------
      // API CALL
      // ---------------------------------------------

      const response =
        await cancelAdoption(
          adoptionId
        );

      console.log(
        "Cancel Response:",
        response
      );

      // ---------------------------------------------
      // REFRESH REQUESTS
      // ---------------------------------------------

      await fetchAdoptions();

      window.alert(
        "Adoption request cancelled successfully."
      );

    } catch (error: unknown) {

      console.error(
        "Cancel Error:",
        error
      );

      if (
        axios.isAxiosError(error)
      ) {

        // -------------------------------------------
        // UNAUTHORIZED
        // -------------------------------------------

        if (
          error.response?.status === 401
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

        // -------------------------------------------
        // FORBIDDEN
        // -------------------------------------------

        if (
          error.response?.status === 403
        ) {
          setError(
            error.response?.data?.message ||
              "You cannot cancel this request."
          );

          return;
        }

        // -------------------------------------------
        // BAD REQUEST
        // -------------------------------------------

        if (
          error.response?.status === 400
        ) {
          setError(
            error.response?.data?.message ||
              "This request cannot be cancelled."
          );

          return;
        }

        // -------------------------------------------
        // NOT FOUND
        // -------------------------------------------

        if (
          error.response?.status === 404
        ) {
          setError(
            error.response?.data?.message ||
              "Adoption request was not found."
          );

          return;
        }

        // -------------------------------------------
        // SERVER ERROR
        // -------------------------------------------

        setError(
          error.response?.data?.message ||
            "Unable to cancel adoption request."
        );

        return;
      }

      setError(
        "Unable to cancel adoption request."
      );

    } finally {
      setCancelLoading(null);
    }
  };

  // ===================================================
  // STATUS COLOR
  // ===================================================

  const getStatusStyle = (
    status: Adoption["status"]
  ) => {

    switch (status) {

      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";

      case "approved":
        return "bg-green-100 text-green-800 border-green-300";

      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";

      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-300";

      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // ===================================================
  // STATUS TEXT
  // ===================================================

  const getStatusText = (
    status: Adoption["status"]
  ) => {

    switch (status) {

      case "pending":
        return "Waiting for shelter review";

      case "approved":
        return "Your adoption request has been approved!";

      case "rejected":
        return "Your adoption request was rejected.";

      case "cancelled":
        return "You cancelled this adoption request.";

      default:
        return status;
    }
  };

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (
    date?: string
  ) => {

    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-5xl mb-4">
            🐾
          </div>

          <p className="text-gray-600 text-lg">
            Loading your dashboard...
          </p>

        </div>

      </div>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className=" rounded-2xl shadow-md p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-blue-600 font-semibold mb-1">
                ADOPTER DASHBOARD
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Welcome, {user?.name || "Adopter"}! 🐾
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your pet adoption requests here.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/pets")
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              🐶 Browse Pets
            </button>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-5 mb-8">

            <div className="flex items-start gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <div>

                <p className="font-semibold">
                  Something went wrong
                </p>

                <p className="mt-1">
                  {error}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            SUMMARY
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          {/* TOTAL */}

          <div className=" rounded-2xl shadow-md p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Requests
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {adoptions.length}
                </p>

              </div>

              <div className="text-4xl">
                📋
              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Pending
                </p>

                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {
                    adoptions.filter(
                      (adoption) =>
                        adoption.status ===
                        "pending"
                    ).length
                  }
                </p>

              </div>

              <div className="text-4xl">
                ⏳
              </div>

            </div>

          </div>

          {/* APPROVED */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Approved
                </p>

                <p className="text-3xl font-bold text-green-600 mt-1">
                  {
                    adoptions.filter(
                      (adoption) =>
                        adoption.status ===
                        "approved"
                    ).length
                  }
                </p>

              </div>

              <div className="text-4xl">
                ✅
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            REQUESTS HEADER
        ================================================== */}

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              My Adoption Requests
            </h2>

            <p className="text-gray-500 mt-1">
              Track the status of your applications.
            </p>

          </div>

        </div>

        {/* =================================================
            NO REQUESTS
        ================================================== */}

        {adoptions.length === 0 ? (

          <div className="rounded-2xl shadow-md p-10 text-center">

            <div className="text-6xl mb-5">
              🐶
            </div>

            <h3 className="text-2xl font-bold text-gray-800">
              No Adoption Requests Yet
            </h3>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              You haven't submitted an adoption request
              yet. Browse the available pets and find your
              new companion.
            </p>

            <button
              onClick={() =>
                navigate("/pets")
              }
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              🐾 Browse Available Pets
            </button>

          </div>

        ) : (

          /* =================================================
             REQUEST LIST
          ================================================== */

          <div className="space-y-6">

            {adoptions.map(
              (adoption) => {

                const pet =
                  adoption.petId;

                return (

                  <div
                    key={adoption._id}
                    className="rounded-2xl shadow-md overflow-hidden"
                  >

                    <div className="p-6 md:p-8">

                      {/* =====================================
                          PET HEADER
                      ====================================== */}

                      <div className="flex flex-col md:flex-row gap-6">

                        {/* PET IMAGE */}

                        <div className="w-full md:w-56 h-48 md:h-40 flex-shrink-0">

                          {pet?.image ? (

                            <img
                              src={pet.image}
                              alt={
                                pet.name ||
                                adoption.petName
                              }
                              className="w-full h-full object-cover rounded-xl"
                            />

                          ) : (

                            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-5xl">
                              🐶
                            </div>

                          )}

                        </div>

                        {/* PET INFO */}

                        <div className="flex-1">

                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                            <div>

                              <p className="text-sm text-blue-600 font-semibold">
                                ADOPTION REQUEST
                              </p>

                              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {pet?.name ||
                                  adoption.petName}
                              </h3>

                              <p className="text-gray-500 mt-1">
                                {pet?.breed ||
                                  "Breed not available"}
                              </p>

                            </div>

                            {/* STATUS */}

                            <span
                              className={`inline-flex items-center w-fit px-4 py-2 rounded-full border text-sm font-semibold ${getStatusStyle(
                                adoption.status
                              )}`}
                            >
                              {adoption.status
                                .charAt(0)
                                .toUpperCase() +
                                adoption.status.slice(
                                  1
                                )}
                            </span>

                          </div>

                          {/* PET DETAILS */}

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">

                            <div>

                              <p className="text-xs text-gray-400 uppercase">
                                Age
                              </p>

                              <p className="font-semibold text-gray-700 mt-1">
                                {pet?.age ||
                                  "N/A"}
                              </p>

                            </div>

                            <div>

                              <p className="text-xs text-gray-400 uppercase">
                                Submitted
                              </p>

                              <p className="font-semibold text-gray-700 mt-1">
                                {formatDate(
                                  adoption.createdAt
                                )}
                              </p>

                            </div>

                            <div>

                              <p className="text-xs text-gray-400 uppercase">
                                Request ID
                              </p>

                              <p className="font-semibold text-gray-700 mt-1 break-all">
                                {adoption._id}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* =====================================
                          STATUS MESSAGE
                      ====================================== */}

                      <div
                        className={`mt-6 rounded-xl border p-5 ${getStatusStyle(
                          adoption.status
                        )}`}
                      >

                        <p className="font-semibold">
                          {adoption.status ===
                            "pending" &&
                            "⏳ "}

                          {adoption.status ===
                            "approved" &&
                            "🎉 "}

                          {adoption.status ===
                            "rejected" &&
                            "❌ "}

                          {adoption.status ===
                            "cancelled" &&
                            "ℹ️ "}

                          {getStatusText(
                            adoption.status
                          )}
                        </p>

                        {adoption.status ===
                          "pending" && (

                          <p className="text-sm mt-1">
                            The shelter responsible for
                            this pet will review your
                            application.
                          </p>

                        )}

                        {adoption.status ===
                          "approved" && (

                          <p className="text-sm mt-1">
                            Please contact the shelter for
                            the next steps.
                          </p>

                        )}

                        {adoption.status ===
                          "rejected" && (

                          <p className="text-sm mt-1">
                            You can browse other available
                            pets and submit another request.
                          </p>

                        )}

                      </div>

                      {/* =====================================
                          APPLICANT INFORMATION
                      ====================================== */}

                      <div className="mt-6 border-t pt-6">

                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                          Applicant Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                          <div>

                            <p className="text-sm text-gray-400">
                              Email
                            </p>

                            <p className="font-medium text-gray-700 mt-1 break-all">
                              {adoption.email ||
                                "N/A"}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-gray-400">
                              Phone
                            </p>

                            <p className="font-medium text-gray-700 mt-1">
                              {adoption.phone ||
                                "N/A"}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-gray-400">
                              Occupation
                            </p>

                            <p className="font-medium text-gray-700 mt-1">
                              {adoption.occupation ||
                                "N/A"}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-gray-400">
                              Address
                            </p>

                            <p className="font-medium text-gray-700 mt-1">
                              {adoption.address ||
                                "N/A"}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* =====================================
                          REASON
                      ====================================== */}

                      <div className="mt-6">

                        <p className="text-sm text-gray-400">
                          Reason for Adoption
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mt-2">

                          <p className="text-gray-700">
                            {adoption.reason ||
                              "No reason provided."}
                          </p>

                        </div>

                      </div>

                      {/* =====================================
                          ACTIONS
                      ====================================== */}

                      <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-3">

                        {/* VIEW PET */}

                        {pet?._id && (

                          <button
                            onClick={() =>
                              navigate(
                                `/pets/${pet._id}`
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                          >
                            🐾 View Pet
                          </button>

                        )}

                        {/* CANCEL */}

                        {adoption.status ===
                          "pending" && (

                          <button
                            onClick={() =>
                              handleCancel(
                                adoption._id
                              )
                            }
                            disabled={
                              cancelLoading ===
                              adoption._id
                            }
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-3 rounded-lg font-semibold transition"
                          >
                            {cancelLoading ===
                            adoption._id
                              ? "Cancelling..."
                              : "✕ Cancel Request"}
                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;