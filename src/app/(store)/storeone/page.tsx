import { Metadata } from "next";
import StoreHeroHeader from "@/components/features/store/StoreHeroHeader";
import StoreCategoryNav from "@/components/features/store/StoreCategoryNav";
import StoreShelf from "@/components/features/store/StoreShelf";
import StoreQuickLinks from "@/components/features/store/StoreQuickLinks";
import {
  LATEST_SHELF,
  HELP_SHELF,
  DIFFERENCE_SHELF,
  ACCESSORIES_SHELF,
  AUDIO_SHELF,
  EXPERIENCE_SHELF,
  SAVINGS_SHELF,
} from "@/config/storeData";

export const metadata: Metadata = {
  title: "Apple Store Online - Apple",
  description:
    "Shop the latest Apple products, accessories, and offers. Compare models, get expert shopping help, plus flexible payment and delivery options.",
};

export default function StorePage() {
  return (
    <main className="w-full min-h-screen bg-[#f5f5f7] pb-12">
      {/* 1. Store Header Greeting */}
      <StoreHeroHeader />

      {/* 2. Product Categories Navigation (11 items) */}
      <StoreCategoryNav />

      {/* 3. The Latest Shelf */}
      <StoreShelf
        sectionTitle="The latest."
        sectionSubtitle="Take a look at what’s new, right now."
        cards={LATEST_SHELF}
      />

      {/* 4. Help Is Here Shelf */}
      <StoreShelf
        sectionTitle="Help is here."
        sectionSubtitle="Whenever and however you need it."
        cards={HELP_SHELF}
      />

      {/* 5. The Apple Store Difference Shelf */}
      <StoreShelf
        sectionTitle="The Apple Store difference."
        sectionSubtitle="Even more reasons to shop with us."
        cards={DIFFERENCE_SHELF}
      />

      {/* 6. Accessories Shelf */}
      <StoreShelf
        sectionTitle="Accessories."
        sectionSubtitle="Essentials that pair perfectly with your favorite devices."
        cards={ACCESSORIES_SHELF}
      />

      {/* 7. Elevated Home Theater Sound Shelf */}
      <StoreShelf
        sectionTitle="Elevated home theater sound."
        sectionSubtitle="Just in time for Ted’s return."
        cards={AUDIO_SHELF}
      />

      {/* 8. The Apple Experience Shelf */}
      <StoreShelf
        sectionTitle="The Apple experience."
        sectionSubtitle="Do even more with Apple products and services."
        cards={EXPERIENCE_SHELF}
      />

      {/* 9. Savings and Offers Shelf */}
      <StoreShelf
        sectionTitle="Savings and offers."
        sectionSubtitle="Exclusive deals, special stores and more."
        cards={SAVINGS_SHELF}
      />

      {/* 10. Quick Links Section */}
      <StoreQuickLinks />
    </main>
  );
}
