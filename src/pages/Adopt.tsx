import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { submitAdoption } from "../api/adoptionService";
function Adopt() {
  const location = useLocation();
  const pet = location.state?.pet;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await submitAdoption({
      petId: pet?._id,
      petName: pet?.name,
      ...form,
    });

    alert("🎉 Adoption Request Submitted Successfully!");

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      reason: "",
    });
  } catch (error) {
    console.error(error);
    alert("Submission failed.");
  }
};
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-4xl font-bold text-center mb-8">
            🐾 Pet Adoption Form
          </h1>

          {pet && (
            <div className="bg-blue-50 rounded-lg p-5 mb-8">
              <h2 className="text-2xl font-bold text-blue-700">
                Adopting: {pet.name}
              </h2>

              <p>
                <strong>Breed:</strong> {pet.breed}
              </p>

              <p>
                <strong>Age:</strong> {pet.age}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={form.occupation}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <textarea
              name="reason"
              placeholder="Why do you want to adopt this pet?"
              rows={5}
              value={form.reason}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold"
            >
              Submit Adoption Request
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default Adopt;