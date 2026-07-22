import { useState } from "react";
import Navbar from "../components/Navbar";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    alert("Registration Submitted Successfully!");
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-lg p-8">

          <h1 className="text-4xl font-bold text-center mb-8">
            Register
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border p-3 rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-3 rounded-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              rows={4}
              className="w-full border p-3 rounded-lg"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Register
            </button>

          </form>

        </div>
      </section>
    </>
  );
}

export default Register;