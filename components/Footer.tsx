"use client"

import { useLocale } from "@/contexts/LocaleContext"
import Link from "next/link"

export default function Footer() {
  const { locale, translations } = useLocale()

  return (
    <footer className="bg-gradient-to-r from-[#2871A5] to-[#243464] text-white relative overflow-hidden">
      {/* Decorative floating bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="jss111 jss113" style={{ left: "10%", animationDelay: "0s" }}></div>
        <div className="jss111 jss113" style={{ left: "25%", animationDelay: "2s" }}></div>
        <div className="jss111 jss113" style={{ left: "40%", animationDelay: "4s" }}></div>
        <div className="jss111 jss113" style={{ left: "60%", animationDelay: "1s" }}></div>
        <div className="jss111 jss113" style={{ left: "80%", animationDelay: "3s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* App Download Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Get the App</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Oasis Direct App is now available in Google Play, App Store, and AppGallery. Get it Now!
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://play.google.com/store/apps/details/?id=com.winit.oasiswater"
                className="block hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="https://nfpc.imgix.net/cms/1647219718770_image.png?fit=contain&auto=format,compress"
                  alt="Get it in Google Play"
                  className="h-12 w-auto"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/oasis-direct/id1504667347"
                className="block hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="https://nfpc.imgix.net/cms/1647219852434_image.png?fit=contain&auto=format,compress"
                  alt="Get it in App Store"
                  className="h-12 w-auto"
                />
              </a>
              <a
                href="https://appgallery.huawei.com/app/C107535711"
                className="block hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="https://nfpc.imgix.net/cms/1679787525756_image.png?fit=contain&auto=format,compress"
                  alt="Get it in AppGallery"
                  className="h-12 w-auto"
                />
              </a>
            </div>

            <div className="pt-4">
              <img alt="Credit Cards Logos" src="/credit-card-logos.png" className="h-8 w-auto opacity-80" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Contact Information</h3>

            <div>
              <h4 className="font-semibold text-blue-100 mb-2">Address</h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                Oasis Pure Water Factory LLC
                <br />
                Jebel Ali Dubai, United Arab Emirates
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-blue-100 mb-2">Tel</h4>
              <a
                href="tel:600522261"
                className="text-white hover:text-blue-200 transition-colors duration-300 font-medium"
              >
                600522261
              </a>
            </div>

            <div>
              <h4 className="font-semibold text-blue-100 mb-2">Email</h4>
              <a
                href="mailto:Oasis.H2o@Nfpc.Net"
                className="text-white hover:text-blue-200 transition-colors duration-300 font-medium"
              >
                Oasis.H2o@Nfpc.Net
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/s/water"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Water
                </Link>
              </li>
              <li>
                <Link
                  href="/s/juice"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Juice
                </Link>
              </li>
              <li>
                <Link
                  href="/s/dairy"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Dairy
                </Link>
              </li>
              <li>
                <Link
                  href="/s/accessories"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Information</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://ouroasis.com/"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Our Oasis Website
                </a>
              </li>
              <li>
                <a
                  href="https://ouroasis.com/about/"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  About us
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-400/30 mt-12 pt-8 text-center">
          <p className="text-blue-100">Copyright © Oasis Direct. All Rights Reserved. - 2025</p>
        </div>
      </div>
    </footer>
  )
}
