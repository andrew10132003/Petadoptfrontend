import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Favorite = {
  id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
};

type FavoritesContextType = {
  favorites: Favorite[];
  addFavorite: (pet: Favorite) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const addFavorite = (pet: Favorite) => {
    if (!favorites.find((item) => item.id === pet.id)) {
      setFavorites([...favorites, pet]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((pet) => pet.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((pet) => pet.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}