import { NextResponse } from "next/server"
import { movies } from "./data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  const results = movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8)

  return NextResponse.json({ movies: results })
}
