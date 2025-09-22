"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar } from "lucide-react"
import { type Movie, tmdbService } from "@/lib/tmdb"

interface MovieCardProps {
  movie: Movie
  onClick?: () => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path, "w342")
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card border-border"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-card-foreground line-clamp-2 text-balance">{movie.title}</h3>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {releaseYear}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 text-pretty">{movie.overview}</p>
        </div>
      </CardContent>
    </Card>
  )
}
