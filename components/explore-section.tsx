"use client"

import { useState } from "react"
import { ShoppingBag, X, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ClothingGallery from "@/components/clothing-gallery"
import type { ClothingItem } from "@/types"

interface ExploreSectionProps {
  items: ClothingItem[]
  onItemSelect: (item: ClothingItem) => void
  currentItem?: ClothingItem | null
  userImage: string | null
  isLoading: boolean
  onClose: () => void
}

export default function ExploreSection({
  items,
  onItemSelect,
  currentItem,
  userImage,
  isLoading,
  onClose,
}: ExploreSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")

  // Get unique categories
  const categories = Array.from(new Set(items.map((item) => item.category)))

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    // Exclude current item
    if (currentItem && item.id === currentItem.id) return false

    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Category filter
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false
    }

    // Price range filter
    if (priceRange !== "all") {
      const price = item.price
      switch (priceRange) {
        case "under-50":
          return price < 50
        case "50-100":
          return price >= 50 && price <= 100
        case "100-200":
          return price > 100 && price <= 200
        case "over-200":
          return price > 200
        default:
          return true
      }
    }

    return true
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange("all")
  }

  return (
    <div className="mt-12 border-t pt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <ShoppingBag className="h-6 w-6 mr-2 text-purple-600" />
                Explore More Styles
              </CardTitle>
              <p className="text-gray-600 mt-1">Try on more outfits with your current photo</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for clothes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50">Under ₹50</SelectItem>
                  <SelectItem value="50-100">₹50 - ₹100</SelectItem>
                  <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                  <SelectItem value="over-200">Over ₹200</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || selectedCategory !== "all" || priceRange !== "all") && (
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredItems.length} of {items.length} items
                {currentItem && " (excluding current item)"}
              </span>
              {filteredItems.length === 0 && <span className="text-orange-600">Try adjusting your filters</span>}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading more styles...</p>
            </div>
          ) : (
            /* Clothing Gallery */
            <ClothingGallery
              items={filteredItems}
              onItemSelect={onItemSelect}
              selectedItem={null}
              showTryOnButton={true}
              userImage={userImage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
