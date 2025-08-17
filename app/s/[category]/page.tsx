"use client"

import { useState, useEffect, useMemo } from "react"
import { notFound, useRouter } from "next/navigation"
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
  const { locale, setLocale, isRTL, t } = useLocale()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [quantities, setQuantities] = useState<Record<string | number, number>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

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
        quantity: quantity,
      },
    })
  }

  const handleQuantityChange = (productId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }))
  }

  const getQuantity = (productId: string | number) => quantities[productId] || 1

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="text-white py-2 px-4" style={{ background: "linear-gradient(to right, #2871A5, #243464)" }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="flex items-center gap-1 hover:text-blue-200 cursor-pointer"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <span>{t("header.language")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                    onClick={() => {
                      setLocale("en")
                      setShowLanguageDropdown(false)
                    }}
                  >
                    English
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                    onClick={() => {
                      setLocale("ar")
                      setShowLanguageDropdown(false)
                    }}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-4 h-4 cursor-pointer hover:text-blue-200" />
            <MessageCircle className="w-4 h-4 cursor-pointer hover:text-blue-200" />
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm" style={{ minHeight: "55px" }}>
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
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("header.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="/cart" className="cursor-pointer">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("header.cart")}</span>
                  <Badge variant="secondary" className="ml-1">
                    {state.itemCount}
                  </Badge>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-t" style={{ backgroundColor: "#F2F3F2" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-12 py-6">
            <a
              href="/s/water"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                <img
                  alt="Water"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  src="https://nfpc.imgix.net/files/1643925166059_image.png?fit=contain&h=45&w=45&auto=format,compress"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.water")}</span>
            </a>
            <a
              href="/s/juice"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                <img
                  alt="Juice"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  src="https://nfpc.imgix.net/files/1643925178667_image.png?fit=contain&h=45&w=45&auto=format,compress"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.juice")}</span>
            </a>
            <a
              href="/s/dairy"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                <img
                  alt="Dairy"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  src="https://nfpc.imgix.net/files/1643891145147_image.png?fit=contain&h=45&w=45&auto=format,compress"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.dairy")}</span>
            </a>
            <a
              href="/s/accessories"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                <img
                  alt="Accessories"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  src="https://nfpc.imgix.net/files/1643891204025_image.png?fit=contain&h=45&w=45&auto=format,compress"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.accessories")}</span>
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
                      <div className="relative mb-4" onClick={() => handleProductClick(product)}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={isRTL ? product.nameAr || product.name : product.name}
                          className="w-full h-40 md:h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        {product.isNew && <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>}
                        {product.discount && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">{product.discount}</Badge>
                        )}
                      </div>

                      <h3
                        className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm md:text-base cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleProductClick(product)}
                      >
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
                          onClick={() => handleAddToCart(product)}
                        >
                          {t("product.addToCart")}
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
    </div>
  )
}
