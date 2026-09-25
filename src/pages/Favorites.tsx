import Petcard from "../components/Petcard";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            My Favorites ❤️
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Pets you have saved for later.
          </p>

          {/* Favorite Count */}
          <div className="mt-4">
            <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold">
              {favorites.length}{" "}
              {favorites.length === 1
                ? "Favorite Pet"
                : "Favorite Pets"}
            </span>
          </div>
        </div>

        {/* No Favorites */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-5">
              💔
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No favorite pets yet
            </h2>

            <p className="text-gray-600 mb-6">
              Browse our available pets and add your favorite pets here.
            </p>

            <a
              href="/pets"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Browse Pets
            </a>
          </div>
        ) : (
          /* Favorite Pets */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((pet) => (
              <Petcard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                breed={pet.breed}
                age={pet.age}
                image={pet.image}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;