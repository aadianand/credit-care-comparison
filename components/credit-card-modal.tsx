"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Plane, Fuel, TrendingUp, Users, Shield, Gift, History, Info } from "lucide-react"
import type { CreditCard } from "@/lib/credit-cards-data"
import { generateCardSummary } from "@/lib/ai-search"

interface CreditCardModalProps {
  card: CreditCard
  isOpen: boolean
  onClose: () => void
}

export function CreditCardModal({ card, isOpen, onClose }: CreditCardModalProps) {
  const [aiSummary, setAiSummary] = useState<string>("")
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHasApiKey(!!process.env.OPENAI_API_KEY)
  }, [])

  useEffect(() => {
    if (isOpen && card) {
      setLoadingSummary(true)
      generateCardSummary(card)
        .then(setAiSummary)
        .catch(() => setAiSummary("Unable to generate summary at this time."))
        .finally(() => setLoadingSummary(false))
    }
  }, [isOpen, card])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {card.name}
            <Badge variant={card.type === "premium" ? "default" : "secondary"}>{card.type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=320"
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{card.rating}/5</span>
                    <span className="text-muted-foreground">({card.bank})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Annual Fee</p>
                      <p className="font-medium">{card.annualFee === 0 ? "Free" : formatCurrency(card.annualFee)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Joining Fee</p>
                      <p className="font-medium">{card.joiningFee === 0 ? "Free" : formatCurrency(card.joiningFee)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reward Rate</p>
                      <p className="font-medium">{card.rewardRate}x points</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Income</p>
                      <p className="font-medium">{formatCurrency(card.eligibility.minIncome)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {card.loungeAccess && (
                      <Badge variant="outline">
                        <Plane className="h-3 w-3 mr-1" />
                        Lounge Access
                      </Badge>
                    )}
                    {card.fuelSurcharge && (
                      <Badge variant="outline">
                        <Fuel className="h-3 w-3 mr-1" />
                        Fuel Benefits
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {mounted && hasApiKey ? "AI Summary" : "Smart Summary"}
                {mounted && !hasApiKey && (
                  <Badge variant="outline" className="text-xs">
                    Fallback Mode
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && !hasApiKey && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Summary generated using smart algorithms. Enable AI features by adding OpenAI API key.
                  </AlertDescription>
                </Alert>
              )}
              {loadingSummary ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-muted-foreground">{aiSummary}</p>
              )}
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="cashback">Cashback</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="history">Price History</TabsTrigger>
            </TabsList>

            <TabsContent value="benefits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Key Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-medium text-sm">Welcome Bonus</p>
                    <p className="text-sm text-muted-foreground">{card.welcomeBonus}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cashback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Cashback Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Fuel</span>
                        <span className="font-medium">{card.cashbackRate.fuel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Dining</span>
                        <span className="font-medium">{card.cashbackRate.dining}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Shopping</span>
                        <span className="font-medium">{card.cashbackRate.shopping}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">General</span>
                        <span className="font-medium">{card.cashbackRate.general}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eligibility" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Minimum Annual Income</span>
                      <span className="font-medium">{formatCurrency(card.eligibility.minIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Minimum Age</span>
                      <span className="font-medium">{card.eligibility.minAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Credit Score Required</span>
                      <span className="font-medium">{card.eligibility.creditScore}+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Additional Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Price & Offer History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {card.priceHistory.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{entry.date}</p>
                          <p className="text-sm text-muted-foreground">{entry.offer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(entry.annualFee)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
