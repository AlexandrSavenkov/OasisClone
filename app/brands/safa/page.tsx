"use client"

import { useState } from "react"
import { Search, ShoppingCart, Phone, MessageCircle, ChevronDown, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const safaProducts = [
  {
    id: 1,
    name: "Safa Pure Drinking Water 1.5L - Pack of 6",
    price: 7.2,
    originalPrice: null,
    image: "/placeholder.svg?key=safa1",
    category: "water",
    brand: "safa",
    isNew: false,
    discount: null,
  },
  {
    id: 2,
    name: "Safa Pure Drinking Water 500ml - Pack of 12",
    price: 9.6,
    originalPrice: null,
    image: "/placeholder.svg?key=safa2",
    category: "water",
    brand: "safa",
    isNew: false,
    discount: null,
  },
  {
    id: 3,
    name: "Safa Pure Drinking Water 330ml - Pack of 24",
    price: 14.4,
    originalPrice: null,
    image: "/placeholder.svg?key=safa3",
    category: "water",
    brand: "safa",
    isNew: false,
    discount: null,
  },
]

export default function SafaBrandPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")

  const filteredProducts = safaProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>English</span>
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
            <div className="flex items-center">
              <img src="/placeholder.svg?height=50&width=120" alt="Oasis Direct" className="h-12" />
            </div>

            <div className="flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Safa products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                <span className="hidden sm:inline">Cart</span>
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
            <a href="/categories/water" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <img src="/placeholder.svg?height=24&width=24" alt="Water" className="w-6 h-6" />
              <span className="font-medium">Water</span>
            </a>
            <a href="/categories/juice" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <img src="/placeholder.svg?height=24&width=24" alt="Juice" className="w-6 h-6" />
              <span className="font-medium">Juice</span>
            </a>
            <a href="/categories/dairy" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <img src="/placeholder.svg?height=24&width=24" alt="Dairy" className="w-6 h-6" />
              <span className="font-medium">Dairy</span>
            </a>
            <a href="/categories/accessories" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <img src="/placeholder.svg?height=24&width=24" alt="Accessories" className="w-6 h-6" />
              <span className="font-medium">Accessories</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">
              Oasis Direct
            </a>
            <span>›</span>
            <span className="text-gray-900 font-medium">Safa</span>
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <img src="/placeholder.svg?height=80&width=120" alt="Safa" className="h-20 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Safa</h1>
              <p className="text-gray-600">Pure drinking water for everyday hydration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                FILTER BY
              </h3>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price (AED)</h4>
                <div className="space-y-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>AED {priceRange[0]}</span>
                    <span>AED {priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Total Items: {filteredProducts.length}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort By:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {product.isNew && <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>}
                      {product.discount && (
                        <Badge className="absolute top-2 left-2 bg-green-500 text-white">{product.discount}</Badge>
                      )}
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-blue-600">AED {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">AED {product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          -
                        </Button>
                        <span className="px-3 py-1 border rounded">1</span>
                        <Button variant="outline" size="sm">
                          +
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">GET THE APP</h3>
              <p className="text-blue-100 mb-4">
                Oasis Direct App is now available in Google Play, App Store, and AppGallery. Get it Now!
              </p>
              <div className="space-y-2">
                <img src="/placeholder.svg?height=40&width=120" alt="Google Play" className="h-10" />
                <img src="/placeholder.svg?height=40&width=120" alt="App Store" className="h-10" />
                <img src="/placeholder.svg?height=40&width=120" alt="AppGallery" className="h-10" />
              </div>
              <div className="flex gap-2 mt-4">
                <img src="/placeholder.svg?height=30&width=40" alt="Visa" className="h-8" />
                <img src="/placeholder.svg?height=30&width=40" alt="Mastercard" className="h-8" />
              </div>
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
                <p>Water</p>
                <p>Juice</p>
                <p>Dairy</p>
                <p>Accessories</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">INFORMATION</h3>
              <div className="space-y-2 text-blue-100">
                <p>Our Oasis Website</p>
                <p>About Us</p>
                <p>Contact Us</p>
                <p>Terms And Conditions</p>
                <p>Privacy Policy</p>
                <p>FAQs</p>
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
