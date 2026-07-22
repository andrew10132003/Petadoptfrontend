import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getPet } from "../api/petService";
import { petImages} from "../utlis/petsImages" ;

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  description: string;
};

function PetDetails() {
  const { id } = useParams();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!id) return;

        const data = await getPet(id);
        setPet(data);
      } catch (error) {
        console.error("Error fetching pet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <h1 className="text-center text-3xl mt-20">Loading...</h1>
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <Navbar />
        <h1 className="text-center text-4xl mt-20">Pet Not Found</h1>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-16 px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Pet Image */}
          <img
            src={petImages[pet.name] || pet.image}
            alt={pet.name}
            className="rounded-xl w-full h-[500px] object-cover shadow-lg"
          />

          {/* Pet Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {pet.name}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {pet.breed}
            </p>

            <div className="space-y-3">
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-3">
              About {pet.name}
            </h2>

            <p className="text-gray-600 leading-8">
              {pet.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/adopt"
                state={{ pet }}
                className="w-full sm:w-auto"
              >
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold">
                  Adopt Me ❤️
                </button>
              </Link>

              <Link
                to="/pets"
                className="w-full sm:w-auto"
              >
                <button className="w-full bg-gray-300 hover:bg-gray-400 px-8 py-4 rounded-lg font-semibold">
                  Back to Pets
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default PetDetails;