"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { type Movie } from "@/lib/tmdb";

interface FavoritesContextType {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const authContext = useAuth();
  const { user, isLoading } = authContext || { user: null, isLoading: true };

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Load user's favorites from localStorage
        const userFavorites = localStorage.getItem(`favorites-${user.id}`);
        if (userFavorites) {
          try {
            const parsedFavorites = JSON.parse(userFavorites);
            // Ensure all required fields are present in the parsed favorites
            const validFavorites = parsedFavorites.filter(
              (movie: Movie) =>
                movie.id && movie.title && typeof movie.overview !== "undefined"
            );
            setFavorites(validFavorites);
          } catch (error) {
            console.error("Error parsing favorites:", error);
          }
        }
      } else {
        // Clear favorites when user logs out
        setFavorites([]);
      }
    }
  }, [user, isLoading]);

  const addToFavorites = (movie: Movie) => {
    if (!user) return;

    // Ensure we're not adding duplicates
    if (!favorites.some((fav) => fav.id === movie.id)) {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      localStorage.setItem(
        `favorites-${user.id}`,
        JSON.stringify(newFavorites)
      );
    }
  };

  const removeFromFavorites = (movieId: number) => {
    if (!user) return;

    const newFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(newFavorites);
    localStorage.setItem(`favorites-${user.id}`, JSON.stringify(newFavorites));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
