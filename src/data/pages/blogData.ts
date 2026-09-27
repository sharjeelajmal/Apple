export type BlogBlock = { type: "heading" | "paragraph"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  content: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "iphone-16-pro-first-impressions",
    title: "iPhone 16 Pro: Our first impressions after two weeks",
    excerpt: "A bigger display, a smarter camera, and battery life that finally lasts well into the night. Here's what stood out.",
    category: "Reviews",
    image: "/images/store/products/store-iphone-16-pro.jpg",
    author: "Sarah Mitchell",
    publishedAt: "2026-09-18",
    readTime: "6 min read",
    content: [
      { type: "paragraph", text: "We've spent two weeks with iPhone 16 Pro as our daily phone. It's not a reinvention, but it's the most complete iPhone we've used." },
      { type: "heading", text: "The display" },
      { type: "paragraph", text: "The slightly larger screen and thinner borders make everything feel more immersive, while the always-on mode is noticeably more power efficient." },
      { type: "heading", text: "Camera Control" },
      { type: "paragraph", text: "The new Camera Control button takes a day to get used to, but once it clicks, launching the camera and adjusting exposure becomes second nature." },
      { type: "heading", text: "Should you upgrade?" },
      { type: "paragraph", text: "If you're coming from iPhone 13 or older, the jump in camera quality and battery life is well worth it. Newer owners can comfortably wait." },
    ],
  },
  {
    slug: "choosing-the-right-macbook",
    title: "MacBook Air or MacBook Pro? How to choose the right Mac",
    excerpt: "Both are fantastic, but they're built for different people. We break down which one fits the way you work.",
    category: "Buying Guides",
    image: "/images/store/products/store-macbook-air.jpg",
    author: "Daniel Park",
    publishedAt: "2026-09-10",
    readTime: "8 min read",
    content: [
      { type: "paragraph", text: "Choosing between MacBook Air and MacBook Pro comes down to one question: how hard will you push it?" },
      { type: "heading", text: "Choose MacBook Air if…" },
      { type: "paragraph", text: "You mostly browse, write, stream, and work in productivity apps. It's silent, incredibly light, and its battery comfortably lasts a full day." },
      { type: "heading", text: "Choose MacBook Pro if…" },
      { type: "paragraph", text: "You edit video, work with large photo libraries, compile code, or run pro apps for hours. Active cooling and more ports make a real difference." },
    ],
  },
  {
    slug: "ipad-air-for-students",
    title: "Why iPad Air is the ultimate student device",
    excerpt: "Notes, textbooks, and creativity in one lightweight device. Here's how to set it up for the school year.",
    category: "Tips & Tricks",
    image: "/images/store/products/store-ipad-air.jpg",
    author: "Emily Chen",
    publishedAt: "2026-08-28",
    readTime: "5 min read",
    content: [
      { type: "paragraph", text: "With Apple Pencil and a keyboard, iPad Air replaces a stack of notebooks and a laptop for most students." },
      { type: "heading", text: "Must-have setup" },
      { type: "paragraph", text: "Turn on Scribble to write in any text field, organize your subjects in Notes folders, and use Split View to read and take notes side by side." },
      { type: "heading", text: "Protect your investment" },
      { type: "paragraph", text: "A good case and screen protector go a long way. Consider extended coverage if your iPad travels to class every day." },
    ],
  },
  {
    slug: "airpods-max-sound-guide",
    title: "Getting the best sound out of AirPods Max",
    excerpt: "Spatial audio, EQ, and fit. Small tweaks that make a big difference to how your headphones sound.",
    category: "Tips & Tricks",
    image: "/images/store/products/store-airpods-max.jpg",
    author: "Marcus Lee",
    publishedAt: "2026-08-14",
    readTime: "4 min read",
    content: [
      { type: "paragraph", text: "AirPods Max sound great out of the box, but a few settings can take them even further." },
      { type: "heading", text: "Personalize Spatial Audio" },
      { type: "paragraph", text: "Use your iPhone's TrueDepth camera to create a personalized profile. It tailors spatial audio to the shape of your ears." },
      { type: "heading", text: "Check the fit" },
      { type: "paragraph", text: "Adjust the headband so the ear cushions sit evenly. A good seal improves both bass response and noise cancellation." },
    ],
  },
  {
    slug: "apple-intelligence-explained",
    title: "Apple Intelligence, explained in plain language",
    excerpt: "What it is, which devices support it, and the features you'll actually use every day.",
    category: "News",
    image: "/images/store/products/store-intelligence.jpg",
    author: "Sarah Mitchell",
    publishedAt: "2026-07-30",
    readTime: "7 min read",
    content: [
      { type: "paragraph", text: "Apple Intelligence brings helpful AI features into the apps you already use, with a strong focus on privacy." },
      { type: "heading", text: "Everyday features" },
      { type: "paragraph", text: "Writing Tools can proofread and rewrite text anywhere, notification summaries cut through the noise, and Siri understands context far better." },
      { type: "heading", text: "Privacy first" },
      { type: "paragraph", text: "Most requests are processed on-device. When more power is needed, Private Cloud Compute handles them without storing your data." },
    ],
  },
  {
    slug: "homepod-smart-home-setup",
    title: "Build a smarter home with HomePod",
    excerpt: "From morning routines to energy savings, here's how HomePod ties your smart home together.",
    category: "Buying Guides",
    image: "/images/store/products/store-homepod.jpg",
    author: "Daniel Park",
    publishedAt: "2026-07-12",
    readTime: "5 min read",
    content: [
      { type: "paragraph", text: "HomePod isn't just a speaker. It's a home hub that keeps your accessories connected and your automations running." },
      { type: "heading", text: "Start with a routine" },
      { type: "paragraph", text: "Create a Good Morning scene that turns on lights, opens the blinds, and plays the news with a single request." },
      { type: "heading", text: "Save energy" },
      { type: "paragraph", text: "Built-in temperature and humidity sensors can trigger fans or thermostats automatically, so you only use energy when you need it." },
    ],
  },
];

export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug);
