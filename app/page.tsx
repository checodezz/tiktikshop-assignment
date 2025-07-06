"use client";

import { useState, useEffect } from "react";
import { Upload, Sparkles, ShoppingBag, User, Zap, AlertCircle, RefreshCw, ArrowRight, Star, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUpload from "@/components/image-upload";
import ClothingGallery from "@/components/clothing-gallery";
import TryOnResults from "@/components/tryon-results";
import ApiStatusChecker from "@/components/api-status-checker";
import type { ClothingItem, TryOnResult } from "@/types";

export default function VirtualTryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<"upload" | "select" | "results">("upload");
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [isLoadingClothes, setIsLoadingClothes] = useState(false);
  const [clothingError, setClothingError] = useState<string | null>(null);
  const [showExploreSection, setShowExploreSection] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);

  // Fetch clothing items when component mounts or when step changes to select
  useEffect(() => {
    if (activeStep === "select" && clothingItems.length === 0) {
      fetchClothingItems();
    }
  }, [activeStep, clothingItems.length]);

  const fetchClothingItems = async () => {
    console.log("Fetching clothing items...");
    setIsLoadingClothes(true);
    setClothingError(null);
    try {
      const response = await fetch("/api/clothing");
      console.log("API response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch clothing items: ${response.status}`);
      }
      const items = await response.json();
      console.log("Received items:", items);
      if (!Array.isArray(items)) {
        throw new Error("Invalid response format: expected array");
      }
      setClothingItems(items);
      console.log(`Successfully loaded ${items.length} clothing items`);
    } catch (error) {
      console.error("Error fetching clothing:", error);
      setClothingError(
        `Failed to load clothing items: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoadingClothes(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setUserImage(imageUrl);
    setActiveStep("select");
  };

  const handleClothingSelect = async (clothing: ClothingItem) => {
    console.log("Selected clothing item:", clothing);
    setSelectedClothing(clothing);
    if (!userImage) {
      setTryOnError("No user image available. Please upload a photo first.");
      return;
    }
    await processTryOn(userImage, clothing);
  };

  const processTryOn = async (userImageUrl: string, clothing: ClothingItem) => {
    setIsProcessing(true);
    setActiveStep("results");
    setTryOnError(null);
    try {
      // Fix: Ensure we get the correct clothing image URL
      let clothingImageUrl = clothing.image;
      // If image is not directly available, try to extract from originalData
      if (!clothingImageUrl && clothing.originalData?.imageUrls?.length > 0) {
        clothingImageUrl = clothing.originalData.imageUrls[0];
      }
      // If still no image, try other possible fields
      if (!clothingImageUrl && clothing.originalData?.image) {
        clothingImageUrl = clothing.originalData.image;
      }
      if (!clothingImageUrl) {
        throw new Error("No valid clothing image found");
      }

      console.log("Processing try-on with:", {
        userImage: userImageUrl,
        clothingImage: clothingImageUrl,
        clothingId: clothing.id,
      });

      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImage: userImageUrl,
          clothingId: clothing.id,
          clothingImage: clothingImageUrl, // Use the extracted URL
          clothingData: clothing.originalData,
        }),
      });

      const result = await response.json();
      console.log("Try-on API response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Try-on processing failed");
      }

      // Create result object
      const tryOnResult: TryOnResult = {
        id: Date.now().toString(),
        originalImage: userImageUrl,
        clothingItem: clothing,
        resultImage: result.result_image || "/placeholder.svg?height=600&width=400",
        confidence: result.confidence || 0.95,
        processingTime: result.processing_time || 3.2,
      };

      setTryOnResult(tryOnResult);
    } catch (error) {
      console.error("Try-on error:", error);
      setTryOnError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTryOn = () => {
    setUserImage(null);
    setSelectedClothing(null);
    setTryOnResult(null);
    setTryOnError(null);
    setActiveStep("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 shadow-lg shadow-purple-500/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
               TikTikShop
                </h1>
                <p className="text-sm text-gray-600 font-medium">AI-Powered Fashion Experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant="secondary" 
                className="hidden sm:flex bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-3 py-1"
              >
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              <Badge 
                variant="outline" 
                className="hidden sm:flex border-indigo-200 text-indigo-700 bg-indigo-50 px-3 py-1"
              >
                <Star className="h-3 w-3 mr-1" />
                Most trusted AI Try-On
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-8 mb-12">
          <div
            className={`flex items-center space-x-3 transition-all duration-500 ${
              activeStep === "upload"
                ? "text-purple-600 scale-110"
                : activeStep === "select" || activeStep === "results"
                ? "text-emerald-600"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                activeStep === "upload"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50"
                  : activeStep === "select" || activeStep === "results"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <User className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm">Upload Photo</span>
              <p className="text-xs text-gray-500">Start your journey</p>
            </div>
          </div>

          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden max-w-24">
            <div
              className={`h-full transition-all duration-700 ${
                activeStep === "select" || activeStep === "results"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 w-full"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 w-0"
              }`}
            />
          </div>

          <div
            className={`flex items-center space-x-3 transition-all duration-500 ${
              activeStep === "select"
                ? "text-purple-600 scale-110"
                : activeStep === "results"
                ? "text-emerald-600"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                activeStep === "select"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50"
                  : activeStep === "results"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm">Select Outfit</span>
              <p className="text-xs text-gray-500">Choose your style</p>
            </div>
          </div>

          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden max-w-24">
            <div
              className={`h-full transition-all duration-700 ${
                activeStep === "results"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 w-full"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 w-0"
              }`}
            />
          </div>

          <div
            className={`flex items-center space-x-3 transition-all duration-500 ${
              activeStep === "results" ? "text-purple-600 scale-110" : "text-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                activeStep === "results"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm">See Results</span>
              <p className="text-xs text-gray-500">Magic happens</p>
            </div>
          </div>
        </div>

        {/* Try-On Error Alert */}
        {tryOnError && (
          <Alert className="mb-8 max-w-2xl mx-auto border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Try-On Failed:</strong> {tryOnError}
              <Button
                variant="link"
                onClick={() =>
                  selectedClothing &&
                  userImage &&
                  processTryOn(userImage, selectedClothing)
                }
                className="ml-2 p-0 h-auto text-red-600 underline hover:text-red-700"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeStep === "upload" && (
            <div className="text-center animate-in fade-in-50 duration-700">
              <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl shadow-purple-500/10">
                <CardHeader className="pb-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Start Your Virtual Try-On Journey
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Upload your photo and discover how amazing you'll look in our curated fashion collection. 
                    Experience the future of online shopping with AI-powered virtual try-on technology.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ImageUpload onImageUpload={handleImageUpload} />
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                      <span className="font-medium text-emerald-700">High-quality AI processing</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                      <span className="font-medium text-blue-700">Instant results</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                      <span className="font-medium text-purple-700">Privacy protected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeStep === "select" && (
            <div className="animate-in fade-in-50 duration-700">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Choose Your Perfect Outfit
                </h2>
                <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-6">
                  Select from our curated collection and see how it looks on you instantly
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={resetTryOn}
                    className="bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={fetchClothingItems}
                    disabled={isLoadingClothes}
                    className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${isLoadingClothes ? "animate-spin" : ""}`}
                    />
                    Refresh Items
                  </Button>
                </div>
              </div>

              {clothingError && (
                <Alert className="mb-8 max-w-2xl mx-auto bg-red-50/80 backdrop-blur-sm border-red-200 shadow-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {clothingError}
                    <Button
                      variant="link"
                      onClick={fetchClothingItems}
                      className="ml-2 p-0 h-auto text-red-600 hover:text-red-700"
                    >
                      Try again
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {isLoadingClothes ? (
                <div className="text-center py-16">
                  <div className="relative mx-auto mb-6 w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center animate-spin">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    Loading amazing outfits for you...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
                      {clothingItems.length} Premium Items Available
                    </Badge>
                  </div>
                  <ClothingGallery
                    items={clothingItems}
                    onItemSelect={handleClothingSelect}
                    selectedItem={selectedClothing}
                  />
                </>
              )}
            </div>
          )}

          {activeStep === "results" && (
            <div className="animate-in fade-in-50 duration-700">
              <TryOnResults
                result={tryOnResult}
                isProcessing={isProcessing}
                onTryAnother={() => setActiveStep("select")}
                onStartOver={resetTryOn}
                clothingItems={clothingItems}
                onClothingSelect={handleClothingSelect}
                isLoadingClothes={isLoadingClothes}
                onFetchClothes={fetchClothingItems}
              />
            </div>
          )}

          {activeStep === "results" && (
            <>
              {/* Explore More Section */}
              {showExploreSection && (
                <div className="mt-16 border-t border-white/20 pt-12 animate-in fade-in-50 duration-700">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Explore More Styles
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      Try on more outfits with your current photo
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowExploreSection(false)}
                      className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
                    >
                      Hide Explore Section
                    </Button>
                  </div>
                  {isLoadingClothes ? (
                    <div className="text-center py-12">
                      <div className="relative mx-auto mb-4 w-12 h-12">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center animate-spin">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading more styles...</p>
                    </div>
                  ) : (
                    <ClothingGallery
                      items={clothingItems.filter(
                        (item) => item.id !== selectedClothing?.id
                      )}
                      onItemSelect={handleClothingSelect}
                      selectedItem={null}
                      showTryOnButton={true}
                      userImage={userImage}
                    />
                  )}
                </div>
              )}

              {/* Explore More Button */}
              {!showExploreSection && (
                <div className="text-center mt-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-purple-500/25 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setShowExploreSection(true);
                      if (clothingItems.length === 0) {
                        fetchClothingItems();
                      }
                    }}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Explore More Clothes
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* API Status Checker */}
      {/* <ApiStatusChecker /> */}
    </div>
  );
}
