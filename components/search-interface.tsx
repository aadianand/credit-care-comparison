"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Loader2, MessageCircle, AlertTriangle, Info } from "lucide-react"
import { searchCreditCards } from "@/lib/ai-search"
import type { CreditCard } from "@/lib/credit-cards-data"
import { CreditCardGrid } from "./credit-card-grid"

const SAMPLE_QUERIES = [
  "Show me cards that offer lounge access and high cashback on fuel",
  "Best credit cards for first-time users with no annual fee",
  "Premium cards with dining benefits under ₹5000 annual fee",
  "Cards with highest cashback for online shopping",
  "Entry-level cards for students with low income requirements",
]

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    cards: CreditCard[]
    explanation: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  // Handle hydration safely
  useEffect(() => {
    setMounted(true)
    // Check for API key on client side only
    setHasApiKey(!!process.env.OPENAI_API_KEY)
  }, [])

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const searchResults = await searchCreditCards(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
      setError("Search failed. Using fallback search functionality.")

      // Still try to provide results using fallback
      try {
        const fallbackResults = await searchCreditCards(searchQuery)
        setResults(fallbackResults)
      } catch (fallbackError) {
        setError("Unable to perform search. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery)
    handleSearch(sampleQuery)
  }

  return (
    <div className="space-y-6">
      {/* API Key Status Alert - Only show after hydration */}
      {mounted && !hasApiKey && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> OpenAI API key not configured. The app will use smart fallback search
            functionality. To enable full AI features, add your OpenAI API key to the OPENAI_API_KEY environment
            variable.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Ask about credit cards in natural language
            {mounted && !hasApiKey && <Badge variant="outline">Fallback Mode</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Show me cards with lounge access and no annual fee"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={() => handleSearch()} disabled={isLoading || !query.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* Sample Queries */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUERIES.map((sampleQuery, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleSampleQuery(sampleQuery)}
                >
                  {sampleQuery}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{mounted && hasApiKey ? "AI Analysis:" : "Smart Search Results:"}</p>
                  <p className="text-muted-foreground">{results.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <CreditCardGrid cards={results.cards} />
        </div>
      )}
    </div>
  )
}
