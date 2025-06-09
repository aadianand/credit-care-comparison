import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { creditCards, type CreditCard } from "./credit-cards-data"

// Check if OpenAI API key is available
const hasOpenAIKey = () => {
  return typeof process !== "undefined" && process.env.OPENAI_API_KEY
}

export async function searchCreditCards(query: string): Promise<{
  cards: CreditCard[]
  explanation: string
}> {
  // If no OpenAI key, use fallback search
  if (!hasOpenAIKey()) {
    return fallbackSearch(query)
  }

  try {
    const cardsData = JSON.stringify(
      creditCards.map((card) => ({
        id: card.id,
        name: card.name,
        bank: card.bank,
        type: card.type,
        annualFee: card.annualFee,
        loungeAccess: card.loungeAccess,
        fuelSurcharge: card.fuelSurcharge,
        cashbackRate: card.cashbackRate,
        benefits: card.benefits,
        eligibility: card.eligibility,
        rating: card.rating,
      })),
    )

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a credit card expert helping users find the best credit cards from Indian banks. 
      Analyze the user's query and return a JSON response with:
      1. "cardIds": array of card IDs that match the criteria (maximum 6 cards)
      2. "explanation": a brief explanation of why these cards were selected
      
      Available cards data: ${cardsData}
      
      Consider factors like:
      - Annual fees and joining fees
      - Cashback rates for different categories
      - Lounge access availability
      - Fuel surcharge benefits
      - Eligibility criteria
      - Card type (premium, mid-tier, entry-level)
      - Bank preferences
      
      Return only valid JSON without any markdown formatting.`,
      prompt: `Find credit cards matching this query: "${query}"`,
    })

    const response = JSON.parse(text)
    const matchedCards = creditCards.filter((card) => response.cardIds.includes(card.id))

    return {
      cards: matchedCards,
      explanation: response.explanation,
    }
  } catch (error) {
    console.error("AI search failed:", error)
    return fallbackSearch(query)
  }
}

// Fallback search function that works without AI
function fallbackSearch(query: string): {
  cards: CreditCard[]
  explanation: string
} {
  const lowercaseQuery = query.toLowerCase()
  let matchedCards: CreditCard[] = []
  let explanation = ""

  // Search for specific keywords and patterns
  if (lowercaseQuery.includes("lounge") && lowercaseQuery.includes("fuel")) {
    matchedCards = creditCards.filter((card) => card.loungeAccess && card.fuelSurcharge)
    explanation = "Found cards that offer both lounge access and fuel benefits."
  } else if (lowercaseQuery.includes("no annual fee") || lowercaseQuery.includes("free")) {
    matchedCards = creditCards.filter((card) => card.annualFee === 0)
    explanation = "Found cards with no annual fee."
  } else if (lowercaseQuery.includes("first-time") || lowercaseQuery.includes("beginner")) {
    matchedCards = creditCards.filter((card) => card.type === "entry-level" && card.eligibility.minIncome <= 300000)
    explanation = "Found entry-level cards suitable for first-time users."
  } else if (lowercaseQuery.includes("premium")) {
    matchedCards = creditCards.filter((card) => card.type === "premium")
    explanation = "Found premium credit cards with enhanced benefits."
  } else if (lowercaseQuery.includes("cashback")) {
    matchedCards = creditCards.filter((card) => Math.max(...Object.values(card.cashbackRate)) >= 4)
    explanation = "Found cards with high cashback rates."
  } else if (lowercaseQuery.includes("dining")) {
    matchedCards = creditCards.filter((card) => card.cashbackRate.dining >= 4)
    explanation = "Found cards with excellent dining rewards."
  } else if (lowercaseQuery.includes("fuel")) {
    matchedCards = creditCards.filter((card) => card.fuelSurcharge || card.cashbackRate.fuel >= 3)
    explanation = "Found cards with fuel benefits and cashback."
  } else if (lowercaseQuery.includes("shopping") || lowercaseQuery.includes("online")) {
    matchedCards = creditCards.filter((card) => card.cashbackRate.shopping >= 3)
    explanation = "Found cards with good shopping rewards."
  } else if (lowercaseQuery.includes("axis") && lowercaseQuery.includes("hdfc")) {
    matchedCards = creditCards.filter(
      (card) => card.bank.toLowerCase().includes("axis") || card.bank.toLowerCase().includes("hdfc"),
    )
    explanation = "Found cards from Axis Bank and HDFC Bank for comparison."
  } else {
    // General text search
    matchedCards = creditCards.filter(
      (card) =>
        card.name.toLowerCase().includes(lowercaseQuery) ||
        card.bank.toLowerCase().includes(lowercaseQuery) ||
        card.benefits.some((benefit) => benefit.toLowerCase().includes(lowercaseQuery)) ||
        card.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
    )
    explanation = `Found ${matchedCards.length} cards matching your search criteria.`
  }

  // If no matches, return top rated cards
  if (matchedCards.length === 0) {
    matchedCards = creditCards.sort((a, b) => b.rating - a.rating).slice(0, 3)
    explanation = "No exact matches found. Here are our top-rated credit cards."
  }

  return {
    cards: matchedCards.slice(0, 6),
    explanation: explanation,
  }
}

export async function generateCardSummary(card: CreditCard): Promise<string> {
  if (!hasOpenAIKey()) {
    return generateFallbackSummary(card)
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a credit card expert. Generate a concise 2-3 sentence summary highlighting the key benefits and ideal user profile for this credit card. Focus on what makes it unique and who should consider it.`,
      prompt: `Generate a summary for: ${JSON.stringify({
        name: card.name,
        bank: card.bank,
        type: card.type,
        annualFee: card.annualFee,
        cashbackRate: card.cashbackRate,
        benefits: card.benefits,
        eligibility: card.eligibility,
      })}`,
    })

    return text
  } catch (error) {
    console.error("AI summary failed:", error)
    return generateFallbackSummary(card)
  }
}

// Fallback summary generation
function generateFallbackSummary(card: CreditCard): string {
  const feeText = card.annualFee === 0 ? "with no annual fee" : `with ₹${card.annualFee.toLocaleString()} annual fee`
  const typeText = card.type === "premium" ? "premium" : card.type === "entry-level" ? "entry-level" : "mid-tier"
  const benefitText = card.loungeAccess ? "lounge access and " : ""
  const cashbackText =
    Math.max(...Object.values(card.cashbackRate)) >= 4 ? "high cashback rates" : "competitive rewards"

  return `The ${card.name} is a ${typeText} credit card ${feeText}, offering ${benefitText}${cashbackText}. Ideal for users with minimum income of ₹${card.eligibility.minIncome.toLocaleString()} seeking ${card.type === "premium" ? "premium benefits and exclusive privileges" : card.type === "entry-level" ? "simple rewards and easy approval" : "balanced features and good value"}.`
}

export async function compareCards(cardIds: string[]): Promise<string> {
  const cards = creditCards.filter((card) => cardIds.includes(card.id))

  if (!hasOpenAIKey()) {
    return generateFallbackComparison(cards)
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a credit card expert. Compare the given credit cards and provide a detailed analysis highlighting:
      1. Key differences in benefits and features
      2. Cost comparison (annual fees, joining fees)
      3. Reward rates and cashback structure
      4. Target audience for each card
      5. Recommendation based on different user profiles
      
      Be objective and highlight both pros and cons.`,
      prompt: `Compare these credit cards: ${JSON.stringify(
        cards.map((card) => ({
          name: card.name,
          bank: card.bank,
          annualFee: card.annualFee,
          joiningFee: card.joiningFee,
          cashbackRate: card.cashbackRate,
          benefits: card.benefits,
          eligibility: card.eligibility,
          loungeAccess: card.loungeAccess,
          rating: card.rating,
        })),
      )}`,
    })

    return text
  } catch (error) {
    console.error("AI comparison failed:", error)
    return generateFallbackComparison(cards)
  }
}

// Fallback comparison generation
function generateFallbackComparison(cards: CreditCard[]): string {
  if (cards.length < 2) return "Please select at least 2 cards for comparison."

  let comparison = "CREDIT CARD COMPARISON ANALYSIS\n\n"

  // Cost Analysis
  comparison += "💰 COST COMPARISON:\n"
  cards.forEach((card) => {
    comparison += `• ${card.name}: Annual Fee ₹${card.annualFee.toLocaleString()}, Joining Fee ₹${card.joiningFee.toLocaleString()}\n`
  })

  // Rewards Analysis
  comparison += "\n🎁 REWARDS & CASHBACK:\n"
  cards.forEach((card) => {
    const maxCashback = Math.max(...Object.values(card.cashbackRate))
    comparison += `• ${card.name}: Up to ${maxCashback}% cashback (Fuel: ${card.cashbackRate.fuel}%, Dining: ${card.cashbackRate.dining}%)\n`
  })

  // Benefits Analysis
  comparison += "\n✈️ KEY BENEFITS:\n"
  cards.forEach((card) => {
    const loungeText = card.loungeAccess ? "✓ Lounge Access" : "✗ No Lounge Access"
    const fuelText = card.fuelSurcharge ? "✓ Fuel Benefits" : "✗ No Fuel Benefits"
    comparison += `• ${card.name}: ${loungeText}, ${fuelText}\n`
  })

  // Eligibility
  comparison += "\n👥 ELIGIBILITY:\n"
  cards.forEach((card) => {
    comparison += `• ${card.name}: Min Income ₹${card.eligibility.minIncome.toLocaleString()}, Credit Score ${card.eligibility.creditScore}+\n`
  })

  // Recommendations
  comparison += "\n🎯 RECOMMENDATIONS:\n"
  const freeCard = cards.find((card) => card.annualFee === 0)
  const premiumCard = cards.find((card) => card.type === "premium")
  const highCashbackCard = cards.reduce((prev, current) =>
    Math.max(...Object.values(current.cashbackRate)) > Math.max(...Object.values(prev.cashbackRate)) ? current : prev,
  )

  if (freeCard) {
    comparison += `• For cost-conscious users: ${freeCard.name} offers good value with no annual fee\n`
  }
  if (premiumCard) {
    comparison += `• For premium benefits: ${premiumCard.name} provides exclusive privileges and lounge access\n`
  }
  comparison += `• For maximum rewards: ${highCashbackCard.name} offers the highest cashback rates\n`

  return comparison
}
