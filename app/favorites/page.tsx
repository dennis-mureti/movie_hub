"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { useAuth } from "@/contexts/auth-context";
import { MovieCard } from "@/components/movie-card";
import { Header } from "@/components/header";
import { AuthModal } from "@/components/auth-modal";
import { useState } from "react";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Favorites</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to view and manage your favorite movies
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Sign In
            </button>
          </div>
        </main>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              You haven&apos;t added any movies to your favorites yet.
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Browse movies and click the heart icon to add them to your
              favorites.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
