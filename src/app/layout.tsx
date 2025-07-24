"use client";

import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { ProductOfferBanner } from "@/components/Banner/ProductBanner";
import { CartProvider } from "@/context/CartContext";
import { ReactNode } from "react";
import "./globals.css";
import { FloatingCart } from "@/components/FloatingCart/FloatingCart";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AuthProvider>
            <div className="sticky top-0 z-50 bg-white">
              <Navbar />
            </div>
            <ProductOfferBanner />
            <main>{children}</main>
            <Toaster
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast:
                    "bg-white text-gray-900 shadow-md rounded-lg px-4 py-3 border border-gray-200",
                  title: "font-semibold text-sm",
                  description: "text-xs text-gray-600 mt-1",
                  actionButton:
                    "text-sm text-[#8BAD2B] font-medium hover:underline",
                  cancelButton: "text-sm text-gray-500 hover:underline",
                  closeButton: "text-gray-500 hover:text-gray-800",
                  error: "text-red-600 border-red-200",
                  success: "text-green-600 border-green-200",
                  warning: "text-yellow-600 border-yellow-200",
                  info: "text-blue-600 border-blue-200",
                },
              }}
              position="top-center"
              richColors={false}
              expand={true}
            />
            <FloatingCart />
            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
