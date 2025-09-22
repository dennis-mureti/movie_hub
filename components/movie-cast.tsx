import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { tmdbService, type Cast } from "@/lib/tmdb"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface MovieCastProps {
  cast: Cast[]
  loading?: boolean
  error?: string | null
}

export function MovieCast({ cast, loading, error }: MovieCastProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Cast</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!cast || cast.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Cast</h2>
        <p className="text-muted-foreground">No cast information available.</p>
      </div>
    )
  }

  // Show top 12 cast members
  const displayCast = cast.slice(0, 12)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Cast</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayCast.map((actor) => (
          <Card key={actor.id} className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[2/3]">
                <Image
                  src={tmdbService.getProfileUrl(actor.profile_path, "w185") || "/placeholder.svg"}
                  alt={actor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-card-foreground text-sm line-clamp-2">{actor.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{actor.character}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
