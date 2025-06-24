import type { MovieRow } from "./movies-data"
import { movies } from "./movies-data"

interface ImportedMovie {
  movieId: number
  title: string
  genres: string
  year?: number
  avgRating?: number
}

/**
 * Very small, content-based recommender using genre overlap.
 * For the purposes of the demo dataset this is sufficient.
 */
export function getRecommendations(targetMovie: MovieRow, movies: MovieRow[], count = 5): MovieRow[] {
  const targetGenres = new Set(targetMovie.genres.split("|"))

  // Score by simple Jaccard overlap of genres
  const scored = movies
    .filter((m) => m.movieId !== targetMovie.movieId) // exclude self
    .map((m) => {
      const genres = new Set(m.genres.split("|"))
      const intersection = [...genres].filter((g) => targetGenres.has(g)).length
      const union = new Set([...genres, ...targetGenres]).size
      const score = union === 0 ? 0 : intersection / union
      return { movie: m, score }
    })
    .filter((s) => s.score > 0) // keep only something in common
    .sort((a, b) => b.score - a.score) // best first
    .slice(0, count)

  return scored.map((s) => s.movie)
}

export function recommendByTitle(title: string, count = 5): MovieRow[] {
  // Basic implementation: return the top N movies with titles containing the search term
  const recommendations = movies
    .filter((movie) => movie.title.toLowerCase().includes(title.toLowerCase()))
    .slice(0, count)

  return recommendations
}
