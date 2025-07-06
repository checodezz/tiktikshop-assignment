export interface ClothingItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  brand: string
  colors: string[]
  description?: string
  sizes?: string[]
  inStock?: boolean
  originalData?: any // Store original API response for reference
}

export interface TryOnResult {
  id: string
  originalImage: string
  clothingItem: ClothingItem
  resultImage: string
  confidence: number
  processingTime: number
}
