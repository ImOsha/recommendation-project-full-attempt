import { NextResponse, type NextRequest } from "next/server"
import { movies } from "./movies-data"
import { getRecommendations } from "./utils"

export async function POST(req: NextRequest) {
  try {
    const { title, count = 20 } = (await req.json()) as { title?: string; count?: number }

    if (!title) {
      return NextResponse.json({ error: "Movie title is required" }, { status: 400 })
    }

    const target = movies.find((m) => m.title.toLowerCase().includes(title.trim().toLowerCase()))
    if (!target) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    const recommendations = getRecommendations(target, movies, count)

    return NextResponse.json({ recommendations })
  } catch (err: any) {
    // Always return valid JSON on error
    return NextResponse.json(
      { error: "Internal server error", details: err?.message ?? "Unknown error" },
      { status: 500 },
    )
  }
}
