"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Locale = "en" | "ar"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  en: {
    // Header
    "header.search.placeholder": "Search...",
    "header.cart": "Cart",
    "header.language": "English",

    // Navigation
    "nav.water": "Water",
    "nav.juice": "Juice",
    "nav.dairy": "Dairy",
    "nav.accessories": "Accessories",

    // Search
    "search.showAll": "Show all",
    "search.results": "results",
    "search.noResults": "No products found",
    "search.tryAgain": "Try searching for something else",

    // Products
    "product.new": "NEW",
    "product.addToCart": "Add to Cart",
    "product.viewAll": "View All",
    "product.sortBy": "Sort by",
    "product.sortBy.featured": "Featured",
    "product.sortBy.priceLowHigh": "Price: Low to High",
    "product.sortBy.priceHighLow": "Price: High to Low",
    "product.sortBy.newest": "Newest",
    "product.sortBy.name": "Name A-Z",

    // Sections
    "section.shopByBrand": "Shop By Brand",
    "section.specialPromotions": "Special Promotions",

    // Footer
    "footer.getApp": "GET THE APP",
    "footer.appDescription": "Oasis Direct App is now available in Google Play App Store and Apple App Store",
    "footer.contactInfo": "CONTACT INFORMATION",
    "footer.collections": "COLLECTIONS",
    "footer.information": "INFORMATION",
    "footer.copyright": "Copyright © Oasis Direct. All Rights Reserved - 2024",

    // Cart
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",

    // Checkout
    "checkout.processing": "Processing Payment",
    "checkout.processingMessage": "Please wait while we process your payment...",
    "checkout.success": "Payment Successful!",
    "checkout.successMessage": "Your order has been placed successfully.",
    "checkout.redirecting": "Redirecting to home page...",
  },
  ar: {
    // Header
    "header.search.placeholder": "البحث...",
    "header.cart": "السلة",
    "header.language": "العربية",

    // Navigation
    "nav.water": "المياه",
    "nav.juice": "العصائر",
    "nav.dairy": "منتجات الألبان",
    "nav.accessories": "الإكسسوارات",

    // Search
    "search.showAll": "عرض الكل",
    "search.results": "نتيجة",
    "search.noResults": "لم يتم العثور على منتجات",
    "search.tryAgain": "جرب البحث عن شيء آخر",

    // Products
    "product.new": "جديد",
    "product.addToCart": "أضف إلى السلة",
    "product.viewAll": "عرض الكل",
    "product.sortBy": "ترتيب حسب",
    "product.sortBy.featured": "المميز",
    "product.sortBy.priceLowHigh": "السعر: من الأقل إلى الأعلى",
    "product.sortBy.priceHighLow": "السعر: من الأعلى إلى الأقل",
    "product.sortBy.newest": "الأحدث",
    "product.sortBy.name": "الاسم أ-ي",

    // Sections
    "section.shopByBrand": "تسوق حسب العلامة التجارية",
    "section.specialPromotions": "العروض الخاصة",

    // Footer
    "footer.getApp": "حمل التطبيق",
    "footer.appDescription": "تطبيق واحة مباشر متوفر الآن في متجر جوجل بلاي ومتجر آبل",
    "footer.contactInfo": "معلومات الاتصال",
    "footer.collections": "المجموعات",
    "footer.information": "المعلومات",
    "footer.copyright": "حقوق الطبع والنشر © واحة مباشر. جميع الحقوق محفوظة - 2024",

    // Cart
    "cart.empty": "سلتك فارغة",
    "cart.total": "المجموع",
    "cart.checkout": "الدفع",
    "cart.remove": "إزالة",
    "cart.quantity": "الكمية",

    // Checkout
    "checkout.processing": "معالجة الدفع",
    "checkout.processingMessage": "يرجى الانتظار بينما نعالج دفعتك...",
    "checkout.success": "تم الدفع بنجاح!",
    "checkout.successMessage": "تم تقديم طلبك بنجاح.",
    "checkout.redirecting": "إعادة التوجيه إلى الصفحة الرئيسية...",
  },
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const t = (key: string): string => {
    return translations[locale][key as keyof (typeof translations)[typeof locale]] || key
  }

  const isRTL = locale === "ar"

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale, isRTL])

  return <LocaleContext.Provider value={{ locale, setLocale, t, isRTL }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
