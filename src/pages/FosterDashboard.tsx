import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  applyToFoster,
  getMyFosterApplications,
} from "../api/fosterService";

interface Pet {
  _id: string;
  name: string;
  breed?: string;
  age?: string | number;
  size?: string;
  location?: string;
}

interface InformationRequest {
  _id?: string;
  message: string;
  response?: string;
  requestedAt?: string;
  respondedAt?: string | null;
}

interface FosterApplication {
  _id: string;
  petName: string;
  status: string;
  createdAt?: string;
  petId?: Pet | string;
  informationRequests?: InformationRequest[];
}

interface FosterForm {
  petId: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  availability: string;
  reason: string;
}

function FosterDashboard() {
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<FosterApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [respondingTo, setRespondingTo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<FosterForm>({
    petId: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    availability: "",
    reason: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== "foster") {
        navigate("/dashboard");
        return;
      }

      if (user.email) {
        setForm((previous) => ({
          ...previous,
          email: user.email,
        }));
      }
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const [petResponse, applicationData] = await Promise.all([
        axios.get("http://localhost:5000/api/pets", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        getMyFosterApplications(),
      ]);

      const petData = petResponse.data;
      const petList: Pet[] = Array.isArray(petData)
        ? petData
        : Array.isArray(petData.pets)
          ? petData.pets
          : Array.isArray(petData.data)
            ? petData.data
            : [];

      setPets(petList);

      setApplications(
        Array.isArray(applicationData.applications)
          ? applicationData.applications
          : []
      );
    } catch (err) {
      console.error("Failed to load foster dashboard:", err);

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Your session may have expired. Please log in again.");
      } else {
        setError(
          "Unable to load dashboard data. Please check that your backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) return;

    try {
      if (JSON.parse(userData).role === "foster") {
        void loadDashboard();
      }
    } catch {
      // The role-checking effect handles invalid user data.
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await applyToFoster(form);

      setSuccess(
        result.message || "Foster application submitted successfully."
      );

      setForm((previous) => ({
        ...previous,
        petId: "",
        phone: "",
        address: "",
        experience: "",
        availability: "",
        reason: "",
      }));

      await loadDashboard();
    } catch (err) {
      console.error("Foster application failed:", err);

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Unable to submit your application."
          : "Unable to submit your application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Respond to an information request sent by the shelter.
  const handleRespondToInformationRequest = async (
    applicationId: string,
    requestId: string
  ) => {
    const responseText = window.prompt(
      "Enter your response to the shelter's information request:"
    );

    if (!responseText?.trim()) return;

    setError("");
    setSuccess("");
    setRespondingTo(`${applicationId}-${requestId}`);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/fosters/my-applications/${applicationId}/information-requests/${requestId}/respond`,
        { response: responseText.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Your response was sent to the shelter.");
      await loadDashboard();
    } catch (err) {
      console.error("Failed to respond to information request:", err);

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              "Unable to send your response. Please try again."
          : "Unable to send your response. Please try again."
      );
    } finally {
      setRespondingTo("");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🐾</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Foster Dashboard
              </h1>
              <p className="mt-1 text-gray-500">
                Welcome to the Pet Adoption Platform
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-2 text-xl font-bold text-blue-800">
            🏠 Foster Role
          </h2>
          <p className="text-blue-700">
            Provide temporary care and a safe home for pets while they wait
            for permanent adoption.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            🐶 Apply to Foster a Pet
          </h2>
          <p className="mb-6 text-gray-500">
            Submit an application to provide temporary care for a pet.
          </p>

          {loading ? (
            <p className="text-gray-500">Loading available pets...</p>
          ) : pets.length === 0 ? (
            <p className="text-gray-500">
              No pets are available to display right now.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium" htmlFor="petId">
                  Select Pet
                </label>
                <select
                  id="petId"
                  name="petId"
                  value={form.petId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Choose a pet</option>
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} {pet.breed ? `- ${pet.breed}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label
                  className="mb-1 block font-medium"
                  htmlFor="experience"
                >
                  Pet Care Experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border p-3"
                  placeholder="Describe your experience caring for pets."
                />
              </div>

              <div>
                <label
                  className="mb-1 block font-medium"
                  htmlFor="availability"
                >
                  Availability
                </label>
                <input
                  id="availability"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                  placeholder="For example, weekdays and weekends"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium" htmlFor="reason">
                  Why would you like to foster this pet?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Foster Application"}
              </button>
            </form>
          )}
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            📋 My Foster Applications
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-500">
              You haven't submitted any foster applications yet.
            </p>
          ) : (
            <div className="space-y-5">
              {applications.map((application) => (
                <article
                  key={application._id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {application.petName || "Pet"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Application ID: {application._id}
                      </p>
                      {application.createdAt && (
                        <p className="text-sm text-gray-500">
                          Submitted:{" "}
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <span className="inline-block w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold capitalize text-blue-700">
                      {application.status}
                    </span>
                  </div>

                  {/* Shelter information requests */}
                  <div className="mt-5 border-t pt-4">
                    <h4 className="mb-3 font-bold text-gray-800">
                      Messages from Shelter
                    </h4>

                    {!application.informationRequests?.length ? (
                      <p className="text-sm text-gray-500">
                        No information requests for this application.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {application.informationRequests.map(
                          (request, index) => {
                            const requestId = request._id;
                            const requestKey =
                              requestId || `request-${index}`;
                            const busy =
                              !!requestId &&
                              respondingTo ===
                                `${application._id}-${requestId}`;

                            return (
                              <div
                                key={requestKey}
                                className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                              >
                                <p className="font-semibold text-amber-900">
                                  Information requested by the shelter
                                </p>

                                {request.requestedAt && (
                                  <p className="mt-1 text-xs text-amber-800">
                                    {new Date(
                                      request.requestedAt
                                    ).toLocaleString()}
                                  </p>
                                )}

                                <p className="mt-3 whitespace-pre-wrap text-sm text-gray-800">
                                  {request.message}
                                </p>

                                {request.response?.trim() ? (
                                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                                    <p className="font-semibold text-green-800">
                                      Your response
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm text-green-900">
                                      {request.response}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="mt-4">
                                    {requestId ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRespondToInformationRequest(
                                            application._id,
                                            requestId
                                          )
                                        }
                                        disabled={busy || !!respondingTo}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {busy
                                          ? "Sending..."
                                          : "Reply to Shelter"}
                                      </button>
                                    ) : (
                                      <p className="text-sm text-gray-500">
                                        A reply cannot be sent because this
                                        request has no ID.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-lg font-bold text-yellow-800">
            ℹ️ Foster Access
          </h2>
          <p className="mt-2 text-yellow-700">
            Foster applications are reviewed by shelters. Normal adoption
            applications remain a separate workflow for adopter accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FosterDashboard;