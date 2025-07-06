"use client";

import { useState, useMemo } from "react";
import { Heart, Palette, Package, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClothingItem } from "@/types";

interface ClothingGalleryProps {
  items: ClothingItem[];
  onItemSelect: (item: ClothingItem) => void;
  selectedItem: ClothingItem | null;
  showTryOnButton?: boolean;
  userImage?: string | null;
}

export default function ClothingGallery({
  items,
  onItemSelect,
  selectedItem,
  showTryOnButton = false,
  userImage = null,
}: ClothingGalleryProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 20;

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  console.log('items:', items);

  const handleImageError = (itemId: string) => {
    console.log(`Image failed to load for item: ${itemId}`);
    setImageErrors((prev) => new Set(prev).add(itemId));
  };

  const handleImageLoad = (itemId: string) => {
    console.log(`Image loaded successfully for item: ${itemId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  console.log("ClothingGallery received items:", items);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No items available
        </h3>
        <p className="text-gray-500">
          Please check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Items count and pagination info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length} items
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item, index) => (
          <Card
            key={`${item.id}-${index}`}
            className={`group cursor-pointer transition-all duration-200 hover:shadow-lg pt-0${
              selectedItem?.id === item.id
                ? "ring-2 ring-purple-500 shadow-lg"
                : ""
            } ${!item.inStock ? "opacity-75" : ""}`}
            onClick={() => item.inStock && onItemSelect(item)}
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                {imageErrors.has(item.id) ? (
                  <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Image not available</p>
                      <p className="text-xs text-gray-400 mt-1">{item.name}</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={
                      item?.originalData?.imageUrls?.[0] ||
                      item.image ||
                      "https://via.placeholder.com/400x500?text=Image+Not+Available"
                    }
                    alt={item.name}
                    className="w-full h-150 object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={() => handleImageError(item.id)}
                    onLoad={() => handleImageLoad(item.id)}
                    loading="eager"
                    style={{ display: "block" }}
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.has(item.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <Badge variant="secondary" className="bg-white/90">
                    {item.category}
                  </Badge>
                  {!item.inStock && (
                    <Badge
                      variant="destructive"
                      className="bg-red-500/90 text-white"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-">
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-lg leading-tight truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    {item.description && (
                      <p
                        className="text-xs text-gray-500 mt-1 line-clamp-2"
                        title={item.description}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-lg">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    {item.colors && item.colors.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Palette className="h-3 w-3" />
                        <span>
                          {item.colors.slice(0, 2).join(", ")}
                          {item.colors.length > 2 &&
                            ` +${item.colors.length - 2}`}
                        </span>
                      </div>
                    )}
                    {item.sizes && item.sizes.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{item.sizes.slice(0, 3).join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!item.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.inStock) {
                        onItemSelect(item);
                      }
                    }}
                  >
                    {showTryOnButton && userImage
                      ? "Try On Now"
                      : item.inStock
                      ? "Try On"
                      : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className={`min-w-[40px] ${
                  currentPage === pageNumber
                    ? "bg-purple-600 hover:bg-purple-700"
                    : ""
                }`}
              >
                {pageNumber}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}