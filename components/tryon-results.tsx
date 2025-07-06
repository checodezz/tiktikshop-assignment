"use client"

import { useState } from "react"
import { Download, Share2, ShoppingCart, RotateCcw, Sparkles, Clock, Target, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TryOnResult, ClothingItem } from "@/types"
import Image from "next/image"
import ExploreSection from "@/components/explore-section"

interface TryOnResultsProps {
  result: TryOnResult | null
  isProcessing: boolean
  onTryAnother: () => void
  onStartOver: () => void
  clothingItems?: ClothingItem[]
  onClothingSelect?: (item: ClothingItem) => void
  isLoadingClothes?: boolean
  onFetchClothes?: () => void
}

export default function TryOnResults({
  result,
  isProcessing,
  onTryAnother,
  onStartOver,
  clothingItems = [],
  onClothingSelect,
  isLoadingClothes = false,
  onFetchClothes,
}: TryOnResultsProps) {
  const [progress, setProgress] = useState(0)
  const [showExploreSection, setShowExploreSection] = useState(false)

  // Simulate processing progress
  if (isProcessing && progress < 100) {
    setTimeout(() => setProgress((prev) => Math.min(prev + 10, 100)), 200)
  }

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="text-center">
            <div className="mb-6">
              <Sparkles className="h-16 w-16 text-purple-600 mx-auto animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Creating Your Virtual Try-On</h2>
            <p className="text-gray-600 mb-6">Our AI is working its magic...</p>

            <div className="max-w-md mx-auto mb-6">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Analyzing your photo</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Fitting the garment</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Finalizing results</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center">
        <Card className="max-w-md mx-auto p-8">
          <CardContent>
            <p className="text-gray-600">No results to display yet.</p>
            <Button onClick={onStartOver} className="mt-4">
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Virtual Try-On Results</h2>
        <p className="text-gray-600">See how you look in your selected outfit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Before/After Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Original Photo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={result.originalImage || "/placeholder.svg"}
              alt="Original"
              width={400}
              height={600}
              className="w-full rounded-lg object-cover"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>With {result.clothingItem.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={result.resultImage || "/placeholder.svg"}
              alt="Try-on result"
              width={400}
              height={600}
              className="w-full rounded-lg object-cover"
            />
          </CardContent>
        </Card>
      </div>

      {/* Result Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Try-On Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Fit Confidence</p>
                <p className="text-sm text-gray-600">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Processing Time</p>
                <p className="text-sm text-gray-600">{result.processingTime}s</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Item Price</p>
                <p className="text-sm text-gray-600">${result.clothingItem.price}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>

        <Button size="lg" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Image
        </Button>

        <Button size="lg" variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Result
        </Button>

        <Button size="lg" variant="outline" onClick={onTryAnother}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Another Outfit
        </Button>

        <Button size="lg" variant="ghost" onClick={onStartOver}>
          Start Over
        </Button>
      </div>

      {/* Explore More Button */}
      {!showExploreSection && (
        <div className="text-center mb-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            onClick={() => {
              setShowExploreSection(true)
              if (clothingItems.length === 0 && onFetchClothes) {
                onFetchClothes()
              }
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Explore More Clothes
          </Button>
        </div>
      )}

      {/* Explore Section */}
      {showExploreSection && result && onClothingSelect && (
        <ExploreSection
          items={clothingItems}
          onItemSelect={onClothingSelect}
          currentItem={result.clothingItem}
          userImage={result.originalImage}
          isLoading={isLoadingClothes}
          onClose={() => setShowExploreSection(false)}
        />
      )}
    </div>
  )
}
