import { type NextRequest, NextResponse } from "next/server"
import { mockMovies } from "@/lib/mock-data"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

async function fetchFromTMDB(endpoint: string): Promise<any> {
  if (!API_KEY) {
    console.log("[v0] TMDB API key not found, using mock data for search")
    return {
      page: 1,
      results: mockMovies.popular.results.slice(0, 2),
      total_pages: 1,
      total_results: 2,
    }
  }

  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }

  return await response.json()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const page = searchParams.get("page") || "1"

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const encodedQuery = encodeURIComponent(query)
    const data = await fetchFromTMDB(`/search/movie?query=${encodedQuery}&page=${page}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Search movies API error:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
