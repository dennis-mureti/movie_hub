import type { MovieDetails } from "@/lib/tmdb"

interface MovieDetailsInfoProps {
  movie: MovieDetails
}

export function MovieDetailsInfo({ movie }: MovieDetailsInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
        <p className="text-muted-foreground leading-relaxed text-pretty">
          {movie.overview || "No overview available."}
        </p>
      </div>

      {movie.spoken_languages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {movie.spoken_languages.map((language) => (
              <span key={language.iso_639_1} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                {language.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {movie.production_countries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Production Countries</h3>
          <div className="flex flex-wrap gap-2">
            {movie.production_countries.map((country) => (
              <span key={country.iso_3166_1} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                {country.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
