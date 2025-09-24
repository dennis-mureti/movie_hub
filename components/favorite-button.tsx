"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/favorites-context";
import { useAuth } from "@/contexts/auth-context";
import type { Movie } from "@/lib/tmdb";

interface FavoriteButtonProps {
  movie: Movie;
  size?: "sm" | "default" | "lg";
}

export function FavoriteButton({
  movie,
  size = "default",
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const handleClick = () => {
    if (!user) {
      // Handle unauthorized user (e.g., show sign-in modal)
      return;
    }
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <Button
      variant={isFavorite(movie.id) ? "default" : "outline"}
      size={size}
      onClick={handleClick}
      className={`${
        isFavorite(movie.id) ? "bg-red-500 hover:bg-red-600 text-white" : ""
      }`}
    >
      <Heart
        className={`h-4 w-4 ${isFavorite(movie.id) ? "fill-current" : ""}`}
      />
      {size !== "sm" && (
        <span className="ml-2">
          {isFavorite(movie.id) ? "Remove" : "Add to Favorites"}
        </span>
      )}
    </Button>
  );
}
