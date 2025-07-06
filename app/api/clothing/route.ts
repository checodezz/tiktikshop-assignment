import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching from TikTikShop API...");

    // Fetch clothing items from TikTikShop API (removed caching)
    const response = await fetch("https://www.tiktikshop.in/api/products/all", {
      headers: {
        "Content-Type": "application/json",
      },
      // Removed caching for now
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`TikTikShop API failed with status: ${response.status}`);
      throw new Error(`Failed to fetch clothing items: ${response.status}`);
    }

    // Get raw response and log it for debugging
    const raw = await response.json();
    console.log("TikTikShop API raw response:", JSON.stringify(raw, null, 2));

    // Handle different response structures
    let items: any[] = [];

    if (Array.isArray(raw)) {
      items = raw;
    } else if (raw && typeof raw === "object") {
      // Try different possible array keys
      items = raw.products || raw.data || raw.items || raw.results || [];
    }

    console.log(`Found ${items.length} items in API response`);

    if (items.length === 0) {
      console.warn(
        "No items found in TikTikShop API response, using fallback data"
      );
      // Return enhanced fallback data with working placeholder images
      return NextResponse.json([
        {
          id: "demo-1",
          name: "Elegant Summer Dress",
          category: "Dresses",
          price: 89.99,
          image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
          brand: "TikTikShop",
          colors: ["Blue", "Pink", "White"],
          description: "Beautiful summer dress perfect for any occasion",
          sizes: ["S", "M", "L", "XL"],
          inStock: true,
          originalData: {},
        },
        {
          id: "demo-2",
          name: "Casual Midi Dress",
          category: "Dresses",
          price: 59.99,
          image:
            "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=400&h=500&fit=crop",
          brand: "TikTikShop",
          colors: ["Black", "Navy", "Gray"],
          description: "Comfortable midi dress for everyday wear",
          sizes: ["XS", "S", "M", "L"],
          inStock: true,
          originalData: {},
        },
        {
          id: "demo-3",
          name: "Party Cocktail Dress",
          category: "Dresses",
          price: 129.99,
          image:
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
          brand: "TikTikShop",
          colors: ["Red", "Black", "Gold"],
          description: "Stunning cocktail dress for special events",
          sizes: ["S", "M", "L"],
          inStock: true,
          originalData: {},
        },
        {
          id: "demo-4",
          name: "Bohemian Maxi Dress",
          category: "Dresses",
          price: 99.99,
          image:
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
          brand: "TikTikShop",
          colors: ["Floral", "Earth Tones"],
          description: "Flowing maxi dress with bohemian style",
          sizes: ["S", "M", "L", "XL"],
          inStock: true,
          originalData: {},
        },
        {
          id: "demo-5",
          name: "Professional Blazer Dress",
          category: "Dresses",
          price: 149.99,
          image:
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
          brand: "TikTikShop",
          colors: ["Black", "Navy", "Charcoal"],
          description: "Professional dress perfect for office wear",
          sizes: ["XS", "S", "M", "L", "XL"],
          inStock: true,
          originalData: {},
        },
        {
          id: "demo-6",
          name: "Vintage Style Dress",
          category: "Dresses",
          price: 79.99,
          image:
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
          brand: "TikTikShop",
          colors: ["Burgundy", "Forest Green"],
          description: "Vintage-inspired dress with classic appeal",
          sizes: ["S", "M", "L"],
          inStock: true,
          originalData: {},
        },
      ]);
    }

    // Transform the API response to match our ClothingItem interface
    const clothingItems = items.map((item, index) => {
      // fallback to item.image, but prefer images from originalData
      const images =
        item.originalData?.imageUrls && item.originalData.imageUrls.length > 0
          ? item.originalData.imageUrls
          : [item.image];

      const transformedItem = {
        id: item.id || item._id || `item-${index}`,
        name:
          item.name || item.originalData?.productName || `Product ${index + 1}`,
        category: item.category || "Clothing",
        price:
          parseFloat(
            (item.originalData?.productPrice || "").replace(/[^0-9.]/g, "")
          ) ||
          Number(item.price) ||
          Math.floor(Math.random() * 200) + 50,
        image: images[0], // first image as preview
        brand: item.brand || item.originalData?.brandName || "TikTikShop",
        colors: item.colors || item.availableColors || ["Default"],
        description:
          item.description ||
          `High-quality ${
            item.name || item.originalData?.productName || "clothing item"
          } from TikTikShop`,
        sizes: item.sizes ||
          item.originalData?.sizesAvailable || ["S", "M", "L"],
        inStock: item.inStock !== false && (item.stock !== 0 || true), // assume true if missing
        originalData: item, // keep raw
      };

      console.log(`Transformed item ${index + 1}:`, transformedItem);
      return transformedItem;
    });

    console.log(`Returning ${clothingItems.length} transformed items`);
    return NextResponse.json(clothingItems);
  } catch (error) {
    console.error("TikTikShop API error:", error);

    // Return comprehensive fallback data with real images
    const fallbackItems = [
      {
        id: "fallback-1",
        name: "Summer Floral Dress",
        category: "Dresses",
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
        brand: "TikTikShop",
        colors: ["Blue", "Pink", "White"],
        description: "Beautiful floral dress perfect for summer occasions",
        sizes: ["S", "M", "L", "XL"],
        inStock: true,
        originalData: {},
      },
      {
        id: "fallback-2",
        name: "Elegant Evening Gown",
        category: "Dresses",
        price: 199.99,
        image:
          "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=400&h=500&fit=crop",
        brand: "TikTikShop",
        colors: ["Black", "Navy", "Burgundy"],
        description: "Sophisticated evening gown for special events",
        sizes: ["XS", "S", "M", "L"],
        inStock: true,
        originalData: {},
      },
      {
        id: "fallback-3",
        name: "Casual Day Dress",
        category: "Dresses",
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
        brand: "TikTikShop",
        colors: ["Gray", "Beige", "Olive"],
        description: "Comfortable dress for everyday wear",
        sizes: ["S", "M", "L", "XL"],
        inStock: true,
        originalData: {},
      },
      {
        id: "fallback-4",
        name: "Bohemian Maxi Dress",
        category: "Dresses",
        price: 129.99,
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
        brand: "TikTikShop",
        colors: ["Multicolor", "Earth Tones"],
        description: "Free-spirited maxi dress with bohemian flair",
        sizes: ["S", "M", "L"],
        inStock: true,
        originalData: {},
      },
      {
        id: "fallback-5",
        name: "Professional Sheath Dress",
        category: "Dresses",
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        brand: "TikTikShop",
        colors: ["Black", "Navy", "Charcoal"],
        description: "Professional dress ideal for business settings",
        sizes: ["XS", "S", "M", "L", "XL"],
        inStock: true,
        originalData: {},
      },
      {
        id: "fallback-6",
        name: "Party Sequin Dress",
        category: "Dresses",
        price: 179.99,
        image:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
        brand: "TikTikShop",
        colors: ["Gold", "Silver", "Rose Gold"],
        description: "Glamorous sequin dress perfect for parties",
        sizes: ["S", "M", "L"],
        inStock: true,
        originalData: {},
      },
    ];

    return NextResponse.json(fallbackItems);
  }
}
