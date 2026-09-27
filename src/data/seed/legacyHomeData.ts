export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  hoverImage: string;
  handle: string;
  colors?: string[];
  isSoldOut?: boolean;
};

export type HeroSlide = {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgImage: string;
};

export type CategoryBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  quote: string;
  avatar: string;
};

export type NewsletterFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type HomeData = {
  heroSlides: HeroSlide[];
  categoryBanners: CategoryBanner[];
  carouselProducts: Product[];
  trendingCategories: string[];
  trendingProducts: Record<string, Product[]>;
  countdown: {
    endDate: string; // ISO String
    title: string;
    subtitle: string;
    bgImage: string;
  };
  featuredProducts: Product[];
  testimonial: Testimonial;
  testimonialProducts: Product[];
  newsletterFeatures: NewsletterFeature[];
};

export const homeData: HomeData = {
  heroSlides: [
    {
      id: "slide-1",
      subtitle: "Exclusive Offer -20% Off This Week",
      title: "Macbook Pro",
      description: "Starting at $1199.00",
      buttonText: "Shopping Now",
      buttonLink: "/collections/macbook",
      image: "https://bigon-6.myshopify.com/cdn/shop/files/ss1_copy_2048x2048.jpg?v=1643782619",
      bgImage: "https://bigon-6.myshopify.com/cdn/shop/files/ss1_copy_2048x2048.jpg?v=1643782619",
    },
    {
      id: "slide-2",
      subtitle: "Exclusive Offer -20% Off This Week",
      title: "iPad Pro",
      description: "Starting at $899.00",
      buttonText: "Shopping Now",
      buttonLink: "/collections/ipad",
      image: "https://bigon-6.myshopify.com/cdn/shop/files/ss2_copy_2048x2048.jpg?v=1643782759",
      bgImage: "https://bigon-6.myshopify.com/cdn/shop/files/ss2_copy_2048x2048.jpg?v=1643782759",
    }
  ],
  categoryBanners: [
    {
      id: "cat-1",
      title: "Smart\nWATCHES",
      subtitle: "FROM $45",
      image: "https://bigon-6.myshopify.com/cdn/shop/files/b2_2048x2048.jpg?v=1643520859",
      link: "/shop",
    },
    {
      id: "cat-2",
      title: "IPAD &\nIPAD AIR",
      subtitle: "FROM $99",
      image: "https://bigon-6.myshopify.com/cdn/shop/files/b1_2048x2048.jpg?v=1643522570",
      link: "/shop",
    },
    {
      id: "cat-3",
      title: "TV &\nVIDEO",
      subtitle: "FROM $17",
      image: "https://bigon-6.myshopify.com/cdn/shop/files/b1_2048x2048.png?v=1643522992",
      link: "/shop",
    }
  ],
  carouselProducts: [
    {
      id: "imac-pro",
      title: "Astor iMac Pro",
      price: 1199.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/6_74c1abfb-fc57-41a3-b6d6-d083b48f3fb8_800x.png?v=1643606138",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/9_036495cb-64bc-44a5-9238-dcfb6fb5cc30_800x.jpg?v=1643606138",
      handle: "apple-imac-pro"
    },
    {
      id: "iphone-13",
      title: "Apple iPhone 13",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/12_c626eb19-b68e-4f38-8ca0-6e4695dd1341_800x.jpg?v=1643605822",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/9_036495cb-64bc-44a5-9238-dcfb6fb5cc30_800x.jpg?v=1643605822",
      handle: "apple-iphone-13"
    },
    {
      id: "imac-27",
      title: "Astor iMac 27-inch",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/9_ca0435ce-c591-4cf4-91f8-be582f3c7348_800x.jpg?v=1643605802",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/8_800x.png?v=1643605802",
      handle: "apple-imac-27-inch"
    },
    {
      id: "ipad-pro",
      title: "Astor iPad Pro",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/21_93080ff0-bde6-4e5a-a309-ddff805d259e_800x.png?v=1643605794",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/19_30f40d02-0c06-4bba-957f-1dcdfe8dd8c9_800x.png?v=1643605794",
      handle: "apple-ipad-pro"
    },
    {
      id: "macbook-air",
      title: "Macbook Air - 13-inch",
      price: 199.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/8_57a41ec5-fb8d-4a1e-8e8e-cba1dcd79fc0_800x.png?v=1643605655",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/7_e652431b-10f7-4148-bd06-bb24cde8b749_800x.jpg?v=1643605655",
      handle: "macbook-air-13-inch"
    }
  ],
  trendingCategories: ["Macbook", "Pad", "Watch"],
  trendingProducts: {
    "Macbook": [
      {
        id: "macbook-1",
        title: "Astor iMac 27-inch",
        price: 999.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/9_ca0435ce-c591-4cf4-91f8-be582f3c7348_800x.jpg?v=1643605802",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/8_800x.png?v=1643605802",
        handle: "apple-imac-27-inch",
      },
      {
        id: "macbook-2",
        title: "Macbook Air - 13-inch",
        price: 199.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/8_57a41ec5-fb8d-4a1e-8e8e-cba1dcd79fc0_800x.png?v=1643605655",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/7_e652431b-10f7-4148-bd06-bb24cde8b749_800x.jpg?v=1643605655",
        handle: "macbook-air-13-inch",
      },
      {
        id: "macbook-3",
        title: "Astor iMac Pro",
        price: 1199.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/6_74c1abfb-fc57-41a3-b6d6-d083b48f3fb8_800x.png?v=1643606138",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/9_036495cb-64bc-44a5-9238-dcfb6fb5cc30_800x.jpg?v=1643606138",
        handle: "apple-imac-pro",
      },
      {
        id: "macbook-4",
        title: "Macbook Pro - 16-inch",
        price: 999.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/5_a0f6a29e-c85d-4f1f-a3ff-243bc595d2c4_800x.png?v=1643605814",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/4_7621cba3-f25b-430c-ab5e-b8cd5db5dbfa_800x.png?v=1643605814",
        handle: "macbook-pro-16-inch",
      },
    ],
    "Pad": [
      {
        id: "pad-1",
        title: "iPad Air 2020 12.9 Inch",
        price: 599.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/20_6ae7f889-3719-42e9-b10d-a5a44b07a83b_800x.jpg?v=1643628035",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/22_c0e91f1e-3e84-48c6-b8c6-4776749b07b2_800x.jpg?v=1643628035",
        handle: "ipad-air-2020-12-9-inch",
        colors: ["#636166", "#d8c4d1", "#ffdad2"],
        isSoldOut: true,
      },
      {
        id: "pad-2",
        title: "Astor iPad Pro 12.9 Inch",
        price: 599.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/22_8f56deb1-a60c-4bb8-8451-e92d1ecac721_800x.jpg?v=1643627967",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/18_59783586-b453-4753-b41f-403c4e6e1000_800x.jpg?v=1643627967",
        handle: "apple-ipad-pro-12-9-inch",
        colors: ["#636166", "#d8c4d1", "#ffdad2"],
        isSoldOut: true,
      },
      {
        id: "pad-3",
        title: "Astor iPad Pro 11 Inch",
        price: 999.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/18_800x.jpg?v=1643627742",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/20_800x.jpg?v=1643627742",
        handle: "apple-ipad-pro-11-inch",
        colors: ["#636166", "#d8c4d1", "#ffdad2"],
        isSoldOut: false,
      },
    ],
    "Watch": [
      {
        id: "watch-1",
        title: "Apple Watch Series 6",
        price: 399.00,
        image: "https://bigon-6.myshopify.com/cdn/shop/products/2_30595353-85b2-4dff-bc8d-bf3ebffb74b1_800x.jpg?v=1643627196",
        hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/5_ecbe3311-2eb9-4c6e-827c-95b77c5f8dfb_800x.jpg?v=1643627196",
        handle: "apple-watch",
        colors: ["#333333", "#d8c4d1"],
        isSoldOut: false,
      },
    ]
  },
  countdown: {
    endDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Count down is going on...",
    subtitle: "FOR ALL EXCLUSIVE COLLETIONS",
    bgImage: "https://bigon-6.myshopify.com/cdn/shop/files/erer.jpg?v=1643689002",
  },
  featuredProducts: [
    {
      id: "iphone-1",
      title: "Astor iPhone 13 Pro - 128GB / gray",
      price: 150.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/11_466b7e59-bd93-4b4d-bfbb-cef9994ea83a_800x.jpg?v=1643606162",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/9_6d108dce-09d5-455f-bee3-2771c50bbd5c_800x.jpg?v=1643606162",
      handle: "apple-iphone-13-pro",
      colors: ["#333333", "#d8c4d1", "#ffdad2"],
      isSoldOut: false,
    },
    {
      id: "iphone-2",
      title: "Apple iPhone 12 Pro",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/10_63a40498-8ec4-4f40-8b1e-ccf8a0bcda6d_800x.jpg?v=1643605809",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/11_e9621370-1282-4f0f-8b27-5264b9ab06cc_800x.jpg?v=1643605809",
      handle: "apple-iphone-12-pro",
      colors: ["#333333", "#d8c4d1", "#ffdad2"],
      isSoldOut: true,
    },
    {
      id: "iphone-3",
      title: "Astor iPhone 13 mini",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/7_e86b0337-0ea8-4038-ba09-245ed8b01235_800x.jpg?v=1643605742",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/9_9eb6a132-dfc7-45ba-bc5d-6c84131575ce_800x.jpg?v=1643605742",
      handle: "apple-iphone-13-mini",
      colors: ["#333333", "#d8c4d1", "#ffdad2"],
      isSoldOut: false,
    },
  ],
  testimonial: {
    id: "t-1",
    author: "Mila Kunis",
    role: "Marketing Manager",
    quote: "Perfect Themes and the best of all that you have many options to choose! Best Support team ever! Very fast responding and experts on their fields! Thank you very much!",
    avatar: "https://bigon-6.myshopify.com/cdn/shop/files/t2_150x.png?v=1643609805"
  },
  testimonialProducts: [
    {
      id: "watch-4",
      title: "Astor Watch Series 4",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/25_800x.png?v=1643625406",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/24_01357c15-0fe7-4bb6-9db6-6307952f5c71_800x.png?v=1643625406",
      handle: "apple-watch-series-4",
    },
    {
      id: "watch-gold",
      title: "Watch Gold Series 4",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/24_76420093-07fc-490e-bdbd-38c71a4d8016_800x.png?v=1643625337",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/29_ac493aff-5c05-465b-b996-0ad24093cb4a_800x.png?v=1643625337",
      handle: "watch-gold-series-4",
    },
    {
      id: "watch-black",
      title: "New Watch Series Black",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/29_3969ab5c-333c-4712-bc11-c1e60510367d_800x.png?v=1643625211",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/28_b79dc524-d48e-404d-8384-0358251f2d03_800x.png?v=1643625211",
      handle: "new-watch-series-black",
    },
    {
      id: "watch-5",
      title: "Astor Watch Series 5",
      price: 999.00,
      image: "https://bigon-6.myshopify.com/cdn/shop/products/28_800x.png?v=1643625055",
      hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/30_36b460e7-db63-4a6d-af3c-1eab7c3d27be_800x.png?v=1643625055",
      handle: "apple-watch-series-5",
    }
  ],
  newsletterFeatures: [
    {
      id: "f-1",
      title: "Free delivery",
      description: "And free returns. See checkout <br /> for delivery dates.",
      icon: "https://bigon-6.myshopify.com/cdn/shop/files/i2-2_medium.png?v=1643693756"
    },
    {
      id: "f-2",
      title: "Pay monthly at 0% APR",
      description: "Choose to check out with Apple <br /> Card Monthly Installments.",
      icon: "https://bigon-6.myshopify.com/cdn/shop/files/i2_medium.png?v=1643693836"
    },
    {
      id: "f-3",
      title: "Personalize it",
      description: "Engrave your device with your <br /> name or a personal note",
      icon: "https://bigon-6.myshopify.com/cdn/shop/files/gmm_medium.png?v=1643693938"
    }
  ]
};
