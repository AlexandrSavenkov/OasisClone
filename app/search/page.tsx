"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Phone, MessageCircle, ChevronDown, Loader2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"
import { fetchAllProductsWithPagination, type Product } from "@/lib/api"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [totalProducts, setTotalProducts] = useState(0)
  const [quantities, setQuantities] = useState<Record<string | number, number>>({})
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const { state, dispatch } = useCart()
  const { locale, setLocale, t, isRTL } = useLocale()

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        console.log("[v0] Loading all products page:", currentPage)
        const result = await fetchAllProductsWithPagination(currentPage)
        console.log("[v0] All products loaded:", result)
        setProducts(result.products)
        setTotalPages(2)
        setTotalProducts(result.totalProducts)
      } catch (error) {
        console.error("[v0] Error loading all products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [currentPage])

  const displayProducts = products

  const getQuantity = (productId: string | number) => {
    return quantities[productId] || 1
  }

  const handleQuantityChange = (productId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }))
  }

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

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Top Header */}
      <div className="text-white py-2 px-4" style={{ background: "linear-gradient(to right, #2871A5, #243464)" }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1 hover:text-blue-200 cursor-pointer"
              >
                <span>{t("header.language")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[120px]">
                  <button
                    onClick={() => {
                      setLocale("en")
                      setShowLanguageDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 cursor-pointer ${
                      locale === "en" ? "text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLocale("ar")
                      setShowLanguageDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 cursor-pointer ${
                      locale === "ar" ? "text-blue-600 font-medium" : "text-gray-700"
                    }`}
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

      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between min-h-[55px]">
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="https://oasisdirect.ae/Oasis_Direct_BLUE_EN.png?w=3840&q=75"
                  alt="Oasis Direct"
                  className="h-12 cursor-pointer"
                />
              </Link>
            </div>

            <div className="flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("header.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-600 hover:text-blue-600 border-0 shadow-none p-2"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent cursor-pointer">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("header.cart")}</span>
                  <Badge variant="secondary" className="ml-1">
                    {state.itemCount}
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav style={{ backgroundColor: "#F2F3F2" }} className="border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-12 py-6">
            <Link
              href="/s/water"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                <img
                  src="https://nfpc.imgix.net/files/1643925166059_image.png?fit=contain&h=45&w=45&auto=format,compress"
                  alt="Water"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.water")}</span>
            </Link>
            <Link
              href="/s/juice"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                <img
                  src="https://nfpc.imgix.net/files/1643925178667_image.png?fit=contain&h=45&w=45&auto=format,compress"
                  alt="Juice"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.juice")}</span>
            </Link>
            <Link
              href="/s/dairy"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                <img
                  src="https://nfpc.imgix.net/files/1643891145147_image.png?fit=contain&h=45&w=45&auto=format,compress"
                  alt="Dairy"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.dairy")}</span>
            </Link>
            <Link
              href="/s/accessories"
              className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-gray-600 hover:text-blue-600 hover:bg-white/50 cursor-pointer group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                <img
                  src="https://nfpc.imgix.net/files/1643891204025_image.png?fit=contain&h=45&w=45&auto=format,compress"
                  alt="Accessories"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="font-semibold text-lg">{t("nav.accessories")}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 cursor-pointer">
              Oasis Direct
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">All Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-900">
                All Products - {totalProducts} items available | Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <div className="relative mb-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={isRTL ? product.nameAr || product.name : product.name}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        />
                        {product.isNew && <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>}
                        {product.discount && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">{product.discount}</Badge>
                        )}
                      </div>
                    </Link>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {isRTL ? product.nameAr || product.name : product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-blue-600">AED {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">AED {product.originalPrice}</span>
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
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="fixed bottom-6 right-6 z-50">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      currentPage === 1
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                  >
                    1
                  </Button>
                  <Button
                    variant={currentPage === 2 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(2)}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      currentPage === 2
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                  >
                    2
                  </Button>
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">Page {currentPage} of 2</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
