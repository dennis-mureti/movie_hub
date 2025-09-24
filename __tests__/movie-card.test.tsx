import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { MovieCard } from "@/components/movie-card";
import { AuthProvider } from "@/contexts/auth-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import * as tmdb from "@/lib/tmdb";

// Mock next-themes at the top level
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

// Mock the tmdbService
jest.mock("@/lib/tmdb", () => ({
  ...jest.requireActual("@/lib/tmdb"),
  tmdbService: {
    getPosterUrl: jest.fn(
      (path: string) => `https://image.tmdb.org/t/p/w342${path}`
    ),
  },
}));

const mockMovie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 1000,
  overview: "A test movie",
  genre_ids: [28, 12, 16],
  adult: false,
  original_language: "en",
  original_title: "Test Movie",
  popularity: 100.0,
  video: false,
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <FavoritesProvider>{children}</FavoritesProvider>
  </AuthProvider>
);

describe("MovieCard", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("renders movie information correctly", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("displays poster image with correct alt text and source", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    // The alt text should match the movie title
    const posterImage = screen.getByAltText(mockMovie.title);
    expect(posterImage).toBeInTheDocument();

    // The source should be the result of tmdbService.getPosterUrl
    expect(tmdb.tmdbService.getPosterUrl).toHaveBeenCalledWith(
      mockMovie.poster_path,
      "w342"
    );
    expect(posterImage).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w342${mockMovie.poster_path}`
    );
  });
});
