"use client"

import { useState } from "react"
import { MovieSection } from "./movie-section"
import { MovieGrid } from "./movie-grid"
import { Pagination } from "./pagination"
import { Button } from "@/components/ui/button"
import type { Movie, MoviesResponse } from "@/lib/tmdb"

interface MovieCategoryProps {
  title: string
  data: MoviesResponse | null
  loading: boolean
  error: string | null
  onMovieClick: (movie: Movie) => void
  onPageChange?: (page: number) => void
  showPagination?: boolean
  initialItemsToShow?: number
}

export function MovieCategory({
  title,
  data,
  loading,
  error,
  onMovieClick,
  onPageChange,
  showPagination = false,
  initialItemsToShow = 10,
}: MovieCategoryProps) {
  const [showAll, setShowAll] = useState(false)

  if (!data && !loading) return null

  const results = data?.results || []
  const moviesToShow = showAll || showPagination ? results : results.slice(0, initialItemsToShow)

  const canShowMore = !showPagination && results.length > initialItemsToShow

  return (
    <MovieSection title={title} loading={loading} error={error}>
      {data && (
        <div className="space-y-6">
          <MovieGrid movies={moviesToShow} onMovieClick={onMovieClick} />

          {canShowMore && !showAll && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                Show More Movies
              </Button>
            </div>
          )}

          {showPagination && onPageChange && data.total_pages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={Math.min(data.total_pages, 500)} // TMDB API limit
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </MovieSection>
  )
}
