import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Clock } from "lucide-react"
import { tmdbService, type MovieDetails } from "@/lib/tmdb"

interface MovieDetailsHeaderProps {
  movie: MovieDetails
}

export function MovieDetailsHeader({ movie }: MovieDetailsHeaderProps) {
  const backdropUrl = tmdbService.getBackdropUrl(movie.backdrop_path, "w1280")
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path, "w500")
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Backdrop Image */}
      <div className="relative h-96 md:h-[500px]">
        <Image src={backdropUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-32 md:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image src={posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-4 text-white">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-balance mb-2">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-lg md:text-xl text-gray-200 italic text-pretty">{movie.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-300 ml-1">({movie.vote_count.toLocaleString()} votes)</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-1" />
                  {releaseYear}
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  {movie.runtime} min
                </div>
              </div>

              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary" className="bg-white/20 text-white border-none">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
