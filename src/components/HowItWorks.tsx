import { FaSearch, FaFileAlt, FaHome } from "react-icons/fa";

function HowItWorks() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-5">

        <h2 className="text-4xl font-bold text-center mb-4">
          How Adoption Works
        </h2>

        <p className="text-center text-gray-500 mb-14">
          Adopt your new best friend in three simple steps.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-blue-100 p-8 rounded-xl shadow text-center shadow hover:shadow-lg transition">
            <FaSearch className="text-5xl text-blue-600 mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-3">Browse Pets</h3>
            <p className="text-gray-600">
              Search hundreds of pets looking for a loving family.
            </p>
          </div>

          <div className="bg-green-100 p-8 rounded-xl shadow text-center shadow hover:shadow-lg transition">
            <FaFileAlt className="text-5xl text-green-600 mx-auto mb-5" />
            <h3 className="text-2xl  font-bold mb-3">Apply</h3>
            <p className="text-gray-600">
              Submit an adoption application directly from the platform.
            </p>
          </div>

          <div className="bg-orange-100  p-8 rounded-xl shadow text-center shadow hover:shadow-lg transition">
            <FaHome className="text-5xl text-orange-500 mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-3">Bring Home</h3>
            <p className="text-gray-600">
              Meet your pet and welcome them into your family.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;