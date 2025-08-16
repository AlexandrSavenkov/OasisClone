"use client"

import { useState, useEffect, useMemo } from "react"
import { notFound } from "next/navigation"
import { ShoppingCart, Phone, MessageCircle, ChevronDown, Grid, List, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Breadcrumb from "@/components/Breadcrumb"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"
import { fetchProductsByCategory, type Product } from "@/lib/api"

const validCategories = ["water", "juice", "dairy", "accessories"]

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category
  const { state, dispatch } = useCart()
  const { locale, isRTL, t } = useLocale()

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [quantities, setQuantities] = useState<Record<string | number, number>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if (!validCategories.includes(category)) {
    notFound()
  }

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        console.log("[v0] Loading products for category:", category)
        const apiProducts = await fetchProductsByCategory(
          category as keyof typeof import("@/lib/api").categoryEndpoints,
        )
        console.log("[v0] Category products loaded:", apiProducts.length)
        setProducts(apiProducts)
      } catch (error) {
        console.error("[v0] Error loading category products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [category])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.nameAr && product.nameAr.includes(searchQuery))
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesPrice
    })

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime())
        break
      case "name":
        filtered.sort((a, b) => {
          const nameA = isRTL ? a.nameAr || a.name : a.name
          const nameB = isRTL ? b.nameAr || b.name : b.name
          return nameA.localeCompare(nameB)
        })
        break
      default:
        // Keep original order for featured
        break
    }

    return filtered
  }, [products, searchQuery, sortBy, priceRange, isRTL])

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: isRTL ? product.nameAr || product.name : product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          brand: product.brand,
        },
      })
    }
  }

  const handleQuantityChange = (productId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }))
  }

  const getQuantity = (productId: string | number) => quantities[productId] || 1

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header - Same as main page */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4 cursor-pointer">
            <span>{t("header.language")}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-4 h-4 cursor-pointer" />
            <MessageCircle className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="cursor-pointer">
                <img
                  src="https://oasisdirect.ae/Oasis_Direct_BLUE_EN.png?w=3840&q=75"
                  alt="Oasis Direct"
                  className="h-12"
                />
              </a>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <a
                  href="/s/water"
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${category === "water" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <img
                    src="https://nfpc.imgix.net/files/1643925166059_image.png?fit=contain&h=45&w=45&auto=format,compress"
                    alt="Water"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  <span className="font-medium text-sm md:text-base">{t("nav.water")}</span>
                </a>
                <a
                  href="/s/juice"
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${category === "juice" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <img
                    src="https://nfpc.imgix.net/files/1643925178667_image.png?fit=contain&h=45&w=45&auto=format,compress"
                    alt="Juice"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  <span className="font-medium text-sm md:text-base">{t("nav.juice")}</span>
                </a>
                <a
                  href="/s/dairy"
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${category === "dairy" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <img
                    src="https://nfpc.imgix.net/files/1643891145147_image.png?fit=contain&h=45&w=45&auto=format,compress"
                    alt="Dairy"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  <span className="font-medium text-sm md:text-base">{t("nav.dairy")}</span>
                </a>
                <a
                  href="/s/accessories"
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${category === "accessories" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <img
                    src="https://nfpc.imgix.net/files/1643891204025_image.png?fit=contain&h=45&w=45&auto=format,compress"
                    alt="Accessories"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  <span className="font-medium text-sm md:text-base">{t("nav.accessories")}</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t("header.cart")}</span>
                <Badge variant="secondary" className="ml-1">
                  {state.itemCount}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <a
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
            >
              <img
                src="https://oasisdirect.ae/Oasis_Direct_BLUE_EN.png?w=3840&q=75"
                alt="Oasis Direct"
                className="w-6 h-6"
              />
              <span className="font-medium">Oasis Direct</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Category Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Oasis Direct", href: "/" }, { label: categoryTitle }]} />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">FILTER BY</h3>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Price (AED)</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={1}
                  className="mb-2 cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>AED {priceRange[0]}</span>
                  <span>AED {priceRange[1]}+</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Brand</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 cursor-pointer" />
                    <span className="text-sm">Oasis</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 cursor-pointer" />
                    <span className="text-sm">Lacnor</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 cursor-pointer" />
                    <span className="text-sm">Blu</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {isRTL ? `${categoryTitle} متألق` : `Sparkling ${categoryTitle}`}
                </h1>
                <p className="text-sm text-gray-600">
                  Showing {filteredAndSortedProducts.length} of {products.length} products
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured" className="cursor-pointer">
                      Sort By
                    </SelectItem>
                    <SelectItem value="price-low" className="cursor-pointer">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high" className="cursor-pointer">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest" className="cursor-pointer">
                      Newest First
                    </SelectItem>
                    <SelectItem value="name" className="cursor-pointer">
                      Name A-Z
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button variant="ghost" size="sm" className="border-r cursor-pointer">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-3 md:p-4">
                      <div className="relative mb-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={isRTL ? product.nameAr || product.name : product.name}
                          className="w-full h-40 md:h-48 object-cover rounded-lg"
                        />
                        {product.isNew && <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>}
                        {product.discount && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">{product.discount}</Badge>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
                        {isRTL ? product.nameAr || product.name : product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base md:text-lg font-bold text-blue-600">AED {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            AED {product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-transparent h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(product.id, getQuantity(product.id) - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-2 py-1 border rounded min-w-[32px] text-center text-sm">
                            {getQuantity(product.id)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-transparent h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(product.id, getQuantity(product.id) + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-xs md:text-sm px-2 md:px-4"
                          onClick={() => {
                            for (let i = 0; i < getQuantity(product.id); i++) {
                              handleAddToCart(product)
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 cursor-pointer bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setPriceRange([0, 100])
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Same as main page */}
      
    </div>
  )
}
