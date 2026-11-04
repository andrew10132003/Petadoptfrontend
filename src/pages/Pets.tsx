import { useEffect, useMemo, useState } from "react";
import Searchbar from "../components/Searchbar";
import Petcard from "../components/Petcard";
import { getPets } from "../api/petService";

type Pet = {
  _id: string;
  name: string;
  breed: string;
  age: string | number;
  image: string;
  size?: string;
  color?: string;
  location?: string;
  description?: string;
  listingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

function getAgeInYears(age: string | number): number {
  if (typeof age === "number") return age;

  const match = age.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchPets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPets();

        if (!Array.isArray(data)) {
          throw new Error("The pets API did not return a list.");
        }

        if (active) {
          setPets(data);
        }
      } catch (err) {
        console.error("Error fetching pets:", err);

        if (active) {
          setError("Unable to load pets. Please refresh and try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPets();

    return () => {
      active = false;
    };
  }, []);

  const breeds = useMemo(
    () =>
      [...new Set(pets.map((pet) => pet.breed).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [pets]
  );

  const filteredPets = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    const result = pets.filter((pet) => {
      const name = pet.name || "";
      const petBreed = pet.breed || "";
      const petSize = pet.size || "";
      const petLocation = pet.location || "";
      const age = getAgeInYears(pet.age);

      const matchesSearch =
        !searchText ||
        name.toLowerCase().includes(searchText) ||
        petBreed.toLowerCase().includes(searchText);

      const matchesBreed = !breed || petBreed === breed;

      const matchesAge =
        !ageGroup ||
        (ageGroup === "young" &&
          Number.isFinite(age) &&
          age <= 1) ||
        (ageGroup === "adult" &&
          Number.isFinite(age) &&
          age > 1 &&
          age < 8) ||
        (ageGroup === "senior" &&
          Number.isFinite(age) &&
          age >= 8);

      const matchesSize =
        !size || petSize.toLowerCase() === size.toLowerCase();

      const matchesLocation =
        !locationText ||
        petLocation.toLowerCase().includes(locationText);

      const matchesAvailability =
        !pet.listingStatus ||
        pet.listingStatus === "available";

      return (
        matchesSearch &&
        matchesBreed &&
        matchesAge &&
        matchesSize &&
        matchesLocation &&
        matchesAvailability
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "age-youngest") {
        return getAgeInYears(a.age) - getAgeInYears(b.age);
      }

      if (sortBy === "age-oldest") {
        return getAgeInYears(b.age) - getAgeInYears(a.age);
      }

      if (sortBy === "newest") {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      }

      if (sortBy === "oldest") {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateA - dateB;
      }

      return 0;
    });
  }, [pets, search, breed, ageGroup, size, location, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setBreed("");
    setAgeGroup("");
    setSize("");
    setLocation("");
    setSortBy("newest");
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Find Your New Best Friend 🐾
          </h1>

          <p className="mt-3 text-gray-600">
            Search and filter pets to find the right companion for you.
          </p>
        </div>

        <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
          <Searchbar search={search} setSearch={setSearch} />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Breed
              </label>

              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="">All breeds</option>

                {breeds.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Age group
              </label>

              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="">All ages</option>
                <option value="young">Young (up to 1 year)</option>
                <option value="adult">Adult (over 1 and under 8)</option>
                <option value="senior">Senior (8+ years)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Size
              </label>

              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="">All sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Location
              </label>

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter a city"
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredPets.length} of {pets.length} pets
            </p>

            <div className="flex flex-wrap gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort pets"
                className="rounded-lg border border-gray-300 bg-white p-3"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name: A–Z</option>
                <option value="age-youngest">Age: youngest first</option>
                <option value="age-oldest">Age: oldest first</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 px-4 py-3 font-medium hover:bg-gray-100"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-lg text-gray-600">
            Loading pets...
          </p>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-5 text-center text-red-700">
            {error}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="rounded-xl bg-white px-5 py-12 text-center shadow-sm">
            <p className="text-5xl">🐶</p>

            <h2 className="mt-4 text-xl font-semibold">
              No pets found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Show all pets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 px-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPets.map((pet) => (
              <Petcard
                key={pet._id}
                id={pet._id}
                name={pet.name}
                breed={pet.breed}
                age={String(pet.age)}
                image={pet.image}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default PetsPage;