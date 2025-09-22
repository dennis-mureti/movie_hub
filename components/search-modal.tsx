"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SearchBar } from "./search-bar"
import { MovieGrid } from "./movie-grid"
import { Pagination } from "./pagination"
import { useMovieSearch } from "@/hooks/use-movies"
import type { Movie } from "@/lib/tmdb"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMovieSelect: (movie: Movie) => void
}

export function SearchModal({ open, onOpenChange, onMovieSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: searchResults, loading, error } = useMovieSearch(searchQuery, currentPage)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleMovieSelect = (movie: Movie) => {
    onMovieSelect(movie)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Search Movies</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
          <SearchBar onSearch={handleSearch} />

          <div className="flex-1 overflow-y-auto">
            {!searchQuery ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Start searching</h3>
                <p className="text-muted-foreground">Enter a movie title or keyword to find movies.</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Search Error</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : searchResults && searchResults.results.length > 0 ? (
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Found {searchResults.total_results.toLocaleString()} results for "{searchQuery}"
                </div>
                <MovieGrid movies={searchResults.results} onMovieClick={handleMovieSelect} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.min(searchResults.total_pages, 500)} // TMDB API limit
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No movies found</h3>
                <p className="text-muted-foreground">Try a different search term or check your spelling.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
