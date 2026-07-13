import { useState } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Petcard from "../components/Petcard";
import { PetsData } from "../data/Pets";

function PetsPage() {
  const [search, setSearch] = useState("");

  const filteredPets = PetsData.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <Searchbar
        search={search}
        setSearch={setSearch}
      />

      <section className="py-16 bg-gray-100 min-h-screen">
        <h1 className="text-5xl font-bold text-center mb-10">
          All Pets
        </h1>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-5">
          {filteredPets.map((pet) => (
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
      </section>
    </>
  );
}

export default PetsPage;