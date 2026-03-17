import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <CartDrawer />
      </FavoritesProvider>
    </CartProvider>
  );
}
