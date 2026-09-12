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

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  description?: string;
};

function AdminDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  const [loading, setLoading] = useState(true);
  const [petLoading, setPetLoading] = useState(false);

  const [error, setError] = useState("");
  const [petMessage, setPetMessage] = useState("");

  const [actionLoading, setActionLoading] = useState("");

  // =====================================================
  // ADD PET FORM
  // =====================================================

  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    age: "",
    image: "",
    description: "",
  });

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // GET ALL ADOPTIONS
  // =====================================================

  const getAllAdoptions = async () => {
    const token = getToken();

    const response = await api.get("/admin/adoptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  // =====================================================
  // GET ALL PETS
  // =====================================================

  const getAllPets = async () => {
    const response = await api.get("/pets");

    return response.data;
  };

  // =====================================================
  // APPROVE ADOPTION
  // =====================================================

  const approveAdoption = async (id: string) => {
    const token = getToken();

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
    const token = getToken();

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
  // ADD PET
  // =====================================================

  const handleAddPet = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setPetLoading(true);
      setPetMessage("");

      const token = getToken();

      await api.post("/pets", petForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPetMessage("✅ Pet added successfully!");

      // Clear form
      setPetForm({
        name: "",
        breed: "",
        age: "",
        image: "",
        description: "",
      });

      // Refresh pet list
      const updatedPets = await getAllPets();
      setPets(updatedPets);
    } catch (error: any) {
      console.error("Add Pet Error:", error);

      setPetMessage(
        error.response?.data?.message ||
          "❌ Failed to add pet."
      );
    } finally {
      setPetLoading(false);
    }
  };

  // =====================================================
  // DELETE PET
  // =====================================================

  const handleDeletePet = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setPetMessage("");

      const token = getToken();

      await api.delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove pet immediately from UI
      setPets((currentPets) =>
        currentPets.filter(
          (pet) => pet._id !== id
        )
      );

      setPetMessage(
        `✅ ${name} deleted successfully.`
      );
    } catch (error: any) {
      console.error("Delete Pet Error:", error);

      setPetMessage(
        error.response?.data?.message ||
          "❌ Failed to delete pet."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // LOAD ADMIN DATA
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // No login
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    // Check admin
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

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [adoptionData, petData] =
          await Promise.all([
            getAllAdoptions(),
            getAllPets(),
          ]);

        setAdoptions(
          adoptionData.adoptions || []
        );

        setPets(petData || []);
      } catch (error: any) {
        console.error(
          "Admin Dashboard Error:",
          error
        );

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
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // =====================================================
  // APPROVE
  // =====================================================

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

      alert(
        "Adoption request approved successfully."
      );
    } catch (error: any) {
      console.error("Approve Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to approve adoption request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

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

      alert(
        "Adoption request rejected successfully."
      );
    } catch (error: any) {
      console.error("Reject Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject adoption request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold">
          Loading admin dashboard...
        </h2>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold">
                🛠️ Admin Dashboard
              </h1>

              <p className="text-gray-600 mt-2">
                Manage pets and adoption requests.
              </p>

            </div>

            <button
              onClick={() => navigate("/pets")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              🐾 View Pets
            </button>

          </div>

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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

          <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500">
              Pets
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {pets.length}
            </h2>

          </div>

          <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500">
              Requests
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {adoptions.length}
            </h2>

          </div>

          <div className="bg-yellow-50 rounded-xl shadow p-5">

            <p className="text-yellow-700">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-700 mt-1">
              {
                adoptions.filter(
                  (item) =>
                    item.status === "pending"
                ).length
              }
            </h2>

          </div>

          <div className="bg-green-50 rounded-xl shadow p-5">

            <p className="text-green-700">
              Approved
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-1">
              {
                adoptions.filter(
                  (item) =>
                    item.status === "approved"
                ).length
              }
            </h2>

          </div>

          <div className="bg-red-50 rounded-xl shadow p-5">

            <p className="text-red-700">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-700 mt-1">
              {
                adoptions.filter(
                  (item) =>
                    item.status === "rejected"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* ========================================= */}
        {/* ADD NEW PET */}
        {/* ========================================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            ➕ Add New Pet
          </h2>

          <form
            onSubmit={handleAddPet}
            className="grid md:grid-cols-2 gap-5"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Pet Name
              </label>

              <input
                type="text"
                value={petForm.name}
                onChange={(e) =>
                  setPetForm({
                    ...petForm,
                    name: e.target.value,
                  })
                }
                placeholder="Example: Shiro"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BREED */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Breed
              </label>

              <input
                type="text"
                value={petForm.breed}
                onChange={(e) =>
                  setPetForm({
                    ...petForm,
                    breed: e.target.value,
                  })
                }
                placeholder="Example: Great Dane"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* AGE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Age
              </label>

              <input
                type="text"
                value={petForm.age}
                onChange={(e) =>
                  setPetForm({
                    ...petForm,
                    age: e.target.value,
                  })
                }
                placeholder="Example: 8 Years"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* IMAGE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Image URL
              </label>

              <input
                type="url"
                value={petForm.image}
                onChange={(e) =>
                  setPetForm({
                    ...petForm,
                    image: e.target.value,
                  })
                }
                placeholder="https://example.com/dog.jpg"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold mb-2">
                Description
              </label>

              <textarea
                value={petForm.description}
                onChange={(e) =>
                  setPetForm({
                    ...petForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the pet..."
                rows={3}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* MESSAGE */}

            {petMessage && (
              <div className="md:col-span-2 bg-gray-100 border rounded-lg p-3">
                {petMessage}
              </div>
            )}

            {/* BUTTON */}

            <div className="md:col-span-2">

              <button
                type="submit"
                disabled={petLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                {petLoading
                  ? "Adding Pet..."
                  : "➕ Add Pet"}
              </button>

            </div>

          </form>

        </div>

        {/* ========================================= */}
        {/* PET MANAGEMENT */}
        {/* ========================================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

            <h2 className="text-2xl font-bold">
              🐾 Manage Pets
            </h2>

            <span className="text-gray-500">
              {pets.length} pet(s)
            </span>

          </div>

          {pets.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500">
                No pets available.
              </p>

            </div>

          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {pets.map((pet) => (

                <div
                  key={pet._id}
                  className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >

                  {/* IMAGE */}

                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  {/* CONTENT */}

                  <div className="p-5">

                    <h3 className="text-xl font-bold">
                      🐾 {pet.name}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      {pet.breed}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      Age: {pet.age}
                    </p>

                    {pet.description && (
                      <p className="text-gray-600 text-sm mt-3">
                        {pet.description}
                      </p>
                    )}

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDeletePet(
                          pet._id,
                          pet.name
                        )
                      }
                      disabled={
                        actionLoading === pet._id
                      }
                      className="w-full mt-5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      {actionLoading === pet._id
                        ? "Deleting..."
                        : "🗑️ Delete Pet"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ========================================= */}
        {/* ALL ADOPTION REQUESTS */}
        {/* ========================================= */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">
            📋 All Adoption Requests
          </h2>

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

                  {/* PET + STATUS */}

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

                  {/* APPLICANT */}

                  <div className="grid md:grid-cols-2 gap-5 mt-6">

                    <div>

                      <p className="text-sm text-gray-500">
                        Applicant
                      </p>

                      <p className="font-semibold">
                        {adoption.userId?.name ||
                          "N/A"}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Email
                      </p>

                      <p className="font-medium break-all">
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

                  {/* ADDRESS */}

                  <div className="mt-5">

                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="font-medium">
                      {adoption.address}
                    </p>

                  </div>

                  {/* REASON */}

                  <div className="mt-5">

                    <p className="text-sm text-gray-500">
                      Reason for Adoption
                    </p>

                    <p className="font-medium">
                      {adoption.reason}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  {adoption.status ===
                    "pending" && (

                    <div className="flex gap-3 mt-6 pt-5 border-t">

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
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-2 rounded-lg font-semibold transition"
                      >
                        {actionLoading ===
                        adoption._id
                          ? "Processing..."
                          : "✓ Approve"}
                      </button>

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
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-2 rounded-lg font-semibold transition"
                      >
                        {actionLoading ===
                        adoption._id
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