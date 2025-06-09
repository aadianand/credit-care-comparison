import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, Users, Zap } from "lucide-react"
import { SearchInterface } from "@/components/search-interface"
import { creditCards } from "@/lib/credit-cards-data"
import { CreditCardGrid } from "@/components/credit-card-grid"

export default function HomePage() {
  const featuredCards = creditCards.slice(0, 6)
  const totalCards = creditCards.length
  const avgRating = (creditCards.reduce((sum, card) => sum + card.rating, 0) / totalCards).toFixed(1)
  const freeCards = creditCards.filter((card) => card.annualFee === 0).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">CreditCard AI</h1>
          </div>
          <p className="text-muted-foreground">
            Discover the best credit cards from Indian banks with AI-powered search
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalCards}</p>
                  <p className="text-sm text-muted-foreground">Credit Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{avgRating}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{freeCards}</p>
                  <p className="text-sm text-muted-foreground">Free Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Major Banks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Search Interface */}
        <SearchInterface />

        {/* Featured Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Credit Cards</h2>
            <Badge variant="outline">Updated Daily</Badge>
          </div>
          <CreditCardGrid cards={featuredCards} />
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose CreditCard AI?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Zap className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">AI-Powered Search</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions in natural language and get personalized recommendations
                </p>
              </div>
              <div className="text-center space-y-2">
                <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Smart Comparisons</h3>
                <p className="text-sm text-muted-foreground">
                  Compare multiple cards side-by-side with detailed analysis
                </p>
              </div>
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Expert Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get AI-generated summaries and recommendations for each card
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 CreditCard AI. Built with Next.js and AI SDK.</p>
            <p className="text-sm mt-2">
              Data is for demonstration purposes. Always verify with banks before applying.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
