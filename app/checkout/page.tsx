"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Loader2,
  CheckCircle,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useLocale } from "@/contexts/LocaleContext"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  area: string
  building: string
  apartment: string
  landmark: string
  deliveryOption: string
  paymentMethod: string
  cardNumber: string
  expiry: string
  cvv: string
  termsAccepted: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const { locale, setLocale, t, isRTL } = useLocale()
  const router = useRouter()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    building: "",
    apartment: "",
    landmark: "",
    deliveryOption: "standard",
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.area.trim()) newErrors.area = "Area is required"
    if (!formData.building.trim()) newErrors.building = "Building/Villa is required"

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
      if (!formData.expiry.trim()) newErrors.expiry = "Expiry date is required"
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required"
    }

    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setIsCompleted(true)

    cartDispatch({ type: "CLEAR_CART" })

    // Auto redirect after 3 seconds
    setTimeout(() => {
      router.push("/")
    }, 3000)
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("checkout.processing")}</h2>
          <p className="text-gray-600">{t("checkout.processingMessage")}</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("checkout.success")}</h2>
          <p className="text-gray-600 mb-4">{t("checkout.successMessage")}</p>
          <p className="text-sm text-gray-500">{t("checkout.redirecting")}</p>
        </div>
      </div>
    )
  }

  const deliveryFee = formData.deliveryOption === "express" ? 15 : 0
  const total = cartState.total + deliveryFee

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Top Header */}
      <div className="bg-blue-600 text-white py-2 px-4">
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
      <header className="header-gradient shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center min-h-[55px]">
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
              <span className="font-medium">{t("nav.water")}</span>
            </Link>
            <Link href="/s/juice" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <Image
                src="https://nfpc.imgix.net/files/1643925178667_image.png?fit=contain&h=45&w=45&auto=format,compress"
                alt="Juice"
                width={24}
                height={24}
              />
              <span className="font-medium">{t("nav.juice")}</span>
            </Link>
            <Link href="/s/dairy" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
              <Image
                src="https://nfpc.imgix.net/files/1643891145147_image.png?fit=contain&h=45&w=45&auto=format,compress"
                alt="Dairy"
                width={24}
                height={24}
              />
              <span className="font-medium">{t("nav.dairy")}</span>
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
              <span className="font-medium">{t("nav.accessories")}</span>
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
            <Link href="/cart" className="hover:text-blue-600 cursor-pointer">
              {t("header.cart")}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{t("checkout.checkout")}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                {t("checkout.contactInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t("checkout.firstName")} *</Label>
                  <Input
                    id="firstName"
                    placeholder={t("checkout.enterFirstName")}
                    className="mt-1"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">{t("checkout.lastName")} *</Label>
                  <Input
                    id="lastName"
                    placeholder={t("checkout.enterLastName")}
                    className="mt-1"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <Label htmlFor="email">{t("checkout.email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("checkout.enterEmail")}
                    className="mt-1"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">{t("checkout.phone")} *</Label>
                  <Input
                    id="phone"
                    placeholder="+971 XX XXX XXXX"
                    className="mt-1"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                {t("checkout.deliveryAddress")}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">{t("checkout.streetAddress")} *</Label>
                  <Input
                    id="address"
                    placeholder={t("checkout.enterStreetAddress")}
                    className="mt-1"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city">{t("checkout.city")} *</Label>
                  <Input
                    id="city"
                    placeholder={t("checkout.enterCity")}
                    className="mt-1"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="area">{t("checkout.area")} *</Label>
                  <Input
                    id="area"
                    placeholder={t("checkout.enterArea")}
                    className="mt-1"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>
                <div>
                  <Label htmlFor="building">{t("checkout.building")} *</Label>
                  <Input
                    id="building"
                    placeholder={t("checkout.enterBuilding")}
                    className="mt-1"
                    value={formData.building}
                    onChange={(e) => handleInputChange("building", e.target.value)}
                  />
                  {errors.building && <p className="text-red-500 text-sm mt-1">{errors.building}</p>}
                </div>
                <div>
                  <Label htmlFor="apartment">{t("checkout.apartment")}</Label>
                  <Input
                    id="apartment"
                    placeholder={t("checkout.enterApartment")}
                    className="mt-1"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="landmark">{t("checkout.landmark")}</Label>
                  <Input
                    id="landmark"
                    placeholder={t("checkout.enterLandmark")}
                    className="mt-1"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                {t("checkout.paymentMethod")}
              </h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="font-semibold cursor-pointer">
                    {t("checkout.creditCard")}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="googlepay" id="googlepay" />
                  <Label htmlFor="googlepay" className="font-semibold cursor-pointer">
                    {t("checkout.googlePay")}
                  </Label>
                </div>
              </RadioGroup>

              {/* Card Details */}
              {formData.paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">{t("checkout.cardNumber")} *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">{t("checkout.expiryDate")} *</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="mt-1"
                        value={formData.expiry}
                        onChange={(e) => handleInputChange("expiry", e.target.value)}
                      />
                      {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cvv">{t("checkout.cvv")} *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="mt-1"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  {t("checkout.termsAccepted")}
                  <Link href="/terms" className="text-blue-600 hover:underline cursor-pointer">
                    {t("checkout.terms")}
                  </Link>{" "}
                  {t("checkout.and")}
                  <Link href="/privacy" className="text-blue-600 hover:underline cursor-pointer">
                    {t("checkout.privacy")}
                  </Link>
                </Label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("checkout.orderSummary")}</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {t("checkout.qty")}: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("checkout.subtotal")}</span>
                    <span className="font-semibold">AED {cartState.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("checkout.delivery")}</span>
                    <span className="font-semibold text-green-600">
                      {deliveryFee === 0 ? t("checkout.free") : `AED ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">{t("checkout.total")}</span>
                    <span className="font-bold text-blue-600">AED {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={cartState.items.length === 0}
                >
                  {t("checkout.placeOrder")}
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/cart"
                    className="text-blue-600 hover:underline text-sm flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t("checkout.backToCart")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
