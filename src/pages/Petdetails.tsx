import { useParams, Link } from "react-router-dom";

import golden from "../assets/goldenretriever.jpg";
import persian from "../assets/persiancat.jpg";
import shepherd from "../assets/germanshepherd.jpg";
import greatdane from "../assets/greatdanedog.jpeg";

function Petdetails() {
  const { id } = useParams();

  const pets = [
    {
      id: "1",
      name: "Buddy",
      breed: "Golden Retriever",
      age: "2 Years",
      gender: "Male",
      color: "Golden",
      size: "Large",
      vaccinated: "Yes",
      location: "Chennai Animal Shelter",
      image: golden,
      about:
        "Buddy is a friendly and playful Golden Retriever. He loves children and enjoys outdoor activities.",
    },

    {
      id: "2",
      name: "Luna",
      breed: "Persian Cat",
      age: "1 Year",
      gender: "Female",
      color: "White",
      size: "Small",
      vaccinated: "Yes",
      location: "Salem Pet Care",
      image: persian,
      about:
        "Luna is a calm and affectionate Persian Cat who enjoys relaxing indoors.",
    },

    {
      id: "3",
      name: "Max",
      breed: "German Shepherd",
      age: "3 Years",
      gender: "Male",
      color: "Black & Brown",
      size: "Large",
      vaccinated: "Yes",
      location: "Coimbatore Shelter",
      image: shepherd,
      about:
        "Max is energetic, intelligent, and well-trained. He is looking for an active family.",
    },

    {
      id: "4",
      name: "Shiro",
      breed: "Great Dane",
      age: "8 Years",
      gender: "Male",
      color: "Brown",
      size: "Large",
      vaccinated: "Yes",
      location: "Coimbatore Shelter",
      image: greatdane,
      about:
        "Shiro is a gentle giant who loves attention and affection. He is great with children and other pets.",
    },
  ];

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <h1 className="text-center text-4xl mt-20">
        Pet Not Found
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-5">
      <div className="grid md:grid-cols-2 gap-10">

        {/* Pet Image */}
        <img
          src={pet.image}
          alt={pet.name}
          className="rounded-xl w-full h-[500px] object-cover shadow-lg"
        />

        {/* Pet Details */}
        <div>

          <h1 className="text-5xl font-bold mb-4">
            {pet.name}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {pet.breed}
          </p>

          <div className="space-y-3">

            <p><strong>Age:</strong> {pet.age}</p>

            <p><strong>Gender:</strong> {pet.gender}</p>

            <p><strong>Size:</strong> {pet.size}</p>

            <p><strong>Color:</strong> {pet.color}</p>

            <p><strong>Vaccinated:</strong> {pet.vaccinated}</p>

            <p><strong>Location:</strong> {pet.location}</p>

          </div>

          <h2 className="text-2xl font-bold mt-8 mb-3">
            About {pet.name}
          </h2>

          <p className="text-gray-600 leading-8">
            {pet.about}
          </p>

          <div className="flex gap-4 mt-10">

            <Link
            to="/adopt"
            state={{ pet }}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold">
                Adopt Me ❤️
                </button>
                </Link>

            <Link to="/pets">
              <button className="bg-gray-300 hover:bg-gray-400 px-8 py-4 rounded-lg font-semibold">
                Back to Pets
              </button>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Petdetails;