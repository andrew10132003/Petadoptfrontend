import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-blue-600 text-white py-24">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className=" text-5xl font-bold">
          Find Your Perfect Pet Companion
        </h1>

        <p className="mt-6 bg-gray-500 text-lg p-4">
          Adopt, Foster and Save Lives.
        </p>

        <Link
          to="/pets"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg mt-8 inline-block font-semibold"
        >
          Browse Pets
        </Link>
      </div>
    </section>
  );
}

export default Hero;