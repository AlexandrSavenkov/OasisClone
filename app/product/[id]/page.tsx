"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Breadcrumb from "@/components/Breadcrumb"

// Mock product data matching the screenshot
const productData = {
  1: {
    id: 1,
    name: "Bulk Offer Oasis Still 330 ml Pack of 24 (Bundle of 2 Packs)",
    price: 22.85,
    originalPrice: 28.56,
    images: ["/oasis-water-bottles-pack.png", "/oasis-water-bottles-carton.png"],
    category: "water",
    brand: "oasis",
    isNew: false,
    discount: "20%",
    description:
      "Premium Oasis still water in convenient 330ml bottles. Perfect for home, office, or on-the-go hydration. This bulk offer includes 2 packs of 24 bottles each (48 bottles total) at an amazing discount.",
    inStock: true,
    sku: "OAS-BULK-330ML-48",
    hasBulkDeal: true,
  },
}

const suggestedProducts = [
  {
    id: 2,
    name: "Oasis Zero Sodium Free 5 Gallon",
    price: 11.43,
    originalPrice: null,
    image: "/oasis-5-gallon-blue.png",
    isNew: true,
    discount: null,
  },
  {
    id: 3,
    name: "Oasis 5 Gallon",
    price: 9.52,
    originalPrice: 10.47,
    image: "/oasis-5-gallon-blue.png",
    isNew: false,
    discount: "-9%",
  },
  {
    id: 4,
    name: "Oasis 4 Gallon",
    price: 11.42,
    originalPrice: 12.38,
    image: "/oasis-5-gallon-blue.png",
    isNew: false,
    discount: "-8%",
  },
  {
    id: 5,
    name: "Oasis 1Gallon - Carton of 6",
    price: 14.28,
    originalPrice: null,
    image: "/oasis-water-bottles-carton.png",
    isNew: false,
    discount: null,
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const { addToCart } = useCart()
  const { locale, t } = useLocale()

  const product = productData[params.id as keyof typeof productData] || productData[1]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    })
  }

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("water"), href: "/s/water" },
    { label: product.name, href: `/product/${product.id}` },
  ]

  return (
    <div className={`min-h-screen bg-gray-50 ${locale === "ar" ? "rtl" : "ltr"}`}>
      {/* Top Header */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>{locale === "ar" ? "العربية" : "English"}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-4 h-4" />
            <MessageCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/oasis-logo-blue.png" alt="Oasis Direct" className="h-12" />
            </Link>

            <div className="flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg"
                />
                <Button size="sm" className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t("cart")}</span>
                <Badge variant="secondary" className="ml-1">
                  0
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-4">
            <Link href="/s/water" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <img src="/placeholder.svg?height=24&width=24" alt="Water" className="w-6 h-6" />
              <span className="font-medium">{t("water")}</span>
            </Link>
            <Link href="/s/juice" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <img src="/placeholder.svg?height=24&width=24" alt="Juice" className="w-6 h-6" />
              <span className="font-medium">{t("juice")}</span>
            </Link>
            <Link href="/s/dairy" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <img src="/placeholder.svg?height=24&width=24" alt="Dairy" className="w-6 h-6" />
              <span className="font-medium">{t("dairy")}</span>
            </Link>
            <Link
              href="/s/accessories"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              <img src="/placeholder.svg?height=24&width=24" alt="Accessories" className="w-6 h-6" />
              <span className="font-medium">{t("accessories")}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-blue-100 rounded-lg overflow-hidden aspect-square">
              {product.hasBulkDeal && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-pink-500 text-white px-6 py-3 rounded-lg transform -rotate-12 shadow-lg">
                    <div className="text-xl font-bold">Bulk Deals</div>
                    <div className="text-lg">20% off</div>
                  </div>
                </div>
              )}

              <img
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
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
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

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
                        alt={suggestedProduct.name}
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
                      {suggestedProduct.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-green-600">AED {suggestedProduct.price}</span>
                      {suggestedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">AED {suggestedProduct.originalPrice}</span>
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

      {/* Footer */}
      <footer className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">GET THE APP</h3>
              <p className="text-blue-100 mb-4">
                Oasis Direct App is now available in Google Play, App Store, and AppGallery. Get it Now!
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">CONTACT INFORMATION</h3>
              <div className="space-y-2 text-blue-100">
                <p>
                  <strong>ADDRESS</strong>
                </p>
                <p>Oasis Pure Water Factory LLC Jebel Ali Dubai, United Arab Emirates</p>
                <p>
                  <strong>TEL</strong>
                </p>
                <p>600522261</p>
                <p>
                  <strong>EMAIL</strong>
                </p>
                <p>Oasis.H2o@Nfpc.Net</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">COLLECTIONS</h3>
              <div className="space-y-2 text-blue-100">
                <Link href="/s/water" className="block hover:text-white cursor-pointer">
                  Water
                </Link>
                <Link href="/s/juice" className="block hover:text-white cursor-pointer">
                  Juice
                </Link>
                <Link href="/s/dairy" className="block hover:text-white cursor-pointer">
                  Dairy
                </Link>
                <Link href="/s/accessories" className="block hover:text-white cursor-pointer">
                  Accessories
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">INFORMATION</h3>
              <div className="space-y-2 text-blue-100">
                <p className="cursor-pointer hover:text-white">Our Oasis Website</p>
                <p className="cursor-pointer hover:text-white">About Us</p>
                <p className="cursor-pointer hover:text-white">Contact Us</p>
                <p className="cursor-pointer hover:text-white">Terms And Conditions</p>
                <p className="cursor-pointer hover:text-white">Privacy Policy</p>
                <p className="cursor-pointer hover:text-white">FAQs</p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-500 mt-8 pt-8 text-center text-blue-100">
            <p>Copyright © Oasis Direct. All Rights Reserved. - 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
