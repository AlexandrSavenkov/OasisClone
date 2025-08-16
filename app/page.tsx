"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Search,
  ShoppingCart,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"
import { usePathname } from "next/navigation"
import { fetchAllProducts, searchProducts, type Product } from "@/lib/api"

const brands = [
  {
    name: "Lacnor",
    nameAr: "لاكنور",
    logo: "https://nfpc.imgix.net/brands/images/1643902462887_image.png?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    name: "Oasis",
    nameAr: "واحة",
    logo: "https://nfpc.imgix.net/brands/images/1643902490725_image.png?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    name: "Blu",
    nameAr: "بلو",
    logo: "https://nfpc.imgix.net/brands/images/1643902555681_image.png?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    name: "Melco",
    nameAr: "ميلكو",
    logo: "https://nfpc.imgix.net/brands/images/1643902514779_image.png?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    name: "Safa",
    nameAr: "صفا",
    logo: "https://nfpc.imgix.net/brands/images/1643902535448_image.png?fit=contain&auto=format%2Ccompress&w=3840",
  },
]

const heroSlides = [
  {
    image: "https://nfpc.imgix.net/files/1754035079537_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    image: "https://nfpc.imgix.net/files/1738236905803_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    image: "https://nfpc.imgix.net/files/1717584993128_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    image: "https://nfpc.imgix.net/files/1679559641776_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    image: "https://nfpc.imgix.net/files/1648479316883_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    image: "https://nfpc.imgix.net/files/1672728704985_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
  {
    image: "https://nfpc.imgix.net/files/1654455821015_image.jpg?fit=contain&auto=format%2Ccompress&w=3840",
  },
]

type SortOption = "featured" | "priceLowHigh" | "priceHighLow" | "newest" | "name"

export default function OasisDirectHomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [productQuantities, setProductQuantities] = useState<Record<string | number, number>>({})
  const searchRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { locale, setLocale, t, isRTL } = useLocale()

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        console.log("[v0] Loading products from API")
        const apiProducts = await fetchAllProducts()
        console.log("[v0] Products loaded:", apiProducts.length)
        setProducts(apiProducts)
        setFilteredProducts(sortProducts(apiProducts, sortBy))
      } catch (error) {
        console.error("[v0] Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (query.trim()) {
      console.log("[v0] Searching for:", query)
      const searchResults = await searchProducts(query)
      const sorted = sortProducts(searchResults, sortBy)
      setFilteredProducts(sorted)
    } else {
      const sorted = sortProducts(products, sortBy)
      setFilteredProducts(sorted)
    }
  }

  const sortProducts = (products: Product[], sortOption: SortOption) => {
    const sorted = [...products]

    switch (sortOption) {
      case "featured":
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
      case "priceLowHigh":
        return sorted.sort((a, b) => a.price - b.price)
      case "priceHighLow":
        return sorted.sort((a, b) => b.price - a.price)
      case "newest":
        return sorted.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime())
      case "name":
        return sorted.sort((a, b) => {
          const nameA = isRTL ? a.nameAr || a.name : a.name
          const nameB = isRTL ? b.nameAr || b.name : b.name
          return nameA.localeCompare(nameB)
        })
      default:
        return sorted
    }
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    const sorted = sortProducts(filteredProducts, newSort)
    setFilteredProducts(sorted)
  }

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

  const handleSearchMouseEnter = () => {
    setShowSearchDropdown(true)
  }

  const handleSearchMouseLeave = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.matches(":hover") && !searchRef.current?.matches(":hover")) {
        setShowSearchDropdown(false)
      }
    }, 100)
  }

  const handleDropdownMouseLeave = () => {
    setShowSearchDropdown(false)
  }

  const handleLanguageMouseLeave = () => {
    setTimeout(() => {
      if (!languageRef.current?.matches(":hover")) {
        setShowLanguageDropdown(false)
      }
    }, 100)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Top Header */}
      <div className="text-white py-2 px-4" style={{ background: "linear-gradient(to right, #2871A5, #243464)" }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1 hover:text-blue-200 cursor-pointer"
              >
                <span>{t("header.language")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showLanguageDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[120px]"
                  onMouseLeave={() =>
                    setTimeout(() => {
                      if (!languageRef.current?.matches(":hover")) {
                        setShowLanguageDropdown(false)
                      }
                    }, 100)
                  }
                >
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
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="https://oasisdirect.ae/Oasis_Direct_BLUE_EN.png?w=3840&q=75"
                  alt="Oasis Direct"
                  className="h-12 cursor-pointer"
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 relative">
              <div
                ref={searchRef}
                className="relative"
                onMouseEnter={() => setShowSearchDropdown(true)}
                onMouseLeave={() =>
                  setTimeout(() => {
                    if (!dropdownRef.current?.matches(":hover") && !searchRef.current?.matches(":hover")) {
                      setShowSearchDropdown(false)
                    }
                  }, 100)
                }
              >
                <Input
                  type="text"
                  placeholder={t("header.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-600 hover:text-blue-600 border-0 shadow-none p-2"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {showSearchDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto"
                  onMouseLeave={() => setShowSearchDropdown(false)}
                >
                  {/* Show All Button */}
                  <div className="p-3 border-b border-gray-100">
                    <Link href="/search">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-left p-3 hover:bg-blue-50 rounded-lg cursor-pointer"
                      >
                        <span className="text-blue-600 font-medium">
                          {t("search.showAll")} ({filteredProducts.length} {t("search.results")})
                        </span>
                        <ChevronDown className={`w-4 h-4 text-blue-600 ${isRTL ? "rotate-90" : "rotate-[-90deg]"}`} />
                      </Button>
                    </Link>
                  </div>

                  {/* Product Suggestions */}
                  <div className="py-2">
                    {filteredProducts.slice(0, 6).map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`}>
                        <div className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={isRTL ? product.nameAr || product.name : product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                              {isRTL ? product.nameAr || product.name : product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-blue-600">AED {product.price}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">AED {product.originalPrice}</span>
                              )}
                              {product.discount && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  {product.discount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {product.isNew && <Badge className="bg-red-500 text-white text-xs">{t("product.new")}</Badge>}
                        </div>
                      </Link>
                    ))}

                    {filteredProducts.length === 0 && !isLoading && (
                      <div className="px-3 py-6 text-center text-gray-500">
                        <p>{t("search.noResults")}</p>
                        <p className="text-sm mt-1">{t("search.tryAgain")}</p>
                      </div>
                    )}

                    {isLoading && (
                      <div className="px-3 py-6 text-center text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p>Loading products...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent cursor-pointer hover:bg-gray-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("header.cart")}</span>
                  <Badge variant="secondary" className="ml-1">
                    {cartState.itemCount}
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
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                pathname === "/s/water"
                  ? "text-blue-600 bg-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
              } cursor-pointer group`}
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
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                pathname === "/s/juice"
                  ? "text-blue-600 bg-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
              } cursor-pointer group`}
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
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                pathname === "/s/dairy"
                  ? "text-blue-600 bg-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
              } cursor-pointer group`}
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
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                pathname === "/s/accessories"
                  ? "text-blue-600 bg-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
              } cursor-pointer group`}
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

      {/* Hero Carousel */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative overflow-hidden rounded-lg h-[500px]">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0 h-full">
                  <div className="relative h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-lg overflow-hidden">
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white border-white/50 cursor-pointer p-2"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white border-white/50 cursor-pointer p-2"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Brand */}
      <section className="relative" style={{ backgroundColor: "#EEF7F1" }}>
        {/* Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="jss111 jss113"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 27}s`,
                animationDuration: `${20 + Math.random() * 14}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("section.shopByBrand")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {brands.map((brand, index) => (
              <div key={index} className="text-center">
                <Link href={`/b/${brand.name.toLowerCase()}`} className="block cursor-pointer">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src={brand.logo || "/placeholder.svg"}
                      alt={isRTL ? brand.nameAr : brand.name}
                      className="w-full h-16 object-contain mb-4"
                    />
                    <p className="font-medium text-gray-900">{isRTL ? brand.nameAr : brand.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Promotions */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("section.specialPromotions")}</h2>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={(value: SortOption) => handleSortChange(value)}>
                <SelectTrigger className="w-48 cursor-pointer">
                  <SelectValue placeholder={t("product.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured" className="cursor-pointer">
                    {t("product.sortBy.featured")}
                  </SelectItem>
                  <SelectItem value="priceLowHigh" className="cursor-pointer">
                    {t("product.sortBy.priceLowHigh")}
                  </SelectItem>
                  <SelectItem value="priceHighLow" className="cursor-pointer">
                    {t("product.sortBy.priceHighLow")}
                  </SelectItem>
                  <SelectItem value="newest" className="cursor-pointer">
                    {t("product.sortBy.newest")}
                  </SelectItem>
                  <SelectItem value="name" className="cursor-pointer">
                    {t("product.sortBy.name")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <div className="relative mb-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={isRTL ? product.nameAr || product.name : product.name}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        />
                        {product.isNew && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white">{t("product.new")}</Badge>
                        )}
                        {product.discount && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">{product.discount}</Badge>
                        )}
                      </div>
                    </Link>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer">
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
                          className="cursor-pointer bg-transparent"
                          onClick={() => handleQuantityChange(product.id, -1)}
                        >
                          -
                        </Button>
                        <span className="px-3 py-1 border rounded">{productQuantities[product.id] || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer bg-transparent"
                          onClick={() => handleQuantityChange(product.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
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

          <div className="text-center mt-8">
            <Link href="/search">
              <Button variant="outline" size="lg" className="cursor-pointer bg-transparent">
                {t("product.viewAll")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  )
}
