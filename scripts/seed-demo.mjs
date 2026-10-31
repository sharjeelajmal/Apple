import { readFileSync } from "node:fs";
import { MongoClient, ObjectId } from "mongodb";

const DEMO_USER = { name: "Demo Customer", email: "demo@appleofficial.com", password: "DemoShopper#2026" };
const DAY_MS = 24 * 60 * 60 * 1000;

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).replace(/^"|"$/g, "")])
);
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

const reviewers = ["Ayesha K.", "Bilal R.", "Sara M.", "Hamza A.", "Zainab F.", "Omar S.", "Hina T.", "Usman Q."];

const demoReviews = {
  "iphone-17": [
    [5, "Best phone I've owned", "Battery easily lasts a full day with heavy use, and the 256GB base storage means I never worry about space. Photos at night look much better than my old phone."],
    [4, "Great camera, slightly heavy", "Camera Control is handy once you get used to it and video is very stable. It feels a little heavier than my iPhone 13 but the screen is gorgeous."],
    [5, "Smooth and fast", "The 120Hz display makes everything feel smooth. Apps open instantly and it stays cool even while gaming for an hour."],
    [3, "Good, but charger not included", "Phone itself is excellent and the Lavender color is lovely. I wish a charger came in the box, I had to buy one separately."],
    [5, "Worth the upgrade", "Coming from an iPhone 11 the difference is huge: brighter screen, much better low-light photos and the battery lasts noticeably longer."],
  ],
  "iphone-17-pro": [
    [5, "Pro camera is unreal", "The telephoto zoom is amazing for concerts and the portraits look professional. Video quality is the best I've seen on a phone."],
    [4, "Fantastic but pricey", "Performance and battery are top notch. It's expensive compared to the regular iPhone 17, so only worth it if you really use the camera."],
    [5, "Battery champion", "I get almost two days with normal use. Charging is quick and the Cosmic Orange finish gets compliments everywhere."],
    [4, "Heats a little when charging", "Gets slightly warm on fast charging but never while using it. Otherwise everything about it is excellent."],
  ],
  "iphone-air": [
    [5, "So thin and light", "It barely feels like I'm carrying a phone. The screen is big and bright, perfect for reading and videos."],
    [3, "Battery is just okay", "Love the design, but with heavy use I need to top up in the evening. Single camera is good but not as flexible as the Pro."],
    [4, "Beautiful everyday phone", "If you mostly use social media, calls and photos, it's perfect. The Sky Blue color looks premium."],
    [4, "Premium feel", "Build quality is fantastic. I miss the ultra-wide camera sometimes, but the main camera is excellent."],
  ],
  "macbook-air-13-inch-m5": [
    [5, "Perfect for university", "Light enough to carry all day and the battery lasts through all my lectures with plenty left. Completely silent since there's no fan."],
    [5, "Fast for coding", "Compiles and runs my projects quickly, handles Docker and many browser tabs without slowing down. Screen is sharp and bright."],
    [4, "Great, wish it had more ports", "Excellent laptop overall. Only two USB-C ports means I carry a small hub for my monitor and USB drive."],
    [5, "Video editing on the go", "Edits 4K clips in Final Cut smoothly. Speakers are surprisingly good for such a thin laptop."],
    [4, "Lovely Sky Blue", "Keyboard is comfortable and the trackpad is the best I've used. 512GB base storage is a welcome change."],
  ],
  "ipad-pro-13-inch-m5": [
    [5, "The screen is stunning", "Watching movies on this display is incredible, blacks are deep and colors pop. Pairs perfectly with Apple Pencil for drawing."],
    [4, "Laptop replacement, almost", "With the Magic Keyboard I use it for most work. Some desktop apps are still missing, so it can't fully replace my Mac."],
    [5, "Artist's dream", "Pencil latency feels like paper. Procreate runs flawlessly even with huge canvases and many layers."],
    [3, "Expensive with accessories", "The iPad is fantastic, but adding the keyboard and Pencil makes it very pricey. Make sure you need the Pro features."],
  ],
  "apple-watch-series-12": [
    [5, "Health tracking is excellent", "Sleep and heart rate tracking are accurate and the workout detection works great for walks and runs."],
    [4, "Battery could be better", "Lasts about a day and a half for me. Fast charging helps, but I charge it every night."],
    [5, "Bright, useful display", "Always-On display is easy to read in sunlight. Notifications and Apple Pay on the wrist save me so much time."],
    [4, "Comfortable all day", "Light enough to sleep with. Wish there were more watch faces, but the fitness features are great."],
  ],
};

const demoQuestions = {
  "iphone-17": [["Does it support two SIM cards?", "Yes. It supports eSIM, and you can keep two numbers active at the same time."]],
  "macbook-air-13-inch-m5": [["Can it connect to two external monitors?", "Yes, with the lid closed it can drive two external displays."]],
  "ipad-pro-13-inch-m5": [["Does the Apple Pencil come in the box?", "No, Apple Pencil is sold separately."]],
};

const client = await MongoClient.connect(env.MONGODB_URI);
const db = client.db(env.MONGODB_DB_NAME);
const collections = {
  users: db.collection("user"),
  sessions: db.collection("session"),
  accounts: db.collection("account"),
  products: db.collection("products"),
  orders: db.collection("orders"),
  reviews: db.collection("reviews"),
  questions: db.collection("product_questions"),
  wishlists: db.collection("wishlists"),
  alerts: db.collection("product_alerts"),
  aiCache: db.collection("ai_cache"),
  chats: db.collection("assistant_conversations"),
  chatMessages: db.collection("assistant_messages"),
};

async function refreshRatings(productIds) {
  for (const productId of productIds) {
    const reviews = await collections.reviews.find({ productId, status: "published" }).toArray();
    const total = reviews.length;
    const rating = total ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / total) * 10) / 10 : 0;
    await collections.products.updateOne({ _id: new ObjectId(productId) }, { $set: { rating, totalReviews: total } });
  }
}

async function removeDemoData() {
  const user = await collections.users.findOne({ email: DEMO_USER.email });
  const productIds = await collections.reviews.distinct("productId", { isDemo: true });

  await collections.reviews.deleteMany({ isDemo: true });
  await collections.questions.deleteMany({ isDemo: true });
  await collections.orders.deleteMany({ isDemo: true });
  await collections.aiCache.deleteMany({});
  if (user) {
    const userId = String(user._id);
    await collections.wishlists.deleteMany({ userId });
    await collections.alerts.deleteMany({ userId });
    const chatIds = await collections.chats.distinct("_id", { userId });
    await collections.chatMessages.deleteMany({ conversationId: { $in: chatIds } });
    await collections.chats.deleteMany({ userId });
    await collections.sessions.deleteMany({ userId: user._id });
    await collections.accounts.deleteMany({ userId: user._id });
    await collections.users.deleteOne({ _id: user._id });
  }
  await refreshRatings(productIds);
  console.log("Demo data removed.");
}

async function createDemoUser() {
  const response = await fetch(`${siteUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: siteUrl },
    body: JSON.stringify(DEMO_USER),
  });
  if (!response.ok) throw new Error(`Couldn't create the demo user (${response.status}). Is the dev server running at ${siteUrl}?`);
  const user = await collections.users.findOne({ email: DEMO_USER.email });
  await collections.users.updateOne({ _id: user._id }, { $set: { isDemo: true } });
  return String(user._id);
}

const productsByHandle = async (handles) =>
  new Map((await collections.products.find({ handle: { $in: handles } }).toArray()).map((product) => [product.handle, product]));

const orderItem = (product, quantity = 1) => {
  const variant = product.variants[0];
  return {
    id: `${product._id}-${variant.storage}-${variant.color.hex}`,
    productId: String(product._id),
    title: product.title,
    handle: product.handle,
    price: variant.price,
    image: variant.image || product.images[0],
    quantity,
    variant: { storage: variant.storage, colorHex: variant.color.hex, colorName: variant.color.name },
  };
};

async function seedDemoData() {
  await removeDemoData();
  const userId = await createDemoUser();
  const now = Date.now();
  const products = await productsByHandle([
    ...Object.keys(demoReviews),
    "apple-watch-ultra-4",
    "ipad-air-11-inch-m4",
  ]);

  const contact = { firstName: "Demo", lastName: "Customer", email: DEMO_USER.email, phone: "+1 613 555 0100" };
  const address = { street: "120 Wellington Street", apartment: "Suite 4", city: "Ottawa", state: "ON", postalCode: "K1A 0A9", country: "CA" };
  const orders = [
    { number: "WDEMO10001", handle: "iphone-17", status: "delivered", placedDaysAgo: 8, deliveredDaysAgo: 3 },
    { number: "WDEMO10002", handle: "apple-watch-series-12", status: "placed", placedDaysAgo: 0 },
    { number: "WDEMO10003", handle: "macbook-air-13-inch-m5", status: "shipped", placedDaysAgo: 2 },
    { number: "WDEMO10004", handle: "ipad-air-11-inch-m4", status: "delivered", placedDaysAgo: 50, deliveredDaysAgo: 45 },
  ];
  await collections.orders.insertMany(
    orders.map((order) => {
      const item = orderItem(products.get(order.handle));
      const createdAt = new Date(now - order.placedDaysAgo * DAY_MS);
      return {
        orderNumber: order.number,
        userId,
        items: [item],
        subtotal: item.price,
        paymentMethod: "visa",
        status: order.status,
        createdAt,
        estimatedDelivery: new Date(createdAt.getTime() + 5 * DAY_MS),
        ...(order.deliveredDaysAgo !== undefined && { deliveredAt: new Date(now - order.deliveredDaysAgo * DAY_MS) }),
        contact,
        shippingAddress: address,
        billingAddress: address,
        card: { brand: "Visa", last4: "4242", expiry: "12/29", holderName: "Demo Customer" },
        isDemo: true,
      };
    })
  );

  await collections.wishlists.updateOne(
    { userId },
    {
      $set: {
        items: ["ipad-pro-13-inch-m5", "apple-watch-ultra-4"].map((handle) => {
          const product = products.get(handle);
          return { id: String(product._id), title: product.title, handle, price: product.variants[0].price, image: product.images[0] };
        }),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  const reviewDocs = Object.entries(demoReviews).flatMap(([handle, reviews], productIndex) =>
    reviews.map(([rating, title, body], index) => ({
      productId: String(products.get(handle)._id),
      userId: `demo-reviewer-${productIndex}-${index}`,
      authorName: reviewers[(productIndex + index) % reviewers.length],
      authorEmail: `reviewer${productIndex}${index}@demo.appleofficial.com`,
      rating,
      title,
      body,
      photos: [],
      verifiedPurchase: index % 3 !== 2,
      status: "published",
      createdAt: new Date(now - (index * 6 + productIndex + 1) * DAY_MS),
      isDemo: true,
    }))
  );
  await collections.reviews.insertMany(reviewDocs);

  await collections.questions.insertMany(
    Object.entries(demoQuestions).flatMap(([handle, questions]) =>
      questions.map(([question, answer], index) => ({
        productId: String(products.get(handle)._id),
        userId: `demo-asker-${handle}-${index}`,
        authorName: reviewers[index + 2],
        authorEmail: `asker${index}@demo.appleofficial.com`,
        question,
        answer,
        answeredAt: new Date(now - 2 * DAY_MS),
        status: "published",
        createdAt: new Date(now - 4 * DAY_MS),
        isDemo: true,
      }))
    )
  );

  await refreshRatings([...new Set(reviewDocs.map((review) => review.productId))]);
  console.log(`Demo data ready.
  Sign in: ${DEMO_USER.email} / ${DEMO_USER.password}
  Orders: 4 (one cancellable, one returnable) · Wishlist: 2 · Reviews: ${reviewDocs.length} on ${Object.keys(demoReviews).length} products`);
}

const WARM_UP_PAGES = [
  "/compare?items=iphone-17-pro,iphone-17,iphone-air",
  ...Object.keys(demoReviews).map((handle) => `/products/${handle}`),
];

async function warmUpAi() {
  console.log("Preparing AI results so the demo opens instantly…");
  for (const path of WARM_UP_PAGES) {
    const response = await fetch(`${siteUrl}${path}`).catch(() => null);
    await response?.text();
    console.log(`  ${response?.ok ? "ready" : "skipped"} ${path}`);
  }
}

try {
  if (process.argv.includes("--remove")) {
    await removeDemoData();
  } else {
    await seedDemoData();
    await warmUpAi();
  }
} finally {
  await client.close();
}
