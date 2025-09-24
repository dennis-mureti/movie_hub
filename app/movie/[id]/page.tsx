"use client";

import { useParams, useRouter } from "next/navigation";
import { useMovieDetails, useMovieCredits } from "@/hooks/use-movies";
import { MovieDetailsHeader } from "@/components/movie-details-header";
import { MovieDetailsInfo } from "@/components/movie-details-info";
import { MovieCast } from "@/components/movie-cast";
import { MovieCrew } from "@/components/movie-crew";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = Number.parseInt(params.id as string);

  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
  } = useMovieDetails(movieId);
  const {
    data: credits,
    loading: creditsLoading,
    error: creditsError,
  } = useMovieCredits(movieId);

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {movieError || "Movie not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 text-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movies
        </Button>

        {movie && (
          <div className="space-y-12">
            <MovieDetailsHeader movie={movie} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <MovieDetailsInfo movie={movie} />

                {/* Cast Section */}
                <div className="space-y-6">
                  <MovieCast
                    cast={credits?.cast || []}
                    loading={creditsLoading}
                    error={creditsError}
                  />
                </div>

                {/* Crew Section */}
                <div className="space-y-6">
                  <MovieCrew
                    crew={credits?.crew || []}
                    loading={creditsLoading}
                    error={creditsError}
                  />
                </div>
              </div>

              {/* Sidebar with additional info */}
              <div className="space-y-6">
                {/* Movie Stats Sidebar */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Movie Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 text-card-foreground">
                        {movie.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Runtime:</span>
                      <span className="ml-2 text-card-foreground">
                        {movie.runtime} minutes
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="ml-2 text-card-foreground">
                        {movie.budget > 0
                          ? `$${movie.budget.toLocaleString()}`
                          : "Not disclosed"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="ml-2 text-card-foreground">
                        {movie.revenue > 0
                          ? `$${movie.revenue.toLocaleString()}`
                          : "Not disclosed"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Original Language:
                      </span>
                      <span className="ml-2 text-card-foreground uppercase">
                        {movie.original_language}
                      </span>
                    </div>
                  </div>
                </div>

                {movie.production_companies.length > 0 && (
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Production Companies
                    </h3>
                    <div className="space-y-2">
                      {movie.production_companies.map((company) => (
                        <div
                          key={company.id}
                          className="text-sm text-card-foreground"
                        >
                          {company.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
