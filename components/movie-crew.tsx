import type { Crew } from "@/lib/tmdb"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface MovieCrewProps {
  crew: Crew[]
  loading?: boolean
  error?: string | null
}

export function MovieCrew({ crew, loading, error }: MovieCrewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Key Crew</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Key Crew</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!crew || crew.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Key Crew</h2>
        <p className="text-muted-foreground">No crew information available.</p>
      </div>
    )
  }

  // Filter and show key crew members (directors, producers, writers, etc.)
  const keyJobs = [
    "Director",
    "Producer",
    "Executive Producer",
    "Writer",
    "Screenplay",
    "Story",
    "Director of Photography",
    "Editor",
    "Original Music Composer",
  ]
  const keyCrew = crew.filter((member) => keyJobs.includes(member.job))

  // Group by job
  const crewByJob = keyCrew.reduce(
    (acc, member) => {
      if (!acc[member.job]) {
        acc[member.job] = []
      }
      acc[member.job].push(member)
      return acc
    },
    {} as Record<string, Crew[]>,
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Key Crew</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(crewByJob).map(([job, members]) => (
          <div key={job} className="space-y-2">
            <h3 className="font-semibold text-foreground">{job}</h3>
            <div className="space-y-1">
              {members.map((member) => (
                <p key={`${member.id}-${member.job}`} className="text-sm text-muted-foreground">
                  {member.name}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
