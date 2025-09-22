const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string
  production_companies: { id: number; name: string; logo_path: string | null }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { iso_639_1: string; name: string }[]
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

class TMDBService {
  private async fetchFromAPI(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`/api${endpoint}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API fetch error:", error)
      throw error
    }
  }

  async getPopularMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`/movies/popular?page=${page}`)
  }

  async getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<MoviesResponse> {
    return this.fetchFromAPI(`/movies/trending?timeWindow=${timeWindow}`)
  }

  async searchMovies(query: string, page = 1): Promise<MoviesResponse> {
    const encodedQuery = encodeURIComponent(query)
    return this.fetchFromAPI(`/movies/search?query=${encodedQuery}&page=${page}`)
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromAPI(`/movies/${movieId}`)
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromAPI(`/movies/${movieId}/credits`)
  }

  async getTopRatedMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`/movies/top-rated?page=${page}`)
  }

  async getNowPlayingMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`/movies/now-playing?page=${page}`)
  }

  async getUpcomingMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`/movies/upcoming?page=${page}`)
  }

  // Helper methods for image URLs
  getPosterUrl(
    posterPath: string | null,
    size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500",
  ): string {
    if (!posterPath) return "/abstract-movie-poster.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
  }

  getBackdropUrl(backdropPath: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280"): string {
    if (!backdropPath) return "/movie-backdrop.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
  }

  getProfileUrl(profilePath: string | null, size: "w45" | "w185" | "h632" | "original" = "w185"): string {
    if (!profilePath) return "/diverse-person-profiles.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`
  }
}

export const tmdbService = new TMDBService()
