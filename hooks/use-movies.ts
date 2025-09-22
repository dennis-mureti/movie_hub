"use client"

import { useState, useEffect } from "react"
import { tmdbService, type MovieDetails, type Credits, type MoviesResponse } from "@/lib/tmdb"

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export function usePopularMovies(page = 1) {
  const [data, setData] = useState<MoviesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `popular-movies-${page}`
      const cached = getCachedData<MoviesResponse>(cacheKey)

      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await tmdbService.getPopularMovies(page)
        setCachedData(cacheKey, result)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch popular movies")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page])

  return { data, loading, error }
}

export function useTrendingMovies(timeWindow: "day" | "week" = "week") {
  const [data, setData] = useState<MoviesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `trending-movies-${timeWindow}`
      const cached = getCachedData<MoviesResponse>(cacheKey)

      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await tmdbService.getTrendingMovies(timeWindow)
        setCachedData(cacheKey, result)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch trending movies")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeWindow])

  return { data, loading, error }
}

export function useMovieSearch(query: string, page = 1) {
  const [data, setData] = useState<MoviesResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setData(null)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const cacheKey = `search-movies-${query}-${page}`
      const cached = getCachedData<MoviesResponse>(cacheKey)

      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await tmdbService.searchMovies(query, page)
        setCachedData(cacheKey, result)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search movies")
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchData, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [query, page])

  return { data, loading, error }
}

export function useMovieDetails(movieId: number | null) {
  const [data, setData] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setData(null)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const cacheKey = `movie-details-${movieId}`
      const cached = getCachedData<MovieDetails>(cacheKey)

      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await tmdbService.getMovieDetails(movieId)
        setCachedData(cacheKey, result)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  return { data, loading, error }
}

export function useMovieCredits(movieId: number | null) {
  const [data, setData] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setData(null)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const cacheKey = `movie-credits-${movieId}`
      const cached = getCachedData<Credits>(cacheKey)

      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await tmdbService.getMovieCredits(movieId)
        setCachedData(cacheKey, result)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie credits")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [movieId])

  return { data, loading, error }
}
