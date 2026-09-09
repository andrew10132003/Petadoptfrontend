import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { petImages } from "../utils/petsImages"; 

type PetcardProps = {
  id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
};

function Petcard({ id, name, breed, age, image }: PetcardProps) {
  const {
    favorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();

  const favorite = favorites.some((pet) => pet.id === id);

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        name,
        breed,
        age,
        image,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      <div className="relative">
        <img
          src={petImages[name] || image}
          alt={name}
          className="w-full h-64 object-cover"
        />

        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-2xl"
        >
          {favorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="p-7">
        <h2 className="text-3xl font-bold">{name}</h2>

        <p className="text-gray-600">{breed}</p>

        <p className="text-gray-600 mb-6">{age}</p>

        <Link to={`/pets/${id}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Petcard;