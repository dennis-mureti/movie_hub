"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MovieCategory } from "@/components/movie-category"
import { SearchModal } from "@/components/search-modal"
import { usePopularMovies, useTrendingMovies } from "@/hooks/use-movies"
import type { Movie } from "@/lib/tmdb"

export default function HomePage() {
  const router = useRouter()
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [popularPage, setPopularPage] = useState(1)

  const { data: popularMovies, loading: popularLoading, error: popularError } = usePopularMovies(popularPage)
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useTrendingMovies()

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`)
  }

  const handleSearchClick = () => {
    setSearchModalOpen(true)
  }

  const handlePopularPageChange = (page: number) => {
    setPopularPage(page)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={handleSearchClick} />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">Discover Amazing Movies</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore trending films, find your next favorite movie, and dive into detailed information about cast, crew,
            and ratings.
          </p>
        </section>

        {/* Trending Movies */}
        <MovieCategory
          title="Trending This Week"
          data={trendingMovies}
          loading={trendingLoading}
          error={trendingError}
          onMovieClick={handleMovieClick}
          initialItemsToShow={10}
        />

        {/* Popular Movies with Pagination */}
        <MovieCategory
          title="Popular Movies"
          data={popularMovies}
          loading={popularLoading}
          error={popularError}
          onMovieClick={handleMovieClick}
          onPageChange={handlePopularPageChange}
          showPagination={true}
        />
      </main>

      {/* Search Modal */}
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} onMovieSelect={handleMovieClick} />
    </div>
  )
}
