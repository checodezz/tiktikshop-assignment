"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sparkles,
  ShoppingBag,
  User,
  Zap,
  AlertCircle,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  X,
  Check,
  Star,
  Shield,
  Clock,
  ArrowRight,
  Download,
  Share2,
  Heart,
} from "lucide-react";

// Mock data for clothing items
const mockClothingItems = [
  {
    id: "1",
    name: "Summer Floral Dress",
    price: "$89.99",
    brand: "TikTikShop",
    image: "/api/placeholder/300/400",
    rating: 4.8,
    reviews: 234,
    category: "Dresses",
    originalData: { imageUrls: ["/api/placeholder/300/400"] }
  },
  {
    id: "2",
    name: "Casual Denim Jacket",
    price: "$124.99",
    brand: "TikTikShop",
    image: "/api/placeholder/300/400",
    rating: 4.9,
    reviews: 456,
    category: "Jackets",
    originalData: { imageUrls: ["/api/placeholder/300/400"] }
  },
  {
    id: "3",
    name: "Elegant Blazer",
    price: "$159.99",
    brand: "TikTikShop",
    image: "/api/placeholder/300/400",
    rating: 4.7,
    reviews: 189,
    category: "Blazers",
    originalData: { imageUrls: ["/api/placeholder/300/400"] }
  },
  {
    id: "4",
    name: "Boho Maxi Skirt",
    price: "$69.99",
    brand: "TikTikShop",
    image: "/api/placeholder/300/400",
    rating: 4.6,
    reviews: 342,
    category: "Skirts",
    originalData: { imageUrls: ["/api/placeholder/300/400"] }
  },
  {
    id: "5",
    name: "Vintage Band Tee",
    price: "$34.99",
    brand: "TikTikShop",
    image: "/api/placeholder/300/400",
    rating: 4.5,
    reviews: 567,
    category: "T-Shirts",
    originalData: { imageUrls: ["/api/placeholder/300/400"] }
  },
  {
    id: "6",
    name: "Silk Evening Gown",
    price: "$299.99",
    brand: "TikTikShop",
    image: "/api/placeholder/300/400",
    rating: 4.9,
    reviews: 123,
    category: "Gowns",
    originalData: { imageUrls: ["/api/placeholder/300/400"] }
  }
];

// Enhanced Image Upload Component
const PremiumImageUpload = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onImageUpload(URL.createObjectURL(file));
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <div className="text-sm">{uploadProgress}%</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your image here, or click to browse
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                <Upload className="h-5 w-5 inline mr-2" />
                Choose Photo
              </button>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>JPG, PNG, WEBP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Max 10MB</span>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
          Pro Tips for Best Results
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use a clear, full-body photo with good lighting</li>
          <li>• Stand straight with arms at your sides</li>
          <li>• Avoid busy backgrounds or patterns</li>
          <li>• Make sure your outfit is visible and not too loose</li>
        </ul>
      </div>
    </div>
  );
};

// Enhanced Clothing Gallery Component
const PremiumClothingGallery = ({ items, onItemSelect, selectedItem }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
            selectedItem?.id === item.id ? 'ring-2 ring-purple-500' : ''
          }`}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => onItemSelect(item)}
        >
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute bottom-4 left-4 right-4">
                <button className="w-full bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-white transition-colors">
                  <Sparkles className="h-4 w-4 inline mr-2" />
                  Try On Now
                </button>
              </div>
            </div>

            {/* Favorite Button */}
            <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {item.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
              <span className="text-lg font-bold text-purple-600">{item.price}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{item.brand}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
                <span className="text-sm text-gray-500">({item.reviews})</span>
              </div>
              
              {selectedItem?.id === item.id && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced Try-On Results Component
const PremiumTryOnResults = ({ result, isProcessing, onTryAnother, onStartOver }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (isProcessing) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-200 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Creating Your Look</h3>
          <p className="text-gray-600 mb-6">Our AI is working its magic...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This usually takes 3-5 seconds</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6">We couldn't process your try-on request</p>
        <button
          onClick={onTryAnother}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">✨ Your Virtual Try-On Result</h2>
        <p className="text-gray-600">See how amazing you look in your new outfit!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Before Image */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Before</h3>
          <div className="relative rounded-xl overflow-hidden bg-white shadow-lg">
            <img
              src={result.originalImage}
              alt="Original"
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">Original Photo</span>
            </div>
          </div>
        </div>

        {/* After Image */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">After</h3>
          <div className="relative rounded-xl overflow-hidden bg-white shadow-lg">
            <img
              src={result.resultImage}
              alt="Try-on result"
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full">
              <span className="text-sm font-medium">With {result.clothingItem.name}</span>
            </div>
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{Math.round(result.confidence * 100)}% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={onTryAnother}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
        >
          <ShoppingBag className="h-5 w-5 inline mr-2" />
          Try Another Outfit
        </button>
        
        <button
          onClick={onStartOver}
          className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-purple-400 transition-colors"
        >
          <Upload className="h-5 w-5 inline mr-2" />
          Upload New Photo
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Share2 className="h-5 w-5 inline mr-2" />
            Share
          </button>
          
          {showShareMenu && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border p-2 z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Share to Social</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Copy Link</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Download Image</button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{Math.round(result.confidence * 100)}%</div>
            <div className="text-sm text-gray-600">Fit Confidence</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{result.processingTime}s</div>
            <div className="text-sm text-gray-600">Processing Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{result.clothingItem.price}</div>
            <div className="text-sm text-gray-600">Item Price</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function EnhancedVirtualTryOn() {
  const [userImage, setUserImage] = useState(null);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState("upload");
  const [clothingItems, setClothingItems] = useState(mockClothingItems);

  const handleImageUpload = (imageUrl) => {
    setUserImage(imageUrl);
    setActiveStep("select");
  };

  const handleClothingSelect = async (clothing) => {
    setSelectedClothing(clothing);
    setIsProcessing(true);
    setActiveStep("results");

    // Simulate processing
    setTimeout(() => {
      const mockResult = {
        id: Date.now().toString(),
        originalImage: userImage,
        clothingItem: clothing,
        resultImage: "/api/placeholder/400/600",
        confidence: 0.95,
        processingTime: 3.2,
      };
      setTryOnResult(mockResult);
      setIsProcessing(false);
    }, 3000);
  };

  const resetTryOn = () => {
    setUserImage(null);
    setSelectedClothing(null);
    setTryOnResult(null);
    setActiveStep("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Premium Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TikTikShop
                </h1>
                {/* <p className="text-xs text-gray-500">Find It. Try It. Buy It.</p> */}
                {/* <p className="text-xs text-gray-500">Delivering in 30 mins</p> */}

              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                ✨ Premium
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-6 mb-12">
          {[
            { key: "upload", icon: User, label: "Upload Photo" },
            { key: "select", icon: ShoppingBag, label: "Select Outfit" },
            { key: "results", icon: Sparkles, label: "See Results" }
          ].map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep === step.key
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : ["select", "results"].includes(activeStep) && index < 2
                      ? "bg-green-500 text-white"
                      : activeStep === "results" && index === 2
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  activeStep === step.key ? "text-purple-600" : "text-gray-500"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < 2 && (
                <div className="w-16 h-1 mx-4 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (activeStep === "select" && index === 0) ||
                      (activeStep === "results" && index < 2)
                        ? "bg-green-500 w-full"
                        : "bg-gray-200 w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeStep === "upload" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">
                  Start Your Virtual Try-On Journey
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Upload your photo and see how amazing you look in any outfit
                </p>
              </div>
              <PremiumImageUpload onImageUpload={handleImageUpload} />
            </div>
          )}

          {activeStep === "select" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  Choose Your Perfect Style
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Select from our premium collection of trending outfits
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetTryOn}
                    className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-purple-400 transition-colors"
                  >
                    <Upload className="h-5 w-5 inline mr-2" />
                    Change Photo
                  </button>
                </div>
              </div>

              <PremiumClothingGallery
                items={clothingItems}
                onItemSelect={handleClothingSelect}
                selectedItem={selectedClothing}
              />
            </div>
          )}

          {activeStep === "results" && (
            <PremiumTryOnResults
              result={tryOnResult}
              isProcessing={isProcessing}
              onTryAnother={() => setActiveStep("select")}
              onStartOver={resetTryOn}
            />
          )}
        </div>
      </div>
    </div>
  );
}