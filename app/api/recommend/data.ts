export interface Movie {
  movieId: number
  title: string
  genres: string
  year?: number
  avgRating?: number
}

export interface Rating {
  userId: number
  movieId: number
  rating: number
  timestamp: number
}

/* ------------------------------------------------------------------ */
/*  Fallback data – used if fetching the CSVs fails                   */
/* ------------------------------------------------------------------ */
const SAMPLE_MOVIES: Movie[] = [
  { movieId: 1, title: "Toy Story (1995)", genres: "Adventure|Animation|Children|Comedy|Fantasy", year: 1995 },
  { movieId: 2, title: "Jumanji (1995)", genres: "Adventure|Children|Fantasy", year: 1995 },
  { movieId: 3, title: "Grumpier Old Men (1995)", genres: "Comedy|Romance", year: 1995 },
  { movieId: 260, title: "Star Wars: Episode IV - A New Hope (1977)", genres: "Action|Adventure|Sci-Fi", year: 1977 },
  { movieId: 296, title: "Pulp Fiction (1994)", genres: "Comedy|Crime|Drama|Thriller", year: 1994 },
  { movieId: 318, title: "Shawshank Redemption, The (1994)", genres: "Crime|Drama", year: 1994 },
  { movieId: 356, title: "Forrest Gump (1994)", genres: "Comedy|Drama|Romance|War", year: 1994 },
  { movieId: 480, title: "Jurassic Park (1993)", genres: "Action|Adventure|Sci-Fi|Thriller", year: 1993 },
  { movieId: 2571, title: "Matrix, The (1999)", genres: "Action|Sci-Fi|Thriller", year: 1999 },
]

const SAMPLE_RATINGS: Rating[] = [
  { userId: 1, movieId: 1, rating: 4.0, timestamp: 964982703 },
  { userId: 1, movieId: 3, rating: 4.0, timestamp: 964981247 },
  { userId: 1, movieId: 6, rating: 4.0, timestamp: 964982224 },
  { userId: 2, movieId: 1, rating: 4.0, timestamp: 964982931 },
  { userId: 2, movieId: 2, rating: 3.0, timestamp: 964982400 },
  { userId: 2, movieId: 5, rating: 3.0, timestamp: 964982123 },
  { userId: 3, movieId: 260, rating: 5.0, timestamp: 964982931 },
  { userId: 3, movieId: 296, rating: 4.5, timestamp: 964982401 },
  { userId: 3, movieId: 318, rating: 5.0, timestamp: 964982405 },
  { userId: 3, movieId: 356, rating: 4.5, timestamp: 964982421 },
]

/* ------------------------------------------------------------------ */
/*  Cached results so we only parse the CSVs once per session         */
/* ------------------------------------------------------------------ */
let moviesCache: Movie[] | null = null
let ratingsCache: Rating[] | null = null

/* ------------------------------------------------------------------ */
/*  Utility functions                                                 */
/* ------------------------------------------------------------------ */
function parseYearFromTitle(title: string): { cleanTitle: string; year?: number } {
  const match = title.match(/\((\d{4})\)$/)
  if (match) {
    const year = Number.parseInt(match[1])
    const cleanTitle = title.replace(/\s*\(\d{4}\)$/, "")
    return { cleanTitle, year }
  }
  return { cleanTitle: title }
}

/* ------------------------------------------------------------------ */
/*  Public loaders – used by the API route                            */
/* ------------------------------------------------------------------ */
export async function loadMovies(): Promise<Movie[]> {
  if (moviesCache) return moviesCache

  try {
    const res = await fetch("/ml-latest-small/movies.csv")
    if (!res.ok) throw new Error("Failed to fetch movies.csv")

    const csv = await res.text()
    const [header, ...rows] = csv.split("\n").filter(Boolean)

    const headerMap = header.split(",") // ["movieId","title","genres"]

    moviesCache = rows.map((row) => {
      // Split on first two commas only (title itself can contain commas)
      const firstComma = row.indexOf(",")
      const secondComma = row.indexOf(",", firstComma + 1)
      const movieId = Number(row.slice(0, firstComma))
      const rawTitle = row.slice(firstComma + 1, secondComma).replace(/^"|"$/g, "")
      const genres = row.slice(secondComma + 1).replace(/^"|"$/g, "")

      const { cleanTitle, year } = parseYearFromTitle(rawTitle)

      return { movieId, title: rawTitle, genres, year }
    })

    return moviesCache
  } catch (err) {
    console.error("[loadMovies] CSV fetch failed – using fallback data:", err)
    moviesCache = SAMPLE_MOVIES
    return moviesCache
  }
}

export async function loadRatings(): Promise<Rating[]> {
  if (ratingsCache) return ratingsCache

  try {
    const res = await fetch("/ml-latest-small/ratings.csv")
    if (!res.ok) throw new Error("Failed to fetch ratings.csv")

    const csv = await res.text()
    const [, ...rows] = csv.split("\n").filter(Boolean)

    ratingsCache = rows.map((row) => {
      const [userId, movieId, rating, timestamp] = row.split(",")
      return {
        userId: Number(userId),
        movieId: Number(movieId),
        rating: Number(rating),
        timestamp: Number(timestamp),
      }
    })

    return ratingsCache
  } catch (err) {
    console.error("[loadRatings] CSV fetch failed – using fallback data:", err)
    ratingsCache = SAMPLE_RATINGS
    return ratingsCache
  }
}
