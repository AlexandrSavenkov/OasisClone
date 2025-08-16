"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, X, ArrowLeft, Truck, Shield, Clock, Phone, MessageCircle, ChevronDown } from "lucide-react"

export default function CartPage() {
  const { state, dispatch } = useCart()
  const { locale, t } = useLocale()

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } })
    }
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const subtotal = state.total
  const discount = subtotal * 0.1 // 10% discount
  const deliveryFee = subtotal > 50 ? 0 : 5
  const total = subtotal - discount + deliveryFee

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
      <header className="shadow-sm" style={{ background: "linear-gradient(to right, #2871A5, #243464)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center cursor-pointer">
              <Image
                src="https://oasisdirect.ae/Oasis_Direct_BLUE_EN.png?w=3840&q=75"
                alt="Oasis Direct"
                width={120}
                height={40}
                className="h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-4">
            <Link href="/s/water" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <Image
                src="https://nfpc.imgix.net/files/1643925166059_image.png?fit=contain&h=45&w=45&auto=format,compress"
                alt="Water"
                width={24}
                height={24}
              />
              <span className="font-medium">{t("water")}</span>
            </Link>
            <Link href="/s/juice" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <Image
                src="https://nfpc.imgix.net/files/1643925178667_image.png?fit=contain&h=45&w=45&auto=format,compress"
                alt="Juice"
                width={24}
                height={24}
              />
              <span className="font-medium">{t("juice")}</span>
            </Link>
            <Link href="/s/dairy" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <Image
                src="https://nfpc.imgix.net/files/1643891145147_image.png?fit=contain&h=45&w=45&auto=format,compress"
                alt="Dairy"
                width={24}
                height={24}
              />
              <span className="font-medium">{t("dairy")}</span>
            </Link>
            <Link
              href="/s/accessories"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              <Image
                src="https://nfpc.imgix.net/files/1643891204025_image.png?fit=contain&h=45&w=45&auto=format,compress"
                alt="Accessories"
                width={24}
                height={24}
              />
              <span className="font-medium">{t("accessories")}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 cursor-pointer">
              Oasis Direct
            </Link>
            <span>/</span>
            <span className="text-gray-900">{t("cart")}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-900">{t("cart")}</h1>
                <p className="text-gray-600 mt-1">{state.itemCount} items in your cart</p>
              </div>

              {state.items.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link href="/">
                    <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 0)}
                                className="h-8 w-16 text-center border-0 focus:ring-0"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">
                                AED {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Continue Shopping */}
              <div className="p-6 border-t bg-gray-50">
                <Link href="/">
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Continue Shopping</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                    <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-AED {discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                      {deliveryFee === 0 ? "FREE" : `AED ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-blue-600">AED {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  size="lg"
                  asChild
                  disabled={state.items.length === 0}
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                {/* Promo Code */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Promo Code</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter promo code" className="flex-1" />
                    <Button variant="outline" className="cursor-pointer bg-transparent">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span>Free delivery on orders over AED 50</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Same day delivery available</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Secure payment guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
