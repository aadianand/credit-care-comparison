"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Plane, Fuel, CreditCardIcon, TrendingUp, ContrastIcon as Compare } from "lucide-react"
import type { CreditCard } from "@/lib/credit-cards-data"
import { CreditCardModal } from "./credit-card-modal"
import { ComparisonModal } from "./comparison-modal"

interface CreditCardGridProps {
  cards: CreditCard[]
}

export function CreditCardGrid({ cards }: CreditCardGridProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const toggleComparison = (cardId: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : prev.length < 3 ? [...prev, cardId] : prev,
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CreditCardIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No credit cards found matching your criteria.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {selectedForComparison.length > 0 && (
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compare className="h-5 w-5" />
                  <span className="font-medium">{selectedForComparison.length} card(s) selected for comparison</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedForComparison([])}>
                    Clear
                  </Button>
                  <Button onClick={() => setShowComparison(true)} disabled={selectedForComparison.length < 2}>
                    Compare Cards
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                selectedForComparison.includes(card.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{card.bank}</p>
                  </div>
                  <Badge variant={card.type === "premium" ? "default" : "secondary"}>{card.type}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{card.rating}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=128&width=320"
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Annual Fee:</span>
                    <span className="font-medium">
                      {card.annualFee === 0 ? "Free" : formatCurrency(card.annualFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Reward Rate:</span>
                    <span className="font-medium">{card.rewardRate}x</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {card.loungeAccess && (
                    <Badge variant="outline" className="text-xs">
                      <Plane className="h-3 w-3 mr-1" />
                      Lounge Access
                    </Badge>
                  )}
                  {card.fuelSurcharge && (
                    <Badge variant="outline" className="text-xs">
                      <Fuel className="h-3 w-3 mr-1" />
                      Fuel Benefits
                    </Badge>
                  )}
                  {card.cashbackRate.fuel > 3 && (
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      High Cashback
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setSelectedCard(card)}>
                    View Details
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => toggleComparison(card.id)}>
                    {selectedForComparison.includes(card.id) ? "Remove from" : "Add to"} Compare
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedCard && (
        <CreditCardModal card={selectedCard} isOpen={!!selectedCard} onClose={() => setSelectedCard(null)} />
      )}

      {showComparison && (
        <ComparisonModal
          cardIds={selectedForComparison}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  )
}
