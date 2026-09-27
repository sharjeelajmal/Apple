export type SiteLink = {
  label: string;
  href: string;
};

export type SiteLinkGroup = {
  title: string;
  links: SiteLink[];
};

export const footerLinkGroups: SiteLinkGroup[] = [
  {
    title: "My Account",
    links: [
      { label: "Sign In", href: "/account/login" },
      { label: "Order Status", href: "/account/orders" },
      { label: "Refund Policy", href: "/pages/refund-policy" },
      { label: "Site Map", href: "/pages/sitemap" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Blog", href: "/blogs/news" },
      { label: "Jobs", href: "/pages/jobs" },
      { label: "FAQ", href: "/pages/faq" },
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
    ],
  },
];

export const sitemapGroups: SiteLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "Home", href: "/" },
      { label: "Store", href: "/storeone" },
      { label: "All Products", href: "/collections/all" },
      { label: "Mac", href: "/collections/macbook" },
      { label: "iPhone", href: "/collections/iphone" },
      { label: "Shopping Bag", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/account/login" },
      { label: "Create Account", href: "/account/register" },
      { label: "Account Overview", href: "/account" },
      { label: "Order Status", href: "/account/orders" },
      { label: "Saved Addresses", href: "/account/addresses" },
      { label: "Account Settings", href: "/account/settings" },
    ],
  },
  {
    title: "About Aplee",
    links: [
      { label: "About Us", href: "/pages/about" },
      { label: "Contact Us", href: "/pages/contact" },
      { label: "Jobs", href: "/pages/jobs" },
      { label: "Blog", href: "/blogs/news" },
    ],
  },
  {
    title: "Help & Policies",
    links: [
      { label: "FAQ", href: "/pages/faq" },
      { label: "Shipping Policy", href: "/pages/shipping-policy" },
      { label: "Refund Policy", href: "/pages/refund-policy" },
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms of Use", href: "/pages/terms-of-use" },
    ],
  },
];
