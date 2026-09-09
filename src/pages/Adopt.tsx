import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { submitAdoption } from "../api/adoptionService";

function Adopt() {
  const location = useLocation();
  const navigate = useNavigate();

  const pet = location.state?.pet;

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    occupation: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Pet Not Found
          </h1>

          <Link
            to="/pets"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Pets
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before submitting an adoption request.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await submitAdoption({
        petId: pet._id || pet.id,
        petName: pet.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        occupation: formData.occupation,
        reason: formData.reason,
      });

      alert("Adoption Request Submitted Successfully ❤️");

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Adoption submission error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit adoption request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-5">
      <h1 className="text-4xl font-bold text-center mb-10">
        Adopt {pet.name} ❤️
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-8">

        {/* Pet Image */}
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-80 object-cover rounded-xl mb-6"
        />

        {/* Pet Information */}
        <h2 className="text-3xl font-bold mb-3">
          {pet.name}
        </h2>

        <p className="text-gray-600 mb-2">
          Breed: {pet.breed}
        </p>

        <p className="text-gray-600 mb-6">
          Age: {pet.age}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Adoption Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
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
            <label className="block font-semibold mb-2">
              Phone
            </label>

            <input
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
            <label className="block font-semibold mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              rows={3}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block font-semibold mb-2">
              Occupation
            </label>

            <input
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
            <label className="block font-semibold mb-2">
              Reason for Adoption
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Why do you want to adopt this pet?"
              rows={5}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-4 rounded-lg font-semibold"
          >
            {loading
              ? "Submitting..."
              : "Submit Adoption Request ❤️"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Adopt;