"use client"

import { useState } from "react"
import { Search, Film } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Movie {
  movieId: number
  title: string
  genres: string
  year?: number
}

export default function MovieRecommendationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recommendationCount, setRecommendationCount] = useState([5])
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<string>("")
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const safeJson = async (res: Response) => {
    const isJson = res.headers.get("content-type")?.includes("application/json")
    return isJson ? res.json() : { error: await res.text() }
  }

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      toast({ title: "Please enter a movie title", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
      const data = await safeJson(res)
      setSearchResults(data.movies ?? [])
      setRecommendations([])
      setSelectedMovie("")
    } catch (e) {
      toast({ title: "Search failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getRecommendations = async (title: string) => {
    setLoading(true)
    setSelectedMovie(title)
    try {
      console.log(`Getting recommendations for: ${title}`)

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, count: recommendationCount[0] }),
      })

      const data = await safeJson(res)
      console.log("Recommendation response:", data)

      if (!res.ok) {
        throw new Error(data.error ?? "Unknown error")
      }

      setRecommendations(data.recommendations ?? [])

      if ((data.recommendations ?? []).length === 0) {
        toast({ title: "No recommendations found", variant: "destructive" })
      } else {
        toast({
          title: "Recommendations loaded",
          description: `Found ${data.recommendations.length} recommendations for "${title}"`,
        })
      }
    } catch (e: any) {
      console.error("Recommendation error:", e)
      toast({ title: "Recommendation failed", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="py-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Film className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Movie Recommender</h1>
          </div>
          <p className="text-lg text-gray-600">Search for movies and get recommendations!</p>
        </header>

        {/* Search */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" /> Search Movies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a movie title (e.g., 'Toy Story', 'Matrix', 'Star Wars')"
                onKeyDown={(e) => e.key === "Enter" && searchMovies()}
                className="flex-1"
              />
              <Button onClick={searchMovies} disabled={loading}>
                {loading ? "Searching…" : "Search"}
              </Button>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <Label htmlFor="count">Number of recommendations: {recommendationCount[0]}</Label>
              <Slider
                id="count"
                min={1}
                max={10}
                step={1}
                value={recommendationCount}
                onValueChange={setRecommendationCount}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Examples */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Try These Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => getRecommendations("Toy Story")} variant="outline" disabled={loading}>
                Get recommendations for "Toy Story"
              </Button>
              <Button onClick={() => getRecommendations("The Matrix")} variant="outline" disabled={loading}>
                Get recommendations for "The Matrix"
              </Button>
              <Button onClick={() => getRecommendations("Star Wars")} variant="outline" disabled={loading}>
                Get recommendations for "Star Wars"
              </Button>
              <Button onClick={() => getRecommendations("Forrest Gump")} variant="outline" disabled={loading}>
                Get recommendations for "Forrest Gump"
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length} found)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((m) => (
                  <Card
                    key={m.movieId}
                    onClick={() => getRecommendations(m.title)}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{m.title}</h3>
                      <div className="space-y-2">
                        {m.year && <div className="text-sm text-gray-600">Year: {m.year}</div>}
                        <div className="flex flex-wrap gap-1">
                          {m.genres
                            .split("|")
                            .slice(0, 3)
                            .map((genre, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                Recommendations for "{selectedMovie}" ({recommendations.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendations.map((m) => (
                  <Card key={m.movieId} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{m.title}</h3>
                      <div className="space-y-2">
                        {m.year && <div className="text-sm text-gray-600">Year: {m.year}</div>}
                        <div className="flex flex-wrap gap-1">
                          {m.genres
                            .split("|")
                            .slice(0, 3)
                            .map((genre, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {searchResults.length === 0 && recommendations.length === 0 && (
          <Card className="shadow-lg border-dashed">
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Get Started</h3>
              <p className="text-gray-600 mb-4">
                Try the example buttons above or search for movies like: Toy, Matrix, Star, Batman, Lion
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
