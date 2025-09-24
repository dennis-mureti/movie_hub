import { type NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

interface Credit {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

async function fetchFromTMDB(
  endpoint: string
): Promise<{ cast: Credit[]; crew: CrewMember[] }> {
  try {
    // Validate movie ID
    const movieId = endpoint.match(/\/movie\/(\d+)\/credits/);
    if (!movieId || !movieId[1]) {
      throw new Error("Invalid movie ID");
    }

    // Get the credits from TMDB service
    const credits = await tmdbService.getMovieCredits(Number(movieId[1]));

    // Map the response to our expected types
    const cast = (credits.cast || []).map((castMember) => ({
      id: castMember.id,
      name: castMember.name,
      character: castMember.character || "N/A",
      profile_path: castMember.profile_path,
      order: castMember.order || 0,
    }));

    const crew = (credits.crew || []).map((crewMember) => ({
      id: crewMember.id,
      name: crewMember.name,
      job: crewMember.job || "N/A",
      department: crewMember.department || "N/A",
      profile_path: crewMember.profile_path,
    }));

    return { cast, crew };
  } catch (error) {
    console.error("Error fetching credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id;
    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const data = await fetchFromTMDB(`/movie/${movieId}/credits`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
