"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { ShoppingCart, Phone, MessageCircle, ChevronDown, Grid, List, ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Breadcrumb from "@/components/Breadcrumb"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"
import { fetchProductsByBrand, type Product } from "@/lib/api"

const validBrands = ["lacnor", "oasis", "blu", "melco", "safa"]

const brandInfo = {
  lacnor: {
    name: "Lacnor",
    nameAr: "لاكنور",
    logo: "https://nfpc.imgix.net/brands/images/1643902462887_image.png?fit=contain&auto=format%2Ccompress&w=3840",
    description: "Premium dairy and juice products from the UAE",
    descriptionAr: "منتجات الألبان والعصائر المميزة من دولة الإمارات العربية المتحدة",
  },
  oasis: {
    name: "Oasis",
    nameAr: "واحة",
    logo: "https://nfpc.imgix.net/brands/images/1643902490725_image.png?fit=contain&auto=format%2Ccompress&w=3840",
    description: "Pure water solutions for your home and office",
    descriptionAr: "حلول المياه النقية لمنزلك ومكتبك",
  },
  blu: {
    name: "Blu",
    nameAr: "بلو",
    logo: "https://nfpc.imgix.net/brands/images/1643902555681_image.png?fit=contain&auto=format%2Ccompress&w=3840",
    description: "Premium bottled water with exceptional purity",
    descriptionAr: "مياه معبأة مميزة بنقاء استثنائي",
  },
  melco: {
    name: "Melco",
    nameAr: "ميلكو",
    logo: "https://nfpc.imgix.net/brands/images/1643902514779_image.png?fit=contain&auto=format%2Ccompress&w=3840",
    description: "Natural spring water from pristine sources",
    descriptionAr: "مياه ينبوع طبيعية من مصادر نقية",
  },
  safa: {
    name: "Safa",
    nameAr: "صفا",
    logo: "https://nfpc.imgix.net/brands/images/1643902535448_image.png?fit=contain&auto=format%2Ccompress&w=3840",
    description: "Pure and refreshing water for everyday hydration",
    descriptionAr: "مياه نقية ومنعشة للترطيب اليومي",
  },
}

type SortOption = "featured" | "priceLowHigh" | "priceHighLow" | "newest" | "name"

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = params.brand
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [productQuantities, setProductQuantities] = useState<Record<string | number, number>>({})
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { locale, isRTL, t } = useLocale()

  if (!validBrands.includes(brand)) {
    notFound()
  }

  const info = brandInfo[brand as keyof typeof brandInfo]

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        console.log("[v0] Loading products for brand:", brand)
        const apiProducts = await fetchProductsByBrand(brand as keyof typeof import("@/lib/api").brandEndpoints)
        console.log("[v0] Brand products loaded:", apiProducts.length)
        setProducts(apiProducts)
      } catch (error) {
        console.error("[v0] Error loading brand products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [brand])

  useEffect(() => {
    let filtered = [...products]

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.nameAr && product.nameAr.includes(searchQuery)) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    switch (sortBy) {
      case "priceLowHigh":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "priceHighLow":
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
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, priceRange, sortBy, isRTL])

  const handleAddToCart = (product: Product) => {
    const quantity = productQuantities[product.id] || 1
    for (let i = 0; i < quantity; i++) {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: isRTL ? product.nameAr || product.name : product.name,
          price: product.price,
          originalPrice: product.originalPrice || undefined,
          image: product.image,
          category: product.category,
          brand: product.brand,
        },
      })
    }
  }

  const handleQuantityChange = (productId: string | number, change: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>{t("header.language")}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-4 h-4 cursor-pointer hover:text-blue-200" />
            <MessageCircle className="w-4 h-4 cursor-pointer hover:text-blue-200" />
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
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
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
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
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
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
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
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
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
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent cursor-pointer hover:bg-gray-50"
                onClick={() => (window.location.href = "/cart")}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t("header.cart")}</span>
                <Badge variant="secondary" className="ml-1">
                  {cartState.itemCount}
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

      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            {
              label: "Oasis Direct",
              labelAr: "أوازيس دايركت",
              href: "/",
            },
            {
              label: info.name,
              labelAr: info.nameAr,
            },
          ]}
        />
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`flex items-center gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <img src={info.logo || "/placeholder.svg"} alt={isRTL ? info.nameAr : info.name} className="h-20 w-auto" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{isRTL ? info.nameAr : info.name}</h1>
              <p className="text-gray-600">{isRTL ? info.descriptionAr : info.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50}
                  min={0}
                  step={0.5}
                  className="cursor-pointer"
                />
                <div className={`flex justify-between text-sm text-gray-600 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span>AED {priceRange[0]}</span>
                  <span>AED {priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{isRTL ? info.nameAr : info.name} Products</h2>
                <p className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-48 cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured" className="cursor-pointer">
                        Featured
                      </SelectItem>
                      <SelectItem value="priceLowHigh" className="cursor-pointer">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="priceHighLow" className="cursor-pointer">
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
                </div>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="border-r cursor-pointer"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setViewMode("list")}
                  >
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
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-3 md:p-4">
                      <div className="relative mb-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={isRTL ? product.nameAr || product.name : product.name}
                          className={`w-full object-cover rounded-lg cursor-pointer ${
                            viewMode === "grid" ? "h-40 md:h-48" : "h-32"
                          }`}
                          onClick={() => (window.location.href = `/product/${product.id}`)}
                        />
                        {product.isNew && <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>}
                        {product.discount && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">{product.discount}</Badge>
                        )}
                      </div>

                      <h3
                        className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer text-sm md:text-base"
                        onClick={() => (window.location.href = `/product/${product.id}`)}
                      >
                        {isRTL ? product.nameAr || product.name : product.name}
                      </h3>

                      <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className="text-base md:text-lg font-bold text-blue-600">AED {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            AED {product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-transparent h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(product.id, -1)}
                          >
                            -
                          </Button>
                          <span className="px-2 py-1 border rounded min-w-[32px] text-center text-sm">
                            {productQuantities[product.id] || 1}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer bg-transparent h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(product.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-xs md:text-sm px-2 md:px-4"
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

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  )
}
