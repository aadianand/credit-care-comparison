// Credit card image mapping
export const creditCardImages: Record<string, string> = {
  "hdfc-regalia": "/images/hdfc-regalia.jpg",
  "axis-magnus": "/images/axis-magnus.jpg",
  "sbi-cashback": "/images/sbi-cashback.jpg",
  "icici-amazon-pay": "/images/icici-amazon-pay.jpg",
  "kotak-811": "/images/kotak-811.jpg",
  "yes-first-exclusive": "/images/yes-first-exclusive.jpg",
}

// Fallback images from Unsplash for demo purposes
export const fallbackImages: Record<string, string> = {
  "hdfc-regalia": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&crop=center",
  "axis-magnus": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center",
  "sbi-cashback": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&crop=center",
  "icici-amazon-pay": "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=250&fit=crop&crop=center",
  "kotak-811": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&crop=center&sat=-100",
  "yes-first-exclusive":
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center&hue=60",
}

export function getCreditCardImage(cardId: string): string {
  // First try to use custom image, then fallback to Unsplash
  return creditCardImages[cardId] || fallbackImages[cardId] || "/placeholder.svg?height=250&width=400"
}
