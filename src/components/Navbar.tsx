import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function Navbar() {
  const { favorites } = useFavorites();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <Link to="/" className="text-2xl font-bold text-blue-600">
          PetAdopt
        </Link>

        <div className="flex items-center space-x-6">

          <Link to="/">Home</Link>

          <Link to="/pets">Pets</Link>

          <Link to="/favorites" className="font-semibold">
            ❤️ Favorites ({favorites.length})
          </Link>

          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;