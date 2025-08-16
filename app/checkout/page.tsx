"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, MapPin, User, Loader2, CheckCircle } from "lucide-react"
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
  const { state: cartState, dispatch: cartDispatch } = useCart() // Added dispatch for cart clearing
  const { t, isRTL } = useLocale()
  const router = useRouter()
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
      {/* ... existing header code ... */}
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
              <Image src="/oasis-logo-white.png" alt="Oasis Direct" width={120} height={40} />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* ... existing breadcrumb code ... */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 cursor-pointer">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-blue-600 cursor-pointer">
              Cart
            </Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
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
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className="mt-1"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className="mt-1"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className="mt-1"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
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
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter street address"
                    className="mt-1"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    className="mt-1"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    placeholder="Enter area"
                    className="mt-1"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                </div>
                <div>
                  <Label htmlFor="building">Building/Villa *</Label>
                  <Input
                    id="building"
                    placeholder="Enter building/villa"
                    className="mt-1"
                    value={formData.building}
                    onChange={(e) => handleInputChange("building", e.target.value)}
                  />
                  {errors.building && <p className="text-red-500 text-sm mt-1">{errors.building}</p>}
                </div>
                <div>
                  <Label htmlFor="apartment">Apartment/Flat</Label>
                  <Input
                    id="apartment"
                    placeholder="Enter apartment/flat"
                    className="mt-1"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="Enter landmark"
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
                Payment Method
              </h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="font-semibold cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="googlepay" id="googlepay" />
                  <Label htmlFor="googlepay" className="font-semibold cursor-pointer">
                    Google Pay
                  </Label>
                </div>
              </RadioGroup>

              {/* Card Details */}
              {formData.paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
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
                      <Label htmlFor="expiry">Expiry Date *</Label>
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
                      <Label htmlFor="cvv">CVV *</Label>
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
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline cursor-pointer">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline cursor-pointer">
                    Privacy Policy
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

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
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">AED {cartState.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-green-600">
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
                  onClick={handlePlaceOrder}
                  disabled={cartState.items.length === 0}
                >
                  Place Order
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/cart"
                    className="text-blue-600 hover:underline text-sm flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Cart
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
