import { FaHeart, FaHome } from "react-icons/fa";
import { FaShieldDog } from "react-icons/fa6";

function WhyAdopt() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">

        <h2 className="text-4xl font-bold text-center mb-4">
          Why Adopt a Pet?
        </h2>

        <p className="text-gray-500 text-center mb-14">
          Every adoption gives a loving animal a second chance at life.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-blue-50 rounded-xl p-8 text-center shadow hover:shadow-lg transition">
            <FaHeart className="text-red-500 text-5xl mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-3">Save a Life</h3>
            <p className="text-gray-600">
              Adopt a rescued pet and give them a loving forever home.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-8 text-center shadow hover:shadow-lg transition">
            <FaHome className="text-green-600 text-5xl mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-3">Find a Companion</h3>
            <p className="text-gray-600">
              Pets become loyal friends and loving family members.
            </p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-8 text-center shadow hover:shadow-lg transition">
            <FaShieldDog className="text-yellow-600 text-5xl mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-3">Healthy & Vaccinated</h3>
            <p className="text-gray-600">
              Our listed pets are checked and vaccinated before adoption.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyAdopt;