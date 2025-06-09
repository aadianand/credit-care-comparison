"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ContrastIcon as Compare, Loader2, Info } from "lucide-react"
import { creditCards } from "@/lib/credit-cards-data"
import { compareCards } from "@/lib/ai-search"

interface ComparisonModalProps {
  cardIds: string[]
  isOpen: boolean
  onClose: () => void
}

export function ComparisonModal({ cardIds, isOpen, onClose }: ComparisonModalProps) {
  const [comparison, setComparison] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  const cards = creditCards.filter((card) => cardIds.includes(card.id))

  useEffect(() => {
    setMounted(true)
    setHasApiKey(!!process.env.OPENAI_API_KEY)
  }, [])

  useEffect(() => {
    if (isOpen && cardIds.length >= 2) {
      setLoading(true)
      compareCards(cardIds)
        .then(setComparison)
        .catch(() => setComparison("Unable to generate comparison at this time."))
        .finally(() => setLoading(false))
    }
  }, [isOpen, cardIds])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compare className="h-5 w-5" />
            Credit Card Comparison
            {mounted && !hasApiKey && (
              <Badge variant="outline" className="text-xs">
                Fallback Mode
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      {cards.map((card) => (
                        <th key={card.id} className="text-left p-2 min-w-[200px]">
                          <div>
                            <p className="font-medium">{card.name}</p>
                            <p className="text-xs text-muted-foreground">{card.bank}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Annual Fee</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.annualFee === 0 ? "Free" : formatCurrency(card.annualFee)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Joining Fee</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.joiningFee === 0 ? "Free" : formatCurrency(card.joiningFee)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Reward Rate</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.rewardRate}x
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Fuel Cashback</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.cashbackRate.fuel}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Dining Cashback</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.cashbackRate.dining}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Lounge Access</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.loungeAccess ? (
                            <Badge variant="outline" className="text-xs">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No
                            </Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Min Income</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {formatCurrency(card.eligibility.minIncome)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Rating</td>
                      {cards.map((card) => (
                        <td key={card.id} className="p-2">
                          {card.rating}/5
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>
                {mounted && hasApiKey ? "AI Analysis & Recommendation" : "Smart Analysis & Recommendation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && !hasApiKey && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Analysis generated using smart algorithms. Enable AI features by adding OpenAI API key.
                  </AlertDescription>
                </Alert>
              )}
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating detailed comparison...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{comparison}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
