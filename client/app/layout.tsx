import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}