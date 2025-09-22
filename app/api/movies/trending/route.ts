import { type NextRequest, NextResponse } from "next/server"
import { mockMovies } from "@/lib/mock-data"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

async function fetchFromTMDB(endpoint: string): Promise<any> {
  if (!API_KEY) {
    console.log("[v0] TMDB API key not found, using mock data")
    return mockMovies.trending
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
    const timeWindow = searchParams.get("timeWindow") || "week"

    const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Trending movies API error:", error)
    return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 })
  }
}
