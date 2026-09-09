import { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import Petcard from "../components/Petcard";
import { getPets } from "../api/petService";
type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
};

function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
         console.log(data);
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      
      <section className="py-16 bg-gray-100 min-h-screen">
        <h1 className="text-5xl font-bold text-center mb-10 ">
          All Pets
        </h1>

        <Searchbar
          search={search}
          setSearch={setSearch}
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
          {filteredPets.map((pet) => (
            <Petcard
              key={pet._id}
              id={pet._id}
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