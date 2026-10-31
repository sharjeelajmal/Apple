import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShoppingAssistant from "@/components/assistant/ShoppingAssistant";
import CompareBar from "@/components/compare/CompareBar";
import { assistantConfig } from "@/config/env";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Header />
        {children}
        <Footer />
        <CompareBar />
        {assistantConfig.isEnabled && <ShoppingAssistant />}
      </WishlistProvider>
    </CartProvider>
  );
}
