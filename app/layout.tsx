import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { CartProvider } from "@/hooks/useCart"
import { LocaleProvider } from "@/contexts/LocaleContext"
import Footer from "@/components/Footer"
import "./globals.css"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Oasis Direct - Water, Juice, Dairy & Accessories Delivery",
  description: "Order fresh water, juice, dairy products and accessories online with fast delivery in UAE",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocaleProvider>
          <CartProvider>
            {children}
            <Footer />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
