import { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import Petcard from "../components/Petcard";
import { getPets } from "../api/petService";
import { petImages} from "../utils/petsImages" ;
type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  description: string;
};

function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
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
      
      <Searchbar
        search={search}
        setSearch={setSearch}
      />


        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-5">
          {filteredPets.map((pet) => (
            <Petcard
            key={pet._id}
            id={pet._id}
            name={pet.name}
            breed={pet.breed}
            age={pet.age}
            image={petImages[pet.name]}
             />
          ))}
        </div>
  
    </>
  );
}

export default PetsPage;