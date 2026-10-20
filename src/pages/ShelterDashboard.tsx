import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

type ShelterPet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  size?: string;
  color?: string;
  location?: string;
  description?: string;
  medicalHistory?: MedicalHistoryRecord[];
  medicalReport?: { url: string; publicId?: string; fileName?: string };
  shelterId?: string | { _id: string };
};

type MedicalHistoryRecord = {
  date: string;
  condition: string;
  treatment: string;
  vaccination: string;
  notes: string;
};

type Adoption = {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  petId?: ShelterPet;
  petName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
};

type PetForm = {
  name: string;
  breed: string;
  age: string;
  image: string;
  size: string;
  color: string;
  location: string;
  description: string;
  medicalHistory: MedicalHistoryRecord[];
};

const emptyMedicalHistoryRecord: MedicalHistoryRecord = {
  date: "",
  condition: "",
  treatment: "",
  vaccination: "",
  notes: "",
};

const initialPetForm: PetForm = {
  name: "",
  breed: "",
  age: "",
  image: "",
  size: "",
  color: "",
  location: "",
  description: "",
  medicalHistory: [{ ...emptyMedicalHistoryRecord }],
};

function ShelterDashboard() {
  const navigate = useNavigate();

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [pets, setPets] = useState<ShelterPet[]>([]);

  const [loading, setLoading] = useState(true);
  const [petLoading, setPetLoading] = useState(false);
  const [error, setError] = useState("");
  const [petError, setPetError] = useState("");
  const [petSuccess, setPetSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petForm, setPetForm] = useState<PetForm>(initialPetForm);
  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);

  const getToken = () => localStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const getShelterAdoptions = async () => {
    const response = await api.get(
      "/adoptions/shelter",
      getAuthConfig()
    );

    return response.data;
  };

  const getShelterPets = useCallback(async () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      throw new Error("Please log in again.");
    }

    const user = JSON.parse(userData);
    const shelterId = String(user._id || user.id || "");

    const response = await api.get("/pets", getAuthConfig());

    const petList: ShelterPet[] = Array.isArray(response.data)
      ? response.data
      : response.data?.pets || [];

    const ownPets = petList.filter((pet) => {
      const petShelterId =
        typeof pet.shelterId === "object"
          ? pet.shelterId?._id
          : pet.shelterId;

      return petShelterId && String(petShelterId) === shelterId;
    });

    setPets(ownPets);
  }, []);

  useEffect(() => {
    const token = getToken();
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== "shelter") {
        navigate("/dashboard");
        return;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [adoptionResult] = await Promise.all([
          getShelterAdoptions(),
          getShelterPets(),
        ]);

        setAdoptions(adoptionResult.adoptions || []);
      } catch (err: any) {
        console.error("Shelter dashboard error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load shelter dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, getShelterPets]);

  // Open the form with the selected pet's existing details.
  const handleEditPet = (pet: ShelterPet) => {
    setEditingPetId(pet._id);

    setPetForm({
      name: pet.name || "",
      breed: pet.breed || "",
      age: pet.age || "",
      image: pet.image || "",
      size: pet.size || "",
      color: pet.color || "",
      location: pet.location || "",
      description: pet.description || "",
      medicalHistory: pet.medicalHistory?.length
        ? pet.medicalHistory.map((record) => ({
            date: record.date ? String(record.date).slice(0, 10) : "",
            condition: record.condition || "",
            treatment: record.treatment || "",
            vaccination: record.vaccination || "",
            notes: record.notes || "",
          }))
        : [{ ...emptyMedicalHistoryRecord }],
    });
    setMedicalReportFile(null);

    setPetError("");
    setPetSuccess("");
    setShowPetForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Create a new listing or update an existing listing.
  const handleAddPet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPetError("");
    setPetSuccess("");

    const isEditing = Boolean(editingPetId);

    try {
      setPetLoading(true);

      const payload = new FormData();
      payload.append("name", petForm.name.trim());
      payload.append("breed", petForm.breed.trim());
      payload.append("age", petForm.age.trim());
      payload.append("image", petForm.image.trim());
      payload.append("size", petForm.size);
      payload.append("color", petForm.color.trim());
      payload.append("location", petForm.location.trim());
      payload.append("description", petForm.description.trim());
      payload.append(
        "medicalHistory",
        JSON.stringify(
          petForm.medicalHistory.filter((record) =>
            Object.values(record).some((value) => value.trim() !== "")
          )
        )
      );
      if (medicalReportFile) {
        payload.append("medicalReport", medicalReportFile);
      }

      const authHeaders = getAuthConfig().headers;
      if (isEditing && editingPetId) {
        await api.put(`/pets/${editingPetId}`, payload, {
          headers: authHeaders,
        });
      } else {
        await api.post("/pets", payload, {
          headers: authHeaders,
        });
      }

      await getShelterPets();

      setPetForm(initialPetForm);
      setMedicalReportFile(null);
      setEditingPetId(null);
      setShowPetForm(false);

      setPetSuccess(
        isEditing
          ? "Pet listing updated successfully."
          : "Pet listing created successfully."
      );
    } catch (err: any) {
      console.error("Save pet error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setPetError(
        err.response?.data?.message ||
          "Unable to save pet listing. Please try again."
      );
    } finally {
      setPetLoading(false);
    }
  };

  // Cancel adding or editing a listing.
  const handleCancelPetForm = () => {
    setShowPetForm(false);
    setEditingPetId(null);
    setPetForm(initialPetForm);
    setMedicalReportFile(null);
    setPetError("");
  };

  // Delete a pet listing.
  const handleDeletePet = async (pet: ShelterPet) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${pet.name}?`
    );

    if (!confirmed) return;

    setPetError("");
    setPetSuccess("");

    try {
      setPetLoading(true);

      await api.delete(`/pets/${pet._id}`, getAuthConfig());

      setPets((current) =>
        current.filter((item) => item._id !== pet._id)
      );

      if (editingPetId === pet._id) {
        handleCancelPetForm();
      }

      setPetSuccess(`${pet.name} was deleted successfully.`);
    } catch (err: any) {
      console.error("Delete pet error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setPetError(
        err.response?.data?.message ||
          "Unable to delete pet. Please try again."
      );
    } finally {
      setPetLoading(false);
    }
  };

  // Approve an adoption request.
  const handleApprove = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to approve this adoption request?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(id);

      await api.patch(
        `/adoptions/shelter/${id}/approve`,
        {},
        getAuthConfig()
      );

      setAdoptions((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, status: "approved" }
            : item
        )
      );

      alert("Adoption request approved successfully.");
    } catch (err: any) {
      console.error("Approve error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to approve adoption request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // Reject an adoption request.
  const handleReject = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this adoption request?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(id);

      await api.patch(
        `/adoptions/shelter/${id}/reject`,
        {},
        getAuthConfig()
      );

      setAdoptions((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, status: "rejected" }
            : item
        )
      );

      alert("Adoption request rejected successfully.");
    } catch (err: any) {
      console.error("Reject error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to reject adoption request."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updatePetForm = (field: keyof PetForm, value: string) => {
    if (field === "medicalHistory") return;
    setPetForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateMedicalHistory = (
    index: number,
    field: keyof MedicalHistoryRecord,
    value: string
  ) => {
    setPetForm((current) => ({
      ...current,
      medicalHistory: current.medicalHistory.map((record, recordIndex) =>
        recordIndex === index ? { ...record, [field]: value } : record
      ),
    }));
  };

  const addMedicalHistoryRecord = () => {
    setPetForm((current) => ({
      ...current,
      medicalHistory: [...current.medicalHistory, { ...emptyMedicalHistoryRecord }],
    }));
  };

  const removeMedicalHistoryRecord = (index: number) => {
    setPetForm((current) => ({
      ...current,
      medicalHistory: current.medicalHistory.length === 1
        ? [{ ...emptyMedicalHistoryRecord }]
        : current.medicalHistory.filter((_, recordIndex) => recordIndex !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading shelter dashboard...
        </h2>
      </div>
    );
  }

  const pendingCount = adoptions.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = adoptions.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = adoptions.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                🏠 Shelter Dashboard
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your pet listings and adoption requests.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/pets")}
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                🐾 View Pets
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showPetForm) {
                    handleCancelPetForm();
                  } else {
                    setShowPetForm(true);
                    setEditingPetId(null);
                    setPetForm(initialPetForm);
                    setMedicalReportFile(null);
                    setPetError("");
                    setPetSuccess("");
                  }
                }}
                className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
              >
                {showPetForm
                  ? "Cancel"
                  : "+ Add Pet"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Shelter responsibility */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-lg font-bold text-blue-800">
            🏠 Shelter Responsibility
          </h2>

          <p className="mt-2 text-blue-700">
            Add and manage your shelter's pet listings. Review
            adoption requests for pets assigned to your shelter,
            then approve or reject pending requests.
          </p>
        </div>

        {/* Pet form */}
        {showPetForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-2xl font-bold">
              {editingPetId
                ? "✏️ Edit Pet Details"
                : "🐾 Add a New Pet"}
            </h2>

            <form onSubmit={handleAddPet}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">
                    Pet Name *
                  </label>
                  <input
                    required
                    value={petForm.name}
                    onChange={(event) =>
                      updatePetForm("name", event.target.value)
                    }
                    placeholder="e.g. Buddy"
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Breed *
                  </label>
                  <input
                    required
                    value={petForm.breed}
                    onChange={(event) =>
                      updatePetForm("breed", event.target.value)
                    }
                    placeholder="e.g. Golden Retriever"
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Age *
                  </label>
                  <input
                    required
                    value={petForm.age}
                    onChange={(event) =>
                      updatePetForm("age", event.target.value)
                    }
                    placeholder="e.g. 2 years"
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Image URL *
                  </label>
                  <input
                    required
                    type="url"
                    value={petForm.image}
                    onChange={(event) =>
                      updatePetForm("image", event.target.value)
                    }
                    placeholder="https://example.com/pet.jpg"
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Size
                  </label>
                  <select
                    value={petForm.size}
                    onChange={(event) =>
                      updatePetForm("size", event.target.value)
                    }
                    className="w-full rounded-lg border bg-white p-3"
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">
                    Color
                  </label>
                  <input
                    value={petForm.color}
                    onChange={(event) =>
                      updatePetForm("color", event.target.value)
                    }
                    placeholder="e.g. Brown"
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium">
                    Location
                  </label>
                  <input
                    value={petForm.location}
                    onChange={(event) =>
                      updatePetForm("location", event.target.value)
                    }
                    placeholder="e.g. Chennai Animal Shelter"
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={petForm.description}
                    onChange={(event) =>
                      updatePetForm("description", event.target.value)
                    }
                    placeholder="Tell adopters about this pet..."
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Multiple medical-history records */}
                <div className="md:col-span-2 rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">Medical History</h3>
                      <p className="text-sm text-gray-600">Add vaccinations, conditions, and treatments. Leave unused records blank.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addMedicalHistoryRecord}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      + Add Record
                    </button>
                  </div>

                  <div className="space-y-4">
                    {petForm.medicalHistory.map((record, index) => (
                      <div key={index} className="rounded-lg bg-slate-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold">Record {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeMedicalHistoryRecord(index)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="block text-sm font-medium">Date
                            <input type="date" value={record.date} onChange={(event) => updateMedicalHistory(index, "date", event.target.value)} className="mt-1 w-full rounded-lg border bg-white p-3" />
                          </label>
                          <label className="block text-sm font-medium">Condition / Diagnosis
                            <input value={record.condition} onChange={(event) => updateMedicalHistory(index, "condition", event.target.value)} placeholder="e.g. Skin allergy" className="mt-1 w-full rounded-lg border bg-white p-3" />
                          </label>
                          <label className="block text-sm font-medium">Treatment
                            <input value={record.treatment} onChange={(event) => updateMedicalHistory(index, "treatment", event.target.value)} placeholder="e.g. Medication prescribed" className="mt-1 w-full rounded-lg border bg-white p-3" />
                          </label>
                          <label className="block text-sm font-medium">Vaccination
                            <input value={record.vaccination} onChange={(event) => updateMedicalHistory(index, "vaccination", event.target.value)} placeholder="e.g. Rabies vaccine" className="mt-1 w-full rounded-lg border bg-white p-3" />
                          </label>
                          <label className="block text-sm font-medium md:col-span-2">Notes
                            <textarea rows={2} value={record.notes} onChange={(event) => updateMedicalHistory(index, "notes", event.target.value)} placeholder="Additional medical notes" className="mt-1 w-full rounded-lg border bg-white p-3" />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional medical report upload */}
                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium">Medical Report (optional)</label>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(event) => setMedicalReportFile(event.target.files?.[0] || null)}
                    className="w-full rounded-lg border bg-white p-3"
                  />
                  <p className="mt-1 text-sm text-gray-500">Choose one report file, up to 10 MB.</p>
                  {medicalReportFile && (
                    <p className="mt-1 text-sm text-green-700">Selected: {medicalReportFile.name}</p>
                  )}
                  {editingPetId && pets.find((pet) => pet._id === editingPetId)?.medicalReport?.url && (
                    <p className="mt-2 text-sm">
                      Existing report: <a className="text-blue-600 underline" href={pets.find((pet) => pet._id === editingPetId)?.medicalReport?.url} target="_blank" rel="noreferrer">View current report</a>
                    </p>
                  )}
                </div>
              </div>

              {petError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                  {petError}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={petLoading}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {petLoading
                    ? "Saving..."
                    : editingPetId
                      ? "Save Changes"
                      : "Save Pet"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelPetForm}
                  disabled={petLoading}
                  className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-300 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pet success message */}
        {petSuccess && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {petSuccess}
          </div>
        )}

        {/* My Pets */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">🐶 My Pets</h2>
            <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-800">
              {pets.length} listing{pets.length === 1 ? "" : "s"}
            </span>
          </div>

          {pets.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                You haven't added any pets yet.
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowPetForm(true);
                  setEditingPetId(null);
                  setPetForm(initialPetForm);
                  setMedicalReportFile(null);
                }}
                className="mt-4 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
              >
                + Add Your First Pet
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <article
                  key={pet._id}
                  className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="h-56 w-full bg-gray-100 object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold">{pet.name}</h3>
                    <p className="mt-1 text-gray-600">{pet.breed}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Age: {pet.age}
                    </p>

                    {pet.size && (
                      <p className="mt-1 text-sm text-gray-600">
                        Size: {pet.size}
                      </p>
                    )}

                    {pet.color && (
                      <p className="mt-1 text-sm text-gray-600">
                        Color: {pet.color}
                      </p>
                    )}

                    {pet.location && (
                      <p className="mt-1 text-sm text-gray-600">
                        Location: {pet.location}
                      </p>
                    )}

                    {pet.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                        {pet.description}
                      </p>
                    )}

                    {pet.medicalHistory && pet.medicalHistory.some((record) =>
                      Object.values(record).some((value) => String(value || "").trim() !== "")
                    ) && (
                      <div className="mt-4 rounded-lg bg-slate-50 p-3">
                        <h4 className="font-semibold">Medical History</h4>
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                          {pet.medicalHistory.map((record, index) => (
                            <div key={index} className="border-b border-slate-200 pb-2 last:border-0">
                              {record.date && <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>}
                              {record.condition && <p><strong>Condition:</strong> {record.condition}</p>}
                              {record.treatment && <p><strong>Treatment:</strong> {record.treatment}</p>}
                              {record.vaccination && <p><strong>Vaccination:</strong> {record.vaccination}</p>}
                              {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pet.medicalReport?.url && (
                      <p className="mt-3 text-sm">
                        <strong>Medical report:</strong>{" "}
                        <a href={pet.medicalReport.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View report</a>
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleEditPet(pet)}
                      disabled={petLoading}
                      className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      ✏️ Edit Pet
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePet(pet)}
                      disabled={petLoading}
                      className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      🗑️ Delete Pet
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Adoption statistics */}
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-bold">
            📊 Adoption Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
              <p className="text-sm font-medium text-yellow-800">
                Pending Requests
              </p>
              <p className="mt-2 text-3xl font-bold text-yellow-900">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <p className="text-sm font-medium text-green-800">
                Approved Requests
              </p>
              <p className="mt-2 text-3xl font-bold text-green-900">
                {approvedCount}
              </p>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-medium text-red-800">
                Rejected Requests
              </p>
              <p className="mt-2 text-3xl font-bold text-red-900">
                {rejectedCount}
              </p>
            </div>
          </div>
        </section>

        {/* Adoption requests */}
        <section>
          <h2 className="mb-5 text-2xl font-bold">
            📋 Adoption Requests
          </h2>

          {adoptions.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No adoption requests have been received yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {adoptions.map((adoption) => (
                <article
                  key={adoption._id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {adoption.petName ||
                          adoption.petId?.name ||
                          "Pet"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Submitted{" "}
                        {adoption.createdAt
                          ? new Date(adoption.createdAt).toLocaleDateString()
                          : "date unavailable"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                        adoption.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : adoption.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : adoption.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {adoption.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <p>
                      <strong>Applicant:</strong>{" "}
                      {adoption.userId?.name || "Not provided"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {adoption.email || adoption.userId?.email || "Not provided"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {adoption.phone || adoption.userId?.phone || "Not provided"}
                    </p>

                    <p>
                      <strong>Occupation:</strong>{" "}
                      {adoption.occupation || "Not provided"}
                    </p>

                    <p className="sm:col-span-2">
                      <strong>Address:</strong>{" "}
                      {adoption.address || adoption.userId?.address || "Not provided"}
                    </p>

                    <p className="sm:col-span-2 whitespace-pre-wrap">
                      <strong>Reason for adoption:</strong>{" "}
                      {adoption.reason || "Not provided"}
                    </p>
                  </div>

                  {adoption.status === "pending" && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleApprove(adoption._id)}
                        disabled={actionLoading === adoption._id}
                        className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                      >
                        {actionLoading === adoption._id
                          ? "Processing..."
                          : "✓ Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(adoption._id)}
                        disabled={actionLoading === adoption._id}
                        className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        {actionLoading === adoption._id
                          ? "Processing..."
                          : "✕ Reject"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ShelterDashboard;