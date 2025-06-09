import { getCreditCardImage } from "./credit-card-images"

export interface CreditCard {
  id: string
  name: string
  bank: string
  type: "premium" | "mid-tier" | "entry-level"
  annualFee: number
  joiningFee: number
  rewardRate: number
  welcomeBonus: string
  loungeAccess: boolean
  fuelSurcharge: boolean
  cashbackRate: {
    fuel: number
    dining: number
    shopping: number
    general: number
  }
  benefits: string[]
  eligibility: {
    minIncome: number
    minAge: number
    creditScore: number
  }
  features: string[]
  image: string
  rating: number
  priceHistory: {
    date: string
    annualFee: number
    offer: string
  }[]
}

export const creditCards: CreditCard[] = [
  {
    id: "hdfc-regalia",
    name: "HDFC Bank Regalia Credit Card",
    bank: "HDFC Bank",
    type: "premium",
    annualFee: 2500,
    joiningFee: 2500,
    rewardRate: 4,
    welcomeBonus: "10,000 reward points on spending ₹1L in first 90 days",
    loungeAccess: true,
    fuelSurcharge: true,
    cashbackRate: {
      fuel: 3.3,
      dining: 4,
      shopping: 2,
      general: 1,
    },
    benefits: [
      "Domestic airport lounge access - 12 visits per year",
      "International airport lounge access - 6 visits per year",
      "Fuel surcharge waiver up to ₹500 per month",
      "Movie ticket discounts",
      "Dining privileges at partner restaurants",
    ],
    eligibility: {
      minIncome: 600000,
      minAge: 21,
      creditScore: 750,
    },
    features: [
      "Zero forex markup on international transactions",
      "EMI conversion facility",
      "Reward points never expire",
      "Comprehensive insurance coverage",
    ],
    image: getCreditCardImage("hdfc-regalia"),
    rating: 4.2,
    priceHistory: [
      { date: "2024-01", annualFee: 2500, offer: "Standard pricing" },
      { date: "2023-12", annualFee: 2500, offer: "Fee waiver on ₹3L spend" },
      { date: "2023-06", annualFee: 2000, offer: "Limited time reduced fee" },
    ],
  },
  {
    id: "axis-magnus",
    name: "Axis Bank Magnus Credit Card",
    bank: "Axis Bank",
    type: "premium",
    annualFee: 12500,
    joiningFee: 12500,
    rewardRate: 12,
    welcomeBonus: "25,000 Edge Miles on spending ₹1.5L in first 45 days",
    loungeAccess: true,
    fuelSurcharge: true,
    cashbackRate: {
      fuel: 2,
      dining: 5,
      shopping: 4,
      general: 1.2,
    },
    benefits: [
      "Unlimited domestic airport lounge access",
      "International airport lounge access - 8 visits per year",
      "Golf privileges at premium courses",
      "Concierge services",
      "Travel insurance up to ₹1 crore",
    ],
    eligibility: {
      minIncome: 1500000,
      minAge: 21,
      creditScore: 800,
    },
    features: [
      "Accelerated reward earning",
      "Transfer miles to airline partners",
      "Priority customer service",
      "Exclusive lifestyle benefits",
    ],
    image: getCreditCardImage("axis-magnus"),
    rating: 4.5,
    priceHistory: [
      { date: "2024-01", annualFee: 12500, offer: "Standard pricing" },
      { date: "2023-12", annualFee: 12500, offer: "Fee waiver on ₹15L spend" },
      { date: "2023-06", annualFee: 10000, offer: "Launch offer pricing" },
    ],
  },
  {
    id: "sbi-cashback",
    name: "SBI Cashback Credit Card",
    bank: "State Bank of India",
    type: "entry-level",
    annualFee: 999,
    joiningFee: 999,
    rewardRate: 5,
    welcomeBonus: "₹2,000 cashback on spending ₹15,000 in first 90 days",
    loungeAccess: false,
    fuelSurcharge: true,
    cashbackRate: {
      fuel: 5,
      dining: 5,
      shopping: 1,
      general: 1,
    },
    benefits: [
      "5% cashback on online spends",
      "1% cashback on all other spends",
      "Fuel surcharge waiver",
      "Movie ticket discounts",
      "Dining offers",
    ],
    eligibility: {
      minIncome: 200000,
      minAge: 18,
      creditScore: 650,
    },
    features: [
      "No annual fee for first year",
      "Simple cashback structure",
      "Wide acceptance",
      "Easy application process",
    ],
    image: getCreditCardImage("sbi-cashback"),
    rating: 4.0,
    priceHistory: [
      { date: "2024-01", annualFee: 999, offer: "First year free" },
      { date: "2023-12", annualFee: 999, offer: "First year free" },
      { date: "2023-06", annualFee: 799, offer: "Reduced fee promotion" },
    ],
  },
  {
    id: "icici-amazon-pay",
    name: "ICICI Amazon Pay Credit Card",
    bank: "ICICI Bank",
    type: "entry-level",
    annualFee: 0,
    joiningFee: 0,
    rewardRate: 5,
    welcomeBonus: "₹2,000 Amazon Pay balance on approval",
    loungeAccess: false,
    fuelSurcharge: false,
    cashbackRate: {
      fuel: 2,
      dining: 2,
      shopping: 5,
      general: 1,
    },
    benefits: [
      "5% cashback on Amazon purchases for Prime members",
      "2% cashback on Amazon purchases for non-Prime members",
      "2% cashback on bill payments",
      "1% cashback on other purchases",
      "No annual fee ever",
    ],
    eligibility: {
      minIncome: 300000,
      minAge: 21,
      creditScore: 700,
    },
    features: [
      "Lifetime free card",
      "Instant approval for existing customers",
      "Amazon Pay integration",
      "Easy reward redemption",
    ],
    image: getCreditCardImage("icici-amazon-pay"),
    rating: 4.3,
    priceHistory: [
      { date: "2024-01", annualFee: 0, offer: "Lifetime free" },
      { date: "2023-12", annualFee: 0, offer: "Lifetime free" },
      { date: "2023-06", annualFee: 0, offer: "Lifetime free" },
    ],
  },
  {
    id: "kotak-811",
    name: "Kotak 811 #Dream Different Credit Card",
    bank: "Kotak Mahindra Bank",
    type: "entry-level",
    annualFee: 500,
    joiningFee: 500,
    rewardRate: 4,
    welcomeBonus: "₹500 cashback on first transaction",
    loungeAccess: false,
    fuelSurcharge: true,
    cashbackRate: {
      fuel: 4,
      dining: 4,
      shopping: 2,
      general: 1,
    },
    benefits: [
      "4% cashback on bill payments and recharges",
      "2% cashback on grocery and pharmacy",
      "1% cashback on all other spends",
      "Fuel surcharge waiver",
      "Zero liability on lost card",
    ],
    eligibility: {
      minIncome: 180000,
      minAge: 18,
      creditScore: 650,
    },
    features: [
      "Digital-first application",
      "Instant virtual card",
      "Mobile-first experience",
      "Quick approval process",
    ],
    image: getCreditCardImage("kotak-811"),
    rating: 3.8,
    priceHistory: [
      { date: "2024-01", annualFee: 500, offer: "Fee waiver on ₹50K spend" },
      { date: "2023-12", annualFee: 500, offer: "Fee waiver on ₹50K spend" },
      { date: "2023-06", annualFee: 0, offer: "Launch offer - free for 6 months" },
    ],
  },
  {
    id: "yes-first-exclusive",
    name: "YES FIRST Exclusive Credit Card",
    bank: "YES Bank",
    type: "mid-tier",
    annualFee: 2999,
    joiningFee: 2999,
    rewardRate: 6,
    welcomeBonus: "10,000 reward points on spending ₹90,000 in first 90 days",
    loungeAccess: true,
    fuelSurcharge: true,
    cashbackRate: {
      fuel: 3,
      dining: 6,
      shopping: 3,
      general: 1.5,
    },
    benefits: [
      "Domestic airport lounge access - 8 visits per year",
      "International airport lounge access - 2 visits per year",
      "Dining privileges at partner restaurants",
      "Movie ticket discounts",
      "Golf privileges",
    ],
    eligibility: {
      minIncome: 500000,
      minAge: 21,
      creditScore: 720,
    },
    features: [
      "Accelerated rewards on dining",
      "Flexible reward redemption",
      "Travel insurance coverage",
      "Concierge services",
    ],
    image: getCreditCardImage("yes-first-exclusive"),
    rating: 4.1,
    priceHistory: [
      { date: "2024-01", annualFee: 2999, offer: "Standard pricing" },
      { date: "2023-12", annualFee: 2999, offer: "Fee waiver on ₹2L spend" },
      { date: "2023-06", annualFee: 1999, offer: "Promotional pricing" },
    ],
  },
]
