import type React from "react"
import { render, screen } from "@testing-library/react"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider } from "@/contexts/auth-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { ThemeProvider } from "@/components/theme-provider"

const mockMovie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  overview: "A test movie",
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <AuthProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </AuthProvider>
  </ThemeProvider>
)

describe("MovieCard", () => {
  it("renders movie information correctly", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>,
    )

    expect(screen.getByText("Test Movie")).toBeInTheDocument()
    expect(screen.getByText("2023")).toBeInTheDocument()
    expect(screen.getByText("8.5")).toBeInTheDocument()
  })

  it("displays poster image with correct alt text", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>,
    )

    const posterImage = screen.getByAltText("Test Movie poster")
    expect(posterImage).toBeInTheDocument()
  })
})
