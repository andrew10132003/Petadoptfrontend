import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FosterDashboard() {
  const navigate = useNavigate();

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
      }
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">

          <div className="flex items-center gap-4">

            <div className="text-5xl">
              🐾
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Foster Dashboard
              </h1>

              <p className="text-gray-500 mt-1">
                Welcome to the Pet Adoption Platform
              </p>

            </div>

          </div>

        </div>

        {/* ROLE INFORMATION */}

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">

          <h2 className="text-xl font-bold text-blue-800 mb-2">
            🏠 Foster Role
          </h2>

          <p className="text-blue-700">
            As a foster, you can help provide temporary
            care and a safe home for pets while they are
            waiting for permanent adoption.
          </p>

        </div>

        {/* AVAILABLE FEATURES */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* FOSTER PETS */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="text-4xl mb-4">
              🐶
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Foster Pets
            </h2>

            <p className="text-gray-500 mt-2">
              View pets that may need temporary foster
              care.
            </p>

            <button
              onClick={() => navigate("/pets")}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              View Pets
            </button>

          </div>

          {/* FUTURE FOSTERING */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="text-4xl mb-4">
              ❤️
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Foster Applications
            </h2>

            <p className="text-gray-500 mt-2">
              Foster application and pet-care management
              can be added here.
            </p>

            <button
              disabled
              className="mt-5 bg-gray-300 text-gray-600 px-5 py-2 rounded-lg font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>

          </div>

        </div>

        {/* IMPORTANT ROLE RULE */}

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-8">

          <h2 className="text-lg font-bold text-yellow-800">
            ℹ️ Foster Access
          </h2>

          <p className="text-yellow-700 mt-2">
            Foster accounts cannot submit normal pet
            adoption requests. Adoption requests are
            submitted by adopters and reviewed by shelters.
          </p>

        </div>

      </div>

    </div>
  );
}

export default FosterDashboard;