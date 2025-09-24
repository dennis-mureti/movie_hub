const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

class TMDBService {
  private async fetchFromAPI(endpoint: string): Promise<any> {
    try {
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint.slice(1)
        : endpoint;
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      console.log("API Key:", apiKey ? "Found" : "Not Found");

      if (!apiKey) {
        throw new Error(
          "TMDB API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables."
        );
      }

      // Use URLSearchParams to handle query parameters properly
      const url = new URL(`${TMDB_API_BASE_URL}/${cleanEndpoint}`);
      url.searchParams.append("api_key", apiKey);

      console.log("Fetching URL:", url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("TMDB API fetch error:", error);
      throw error;
    }
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromAPI(`movie/${movieId}/credits`);
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromAPI(`movie/${movieId}`);
  }

  async getPopularMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`movie/popular?page=${page}`);
  }

  async getTrendingMovies(
    timeWindow: "day" | "week" = "week"
  ): Promise<MoviesResponse> {
    return this.fetchFromAPI(`trending/movie/${timeWindow}`);
  }

  async searchMovies(query: string, page = 1): Promise<MoviesResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromAPI(`search/movie?query=${encodedQuery}&page=${page}`);
  }

  async getTopRatedMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`movie/top_rated?page=${page}`);
  }

  async getNowPlayingMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`movie/now_playing?page=${page}`);
  }

  async getUpcomingMovies(page = 1): Promise<MoviesResponse> {
    return this.fetchFromAPI(`movie/upcoming?page=${page}`);
  }

  // Helper methods for image URLs
  getPosterUrl(
    posterPath: string | null,
    size:
      | "w92"
      | "w154"
      | "w185"
      | "w342"
      | "w500"
      | "w780"
      | "original" = "w500"
  ): string {
    if (!posterPath) return "/abstract-movie-poster.png";
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  getBackdropUrl(
    backdropPath: string | null,
    size: "w300" | "w780" | "w1280" | "original" = "w1280"
  ): string {
    if (!backdropPath) return "/movie-backdrop.png";
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
  }

  getProfileUrl(
    profilePath: string | null,
    size: "w45" | "w185" | "h632" | "original" = "w185"
  ): string {
    if (!profilePath) return "/diverse-person-profiles.png";
    return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`;
  }
}

export const tmdbService = new TMDBService();
