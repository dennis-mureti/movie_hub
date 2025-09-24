import { type NextRequest, NextResponse } from "next/server";
import { mockMovieDetails } from "@/lib/mock-data";
import type { MovieDetails } from "@/lib/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  if (!API_KEY) {
    console.log(
      "[v0] TMDB API key not found, using mock data for movie details"
    );
    return mockMovieDetails[1] as unknown as T;
  }

  const url = `${TMDB_BASE_URL}${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return await response.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<MovieDetails | { error: string }>> {
  try {
    const movieId = params.id;
    const data = await fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Movie details API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
