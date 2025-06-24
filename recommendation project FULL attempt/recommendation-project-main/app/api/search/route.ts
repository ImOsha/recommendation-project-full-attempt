import { type NextRequest, NextResponse } from "next/server"
import { movies } from "../recommend/movies-data"

// Hard-coded movie data for testing
const MOVIES = [
  {
    movieId: 1,
    title: "Toy Story (1995)",
    genres: "Adventure|Animation|Children|Comedy|Fantasy",
    year: 1995,
    avgRating: 3.9,
  },
  {
    movieId: 2,
    title: "Jumanji (1995)",
    genres: "Adventure|Children|Fantasy",
    year: 1995,
    avgRating: 3.2,
  },
  {
    movieId: 3,
    title: "The Matrix (1999)",
    genres: "Action|Sci-Fi|Thriller",
    year: 1999,
    avgRating: 4.3,
  },
  {
    movieId: 4,
    title: "Star Wars: Episode IV - A New Hope (1977)",
    genres: "Action|Adventure|Sci-Fi",
    year: 1977,
    avgRating: 4.2,
  },
  {
    movieId: 5,
    title: "Lord of the Rings: The Fellowship of the Ring (2001)",
    genres: "Adventure|Fantasy",
    year: 2001,
    avgRating: 4.2,
  },
  {
    movieId: 6,
    title: "Batman (1989)",
    genres: "Action|Crime|Thriller",
    year: 1989,
    avgRating: 3.4,
  },
  {
    movieId: 7,
    title: "Forrest Gump (1994)",
    genres: "Comedy|Drama|Romance|War",
    year: 1994,
    avgRating: 4.0,
  },
  {
    movieId: 8,
    title: "Pulp Fiction (1994)",
    genres: "Comedy|Crime|Drama|Thriller",
    year: 1994,
    avgRating: 4.3,
  },
  {
    movieId: 9,
    title: "The Shawshank Redemption (1994)",
    genres: "Crime|Drama",
    year: 1994,
    avgRating: 4.4,
  },
  {
    movieId: 10,
    title: "Jurassic Park (1993)",
    genres: "Action|Adventure|Sci-Fi|Thriller",
    year: 1993,
    avgRating: 3.7,
  },
]

export async function GET(req: NextRequest) {
  console.log("=== SEARCH API CALLED ===")

  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.trim()

    if (!query) {
      console.log("No query provided, returning empty results")
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    console.log(`Query parameter: "${query}"`)
    console.log(`Available movies: ${movies.length}`)

    const results = movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase())).slice(0, 20)

    console.log(`Found ${results.length} results`)
    console.log(
      "Results:",
      results.map((r) => r.title),
    )

    return NextResponse.json({
      movies: results,
      total: results.length,
      query: query,
      debug: {
        searchTerm: query,
        totalMovies: movies.length,
        foundResults: results.length,
      },
    })
  } catch (err: any) {
    console.error("Search API error:", err)
    return NextResponse.json(
      { error: "Internal server error", details: err?.message ?? "Unknown error" },
      { status: 500 },
    )
  }
}
