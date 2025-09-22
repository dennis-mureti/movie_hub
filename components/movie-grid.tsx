"use client"

import type { Movie } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"

interface MovieGridProps {
  movies: Movie[]
  onMovieClick?: (movie: Movie) => void
}

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No movies found</h3>
        <p className="text-muted-foreground">Try adjusting your search or browse popular movies.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick?.(movie)} />
      ))}
    </div>
  )
}
