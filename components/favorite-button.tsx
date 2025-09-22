"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/contexts/favorites-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

interface FavoriteButtonProps {
  movie: Movie
  size?: "sm" | "default" | "lg"
}

export function FavoriteButton({ movie, size = "default" }: FavoriteButtonProps) {
  const { user } = useAuth()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isMovieFavorite = isFavorite(movie.id)

  const handleToggleFavorite = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (isMovieFavorite) {
      removeFromFavorites(movie.id)
    } else {
      addToFavorites(movie)
    }
  }

  return (
    <Button
      variant={isMovieFavorite ? "default" : "outline"}
      size={size}
      onClick={handleToggleFavorite}
      className={`${isMovieFavorite ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
    >
      <Heart className={`h-4 w-4 ${isMovieFavorite ? "fill-current" : ""}`} />
      {size !== "sm" && <span className="ml-2">{isMovieFavorite ? "Remove" : "Add to Favorites"}</span>}
    </Button>
  )
}
