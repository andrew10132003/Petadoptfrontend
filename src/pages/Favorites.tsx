import Navbar from "../components/Navbar";
import Petcard from "../components/Petcard";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <>
      <Navbar />

      <section className="py-16 bg-gray-100 min-h-screen">
        <h1 className="text-5xl font-bold text-center mb-10">
          My Favorites ❤️
        </h1>

        {favorites.length === 0 ? (
          <h2 className="text-center text-2xl">
            No favorite pets yet.
          </h2>
        ) : (
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-5">
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
      </section>
    </>
  );
}

export default Favorites;