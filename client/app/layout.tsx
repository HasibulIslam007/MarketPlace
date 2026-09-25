import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "ZMart",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <CartProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <Footer />
            </AuthProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}