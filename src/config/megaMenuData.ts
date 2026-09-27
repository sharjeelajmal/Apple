export interface SubmenuColumn {
  title: string;
  isElevated?: boolean;
  links: { label: string; href: string }[];
}

export interface MegaMenuItem {
  id: string;
  label: string;
  href: string;
  columns: SubmenuColumn[];
}

export const MEGA_MENU_DATA: Record<string, MegaMenuItem> = {
  store: {
    id: "store",
    label: "Store",
    href: "/storeone",
    columns: [
      {
        title: "Shop",
        isElevated: true,
        links: [
          { label: "Shop the Latest", href: "/shop" },
          { label: "Mac", href: "/mac" },
          { label: "iPad", href: "/ipad" },
          { label: "iPhone", href: "/iphone" },
          { label: "Apple Watch", href: "/watch" },
          { label: "Apple Vision Pro", href: "/apple-vision-pro" },
          { label: "AirPods", href: "/airpods" },
          { label: "Accessories", href: "/shop/accessories" },
        ],
      },
      {
        title: "Quick Links",
        links: [
          { label: "Find a Store", href: "/retail" },
          { label: "Order Status", href: "/shop/order-status" },
          { label: "Apple Upgrade", href: "/shop/apple-upgrade" },
          { label: "Apple Trade In", href: "/shop/trade-in" },
          { label: "Financing", href: "/shop/financing" },
          { label: "Personal Setup", href: "/shop/personal-setup" },
          { label: "College Student Offer", href: "/shop/education" },
        ],
      },
      {
        title: "Shop Special Stores",
        links: [
          { label: "Certified Refurbished", href: "/shop/refurbished" },
          { label: "Education", href: "/education" },
          { label: "Business", href: "/business" },
          { label: "Veterans and Military", href: "/shop/veterans" },
          { label: "Government", href: "/shop/government" },
        ],
      },
    ],
  },
  mac: {
    id: "mac",
    label: "Mac",
    href: "/mac",
    columns: [
      {
        title: "Explore Mac",
        isElevated: true,
        links: [
          { label: "Explore All Mac", href: "/mac" },
          { label: "MacBook Neo", href: "/macbook-neo" },
          { label: "MacBook Air", href: "/macbook-air" },
          { label: "MacBook Pro", href: "/macbook-pro" },
          { label: "iMac", href: "/imac" },
          { label: "Mac mini", href: "/mac-mini" },
          { label: "Mac Studio", href: "/mac-studio" },
          { label: "Displays", href: "/displays" },
        ],
      },
      {
        title: "Shop Mac",
        links: [
          { label: "Shop Mac", href: "/shop/buy-mac" },
          { label: "Mac Accessories", href: "/shop/accessories/mac" },
          { label: "Apple Upgrade", href: "/shop/apple-upgrade" },
          { label: "Apple Trade In", href: "/shop/trade-in" },
          { label: "Financing", href: "/shop/financing" },
          { label: "College Student Offer", href: "/shop/education" },
        ],
      },
      {
        title: "More from Mac",
        links: [
          { label: "Mac Support", href: "/support/mac" },
          { label: "AppleCare+", href: "/applecare" },
          { label: "macOS 27 Preview", href: "/os/macos" },
          { label: "Apple Intelligence", href: "/apple-intelligence" },
          { label: "Apps by Apple", href: "/apps" },
          { label: "Apple Creator Studio", href: "/creator-studio" },
          { label: "Continuity", href: "/continuity" },
          { label: "iCloud+", href: "/icloud" },
        ],
      },
    ],
  },
  ipad: {
    id: "ipad",
    label: "iPad",
    href: "/ipad",
    columns: [
      {
        title: "Explore iPad",
        isElevated: true,
        links: [
          { label: "Explore All iPad", href: "/ipad" },
          { label: "iPad Pro", href: "/ipad-pro" },
          { label: "iPad Air", href: "/ipad-air" },
          { label: "iPad", href: "/ipad-11" },
          { label: "iPad mini", href: "/ipad-mini" },
          { label: "Apple Pencil", href: "/apple-pencil" },
          { label: "Keyboards", href: "/ipad-keyboards" },
        ],
      },
      {
        title: "Shop iPad",
        links: [
          { label: "Shop iPad", href: "/shop/buy-ipad" },
          { label: "iPad Accessories", href: "/shop/accessories/ipad" },
          { label: "Apple Trade In", href: "/shop/trade-in" },
          { label: "Financing", href: "/shop/financing" },
          { label: "College Student Offer", href: "/shop/education" },
        ],
      },
      {
        title: "More from iPad",
        links: [
          { label: "iPad Support", href: "/support/ipad" },
          { label: "AppleCare+", href: "/applecare" },
          { label: "iPadOS 27 Preview", href: "/os/ipados" },
          { label: "Apple Intelligence", href: "/apple-intelligence" },
          { label: "Apps by Apple", href: "/apps" },
          { label: "iCloud+", href: "/icloud" },
          { label: "Education", href: "/education" },
        ],
      },
    ],
  },
  iphone: {
    id: "iphone",
    label: "iPhone",
    href: "/iphone",
    columns: [
      {
        title: "Explore iPhone",
        isElevated: true,
        links: [
          { label: "Explore All iPhone", href: "/iphone" },
          { label: "iPhone 17 Pro", href: "/iphone-17-pro" },
          { label: "iPhone Air", href: "/iphone-air" },
          { label: "iPhone 17", href: "/iphone-17" },
          { label: "iPhone 17e", href: "/iphone-17e" },
          { label: "iPhone 16", href: "/iphone-16" },
        ],
      },
      {
        title: "Shop iPhone",
        links: [
          { label: "Shop iPhone", href: "/shop/buy-iphone" },
          { label: "iPhone Accessories", href: "/shop/accessories/iphone" },
          { label: "Apple Trade In", href: "/shop/trade-in" },
          { label: "Carrier Deals at Apple", href: "/shop/carrier-deals" },
          { label: "Financing", href: "/shop/financing" },
        ],
      },
      {
        title: "More from iPhone",
        links: [
          { label: "iPhone Support", href: "/support/iphone" },
          { label: "AppleCare+", href: "/applecare" },
          { label: "iOS 27 Preview", href: "/os/ios" },
          { label: "Apple Intelligence", href: "/apple-intelligence" },
          { label: "Apps by Apple", href: "/apps" },
          { label: "iPhone Privacy", href: "/privacy" },
          { label: "Wallet, Pay, Card", href: "/wallet" },
        ],
      },
    ],
  },
  watch: {
    id: "watch",
    label: "Watch",
    href: "/watch",
    columns: [
      {
        title: "Explore Watch",
        isElevated: true,
        links: [
          { label: "Explore All Apple Watch", href: "/watch" },
          { label: "Apple Watch Series 11", href: "/apple-watch-series-11" },
          { label: "Apple Watch SE 3", href: "/apple-watch-se-3" },
          { label: "Apple Watch Ultra 3", href: "/apple-watch-ultra-3" },
          { label: "Apple Watch Nike", href: "/apple-watch-nike" },
          { label: "Apple Watch Hermès", href: "/apple-watch-hermes" },
        ],
      },
      {
        title: "Shop Watch",
        links: [
          { label: "Shop Apple Watch", href: "/shop/buy-watch" },
          { label: "Apple Watch Bands", href: "/shop/watch-bands" },
          { label: "Apple Watch Accessories", href: "/shop/accessories/watch" },
          { label: "Apple Trade In", href: "/shop/trade-in" },
          { label: "Financing", href: "/shop/financing" },
        ],
      },
      {
        title: "More from Watch",
        links: [
          { label: "Apple Watch Support", href: "/support/watch" },
          { label: "AppleCare+", href: "/applecare" },
          { label: "watchOS 27 Preview", href: "/os/watchos" },
          { label: "Apple Fitness+", href: "/apple-fitness-plus" },
        ],
      },
    ],
  },
  vision: {
    id: "vision",
    label: "Vision",
    href: "/apple-vision-pro",
    columns: [
      {
        title: "Explore Vision",
        isElevated: true,
        links: [
          { label: "Explore Apple Vision Pro", href: "/apple-vision-pro" },
          { label: "Guided Tour", href: "/vision/guided-tour" },
          { label: "Tech Specs", href: "/vision/specs" },
        ],
      },
      {
        title: "Shop Vision",
        links: [
          { label: "Shop Apple Vision Pro", href: "/shop/buy-vision" },
          { label: "Vision Pro Accessories", href: "/shop/accessories/vision" },
          { label: "Book a Demo", href: "/retail/demo" },
          { label: "Financing", href: "/shop/financing" },
        ],
      },
      {
        title: "More from Vision",
        links: [
          { label: "Vision Support", href: "/support/vision" },
          { label: "AppleCare+", href: "/applecare" },
          { label: "visionOS 27 Preview", href: "/os/visionos" },
        ],
      },
    ],
  },
  airpods: {
    id: "airpods",
    label: "AirPods",
    href: "/airpods",
    columns: [
      {
        title: "Explore AirPods",
        isElevated: true,
        links: [
          { label: "Explore All AirPods", href: "/airpods" },
          { label: "AirPods 4", href: "/airpods-4" },
          { label: "AirPods Pro 2", href: "/airpods-pro-2" },
          { label: "AirPods Max", href: "/airpods-max" },
        ],
      },
      {
        title: "Shop AirPods",
        links: [
          { label: "Shop AirPods", href: "/shop/buy-airpods" },
          { label: "AirPods Accessories", href: "/shop/accessories/airpods" },
        ],
      },
      {
        title: "More from AirPods",
        links: [
          { label: "AirPods Support", href: "/support/airpods" },
          { label: "AppleCare+", href: "/applecare" },
          { label: "Apple Music", href: "/apple-music" },
        ],
      },
    ],
  },
  "tv-home": {
    id: "tv-home",
    label: "TV & Home",
    href: "/tv-home",
    columns: [
      {
        title: "Explore TV & Home",
        isElevated: true,
        links: [
          { label: "Explore TV & Home", href: "/tv-home" },
          { label: "Apple TV 4K", href: "/apple-tv-4k" },
          { label: "HomePod", href: "/homepod" },
          { label: "HomePod mini", href: "/homepod-mini" },
        ],
      },
      {
        title: "Shop TV & Home",
        links: [
          { label: "Shop Apple TV 4K", href: "/shop/buy-tv" },
          { label: "Shop HomePod", href: "/shop/buy-homepod" },
          { label: "Home Accessories", href: "/shop/accessories/home" },
        ],
      },
      {
        title: "More from TV & Home",
        links: [
          { label: "Apple TV Support", href: "/support/tv" },
          { label: "HomePod Support", href: "/support/homepod" },
          { label: "Apple TV App", href: "/apple-tv-app" },
          { label: "Apple TV+", href: "/apple-tv-plus" },
          { label: "Home App", href: "/home-app" },
          { label: "Apple Music", href: "/apple-music" },
          { label: "AirPlay", href: "/airplay" },
        ],
      },
    ],
  },
  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    href: "/entertainment",
    columns: [
      {
        title: "Explore Entertainment",
        isElevated: true,
        links: [
          { label: "Apple One", href: "/apple-one" },
          { label: "Apple TV+", href: "/apple-tv-plus" },
          { label: "Apple Music", href: "/apple-music" },
          { label: "Apple Arcade", href: "/apple-arcade" },
          { label: "Apple Fitness+", href: "/apple-fitness-plus" },
          { label: "Apple News+", href: "/apple-news" },
          { label: "Apple Podcasts", href: "/apple-podcasts" },
          { label: "Apple Books", href: "/apple-books" },
          { label: "App Store", href: "/app-store" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Apple TV+ Support", href: "/support/tv-plus" },
          { label: "Apple Music Support", href: "/support/music" },
        ],
      },
    ],
  },
  accessories: {
    id: "accessories",
    label: "Accessories",
    href: "/accessories",
    columns: [
      {
        title: "Shop Accessories",
        isElevated: true,
        links: [
          { label: "Shop All Accessories", href: "/shop/accessories" },
          { label: "Mac", href: "/shop/accessories/mac" },
          { label: "iPad", href: "/shop/accessories/ipad" },
          { label: "iPhone", href: "/shop/accessories/iphone" },
          { label: "Apple Watch", href: "/shop/accessories/watch" },
          { label: "AirPods", href: "/shop/accessories/airpods" },
        ],
      },
      {
        title: "Explore Accessories",
        links: [
          { label: "Made by Apple", href: "/shop/accessories/apple" },
          { label: "Beats by Dr. Dre", href: "/beats" },
          { label: "AirTag", href: "/airtag" },
        ],
      },
    ],
  },
  support: {
    id: "support",
    label: "Support",
    href: "/support",
    columns: [
      {
        title: "Explore Support",
        isElevated: true,
        links: [
          { label: "iPhone", href: "/support/iphone" },
          { label: "Mac", href: "/support/mac" },
          { label: "iPad", href: "/support/ipad" },
          { label: "Watch", href: "/support/watch" },
          { label: "Apple Vision Pro", href: "/support/vision" },
          { label: "AirPods", href: "/support/airpods" },
          { label: "Music", href: "/support/music" },
          { label: "TV", href: "/support/tv" },
        ],
      },
      {
        title: "Get Help",
        links: [
          { label: "Community", href: "https://discussions.apple.com" },
          { label: "Check Coverage", href: "https://checkcoverage.apple.com" },
          { label: "Repair", href: "https://support.apple.com/repair" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
      {
        title: "Helpful Topics",
        links: [
          { label: "Get AppleCare+", href: "/applecare" },
          { label: "Apple ID & Password", href: "https://iforgot.apple.com" },
          { label: "Billing & Subscriptions", href: "/support/billing" },
          { label: "Find My", href: "/find-my" },
          { label: "Accessibility", href: "/accessibility" },
        ],
      },
    ],
  },
};
