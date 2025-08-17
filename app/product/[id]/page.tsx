"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"
import {
  Search,
  ShoppingCart,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Send,
  PhoneIcon as Whatsapp,
  Mail,
  Minus,
  Plus,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Breadcrumb from "@/components/Breadcrumb"
import { fetchAllProducts, type Product } from "@/lib/api"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { locale, t, isRTL } = useLocale()

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      try {
        console.log("[v0] Loading product with ID:", params.id)
        const allProducts = await fetchAllProducts()
        console.log("[v0] All products loaded:", allProducts.length)

        const foundProduct = allProducts.find((p) => p.id.toString() === params.id)
        console.log("[v0] Found product:", foundProduct)

        if (foundProduct) {
          setProduct(foundProduct)
          // Get suggested products from same category
          const suggested = allProducts
            .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4)
          setSuggestedProducts(suggested)
        }
      } catch (error) {
        console.error("[v0] Error loading product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading product...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    const images = product.images || [product.image]
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = product.images || [product.image]
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCart = () => {
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

  const breadcrumbItems = [
    { label: "Oasis Direct", labelAr: "أوازيس دايركت", href: "/" },
    { label: product.category, labelAr: product.categoryAr || product.category, href: `/s/${product.category}` },
    { label: isRTL ? product.nameAr || product.name : product.name, labelAr: product.nameAr || product.name },
  ]

  const productImages = product.images || [product.image]

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="text-white py-2 px-4" style={{ background: "linear-gradient(to right, #2871A5, #243464)" }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="flex items-center gap-1 hover:text-blue-200 cursor-pointer">
                <span>{locale === "ar" ? "العربية" : "English"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
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
            <Link href="/" className="flex items-center">
              <img
                src="https://oasisdirect.ae/Oasis_Direct_BLUE_EN.png?w=3840&q=75"
                alt="Oasis Direct"
                className="h-12"
              />
            </Link>

            <div className="flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100 p-1"
                >
                  <Search className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
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

      <nav className="border-t" style={{ backgroundColor: "#F2F3F2" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-12 py-6">
            <Link
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
            </Link>
            <Link
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
            </Link>
            <Link
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
            </Link>
            <Link
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
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-blue-100 rounded-lg overflow-hidden aspect-square">
              {product.discount && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-pink-500 text-white px-6 py-3 rounded-lg transform -rotate-12 shadow-lg">
                    <div className="text-xl font-bold">Special Offer</div>
                    <div className="text-lg">{product.discount}</div>
                  </div>
                </div>
              )}

              <img
                src={productImages[currentImageIndex] || "/placeholder.svg"}
                alt={isRTL ? product.nameAr || product.name : product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${
                      index === currentImageIndex ? "border-blue-600" : "border-gray-200"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isRTL ? product.nameAr || product.name : product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">AED {product.originalPrice}</span>
                )}
                <span className="text-3xl font-bold text-green-600">AED {product.price}</span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">QTY</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseQuantity}
                    className="w-10 h-10 bg-transparent cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 border rounded-lg min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseQuantity}
                    className="w-10 h-10 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold mb-4 cursor-pointer"
              >
                ADD TO CART
              </Button>

              <div className="relative">
                <div className="text-sm font-medium text-gray-700 mb-2">Share</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="p-2 cursor-pointer">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 cursor-pointer">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 cursor-pointer">
                    <Send className="w-5 h-5 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 cursor-pointer">
                    <Whatsapp className="w-5 h-5 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 cursor-pointer">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      {suggestedProducts.length > 0 && (
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Suggested Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((suggestedProduct) => (
                <Card key={suggestedProduct.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Link href={`/product/${suggestedProduct.id}`} className="block cursor-pointer">
                      <div className="relative mb-4">
                        <img
                          src={suggestedProduct.image || "/placeholder.svg"}
                          alt={isRTL ? suggestedProduct.nameAr || suggestedProduct.name : suggestedProduct.name}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        />
                        {suggestedProduct.isNew && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>
                        )}
                        {suggestedProduct.discount && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                            {suggestedProduct.discount}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer">
                        {isRTL ? suggestedProduct.nameAr || suggestedProduct.name : suggestedProduct.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-green-600">AED {suggestedProduct.price}</span>
                        {suggestedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            AED {suggestedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-3 py-1 border rounded">1</span>
                        <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
