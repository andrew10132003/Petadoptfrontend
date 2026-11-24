import { createContext, useContext, useEffect, useState } from "react";
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

const STORAGE_KEY = "pet-adoption-favorites";
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function readFavorites(): Favorite[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed as Favorite[] : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (pet: Favorite) => {
    setFavorites((current) =>
      current.some((item) => item.id === pet.id) ? current : [...current, pet]
    );
  };

  const removeFavorite = (id: string) => {
    setFavorites((current) => current.filter((pet) => pet.id !== id));
  };

  const isFavorite = (id: string) => favorites.some((pet) => pet.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
