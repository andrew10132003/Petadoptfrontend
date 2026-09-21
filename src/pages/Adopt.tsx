import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createAdoption } from "../api/adoptionService";

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  description?: string;
};

type FormData = {
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
};

function Adopt() {
  const location = useLocation();
  const navigate = useNavigate();

  // Pet is passed from PetDetails.tsx
  const pet = location.state?.pet as Pet | undefined;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    address: "",
    occupation: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If no pet was selected
  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Pet Not Found
          </h1>

          <p className="text-gray-600 mb-6">
            Please select a pet before applying for adoption.
          </p>

          <Link
            to="/pets"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Pets
          </Link>
        </div>
      </div>
    );
  }

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Submit adoption request
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before submitting an adoption request.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Send adoption request to backend
      await createAdoption({
        petId: pet._id,
        petName: pet.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        occupation: formData.occupation,
        reason: formData.reason,
      });

      // Success message
      alert(
        `Adoption request for ${pet.name} submitted successfully! ❤️`
      );

      // Go to adopter dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Adoption submission error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit adoption request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-5">
      <div className="max-w-4xl mx-auto">

        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Adopt {pet.name} ❤️
          </h1>

          <p className="text-gray-600 mt-3">
            Fill in the form below to submit your adoption request.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">

          {/* Pet Image */}
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-80 md:h-96 object-cover rounded-xl mb-8"
          />

          {/* Pet Information */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {pet.name}
            </h2>

            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Breed:</strong> {pet.breed}
              </p>

              <p>
                <strong>Age:</strong> {pet.age}
              </p>
            </div>

            {pet.description && (
              <p className="text-gray-600 mt-4 leading-7">
                {pet.description}
              </p>
            )}
          </div>

          <hr className="mb-8" />

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Adoption Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-800 font-semibold mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-800 font-semibold mb-2"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-gray-800 font-semibold mb-2"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={4}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Occupation */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-gray-800 font-semibold mb-2"
              >
                Occupation
              </label>

              <input
                id="occupation"
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter your occupation"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="block text-gray-800 font-semibold mb-2"
              >
                Reason for Adoption
              </label>

              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why do you want to adopt this pet?"
                rows={5}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-4 rounded-lg font-semibold text-lg transition"
            >
              {loading
                ? "Submitting..."
                : "Submit Adoption Request ❤️"}
            </button>

          </form>

          {/* Back to Pet Details */}
          <div className="text-center mt-6">
            <Link
              to={`/pets/${pet._id}`}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Pet Details
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Adopt;