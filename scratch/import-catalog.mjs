import { readFileSync, writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const env = Object.fromEntries(
  readFileSync("../.env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)])
);

const { catalog, home } = JSON.parse(readFileSync("catalog-final.json", "utf8"));
const client = new MongoClient(env.MONGODB_URI);
const db = client.db(env.MONGODB_DB_NAME);
const products = db.collection("products");
const cms = db.collection("cms");

const handlesOf = (category, count) => catalog.filter((p) => p.category === category).slice(0, count).map((p) => p.handle);
const fromPrice = (handle) => {
  const product = catalog.find((p) => p.handle === handle);
  if (!product) throw new Error(`Unknown handle ${handle}`);
  return `FROM $${product.basePrice.toLocaleString("en-US")}`;
};
const priceText = (handle) => fromPrice(handle).replace("FROM", "Starting at");

const backup = {
  products: await products.find().toArray(),
  cms: await cms.findOne({ _id: "home" }),
};
writeFileSync(`backup-before-import-${Date.now()}.json`, JSON.stringify(backup, null, 2));
console.log(`Backed up ${backup.products.length} products and home content.`);

const now = Date.now();
const documents = catalog.map((product, index) => {
  const createdAt = new Date(now - index * 60_000);
  return { ...product, createdAt, updatedAt: createdAt };
});

await products.deleteMany({});
await products.insertMany(documents);
await products.createIndex({ handle: 1 }, { unique: true });
console.log(`Inserted ${documents.length} products.`);

const existing = backup.cms?.content ?? {};
const content = {
  heroSlides: [
    {
      id: "iphone-18-pro",
      subtitle: "New",
      title: "iPhone 18 Pro",
      description: `Pro further. ${priceText("iphone-18-pro")}`,
      buttonText: "Shop Now",
      buttonLink: "/products/iphone-18-pro",
      image: home.iphone18Pro,
    },
    {
      id: "iphone-duo",
      subtitle: "New",
      title: "iPhone Duo",
      description: `Hello, hello. ${priceText("iphone-duo")}`,
      buttonText: "Shop Now",
      buttonLink: "/products/iphone-duo",
      image: home.iphoneDuo,
    },
    {
      id: "macbook-air-m5",
      subtitle: "Now supercharged by M5",
      title: "MacBook Air",
      description: priceText("macbook-air-13-inch-m5"),
      buttonText: "Shop Now",
      buttonLink: "/products/macbook-air-13-inch-m5",
      image: home.macbookAir,
    },
  ],
  categoryBanners: [
    { id: "watch-series-12", title: "Apple Watch\nSeries 12", subtitle: fromPrice("apple-watch-series-12"), image: home.watchSeries12, link: "/products/apple-watch-series-12" },
    { id: "ipad-air-m4", title: "iPad Air\nM4", subtitle: fromPrice("ipad-air-11-inch-m4"), image: home.ipadAir, link: "/products/ipad-air-11-inch-m4" },
    { id: "watch-ultra-4", title: "Apple Watch\nUltra 4", subtitle: fromPrice("apple-watch-ultra-4"), image: home.watchUltra4, link: "/products/apple-watch-ultra-4" },
  ],
  carousel: {
    title: "The Latest iPhone",
    subtitle: "From iPhone Duo to iPhone 17e, find the one that's right for you.",
    productHandles: handlesOf("iphone", 8),
  },
  testimonial: {
    author: "Mila Kunis",
    role: "Marketing Manager",
    quote:
      "Perfect Themes and the best of all that you have many options to choose! Best Support team ever! Very fast responding and experts on their fields! Thank you very much!",
    avatar: "https://bigon-6.myshopify.com/cdn/shop/files/t2_150x.png?v=1643609805",
    ...(existing.testimonial ?? {}),
    productHandles: handlesOf("apple-watch", 4),
  },
};

await cms.updateOne(
  { _id: "home" },
  { $set: Object.fromEntries([...Object.entries(content).map(([key, value]) => [`content.${key}`, value]), ["updatedAt", new Date()]]) },
  { upsert: true }
);
console.log("Updated home sections:", Object.keys(content).join(", "));

const validIds = new Set((await products.find({}, { projection: { _id: 1 } }).toArray()).map((p) => String(p._id)));
const wishlists = await db.collection("wishlists").find().toArray();
for (const wishlist of wishlists) {
  const items = wishlist.items.filter((item) => validIds.has(item.id));
  if (items.length !== wishlist.items.length) {
    await db.collection("wishlists").updateOne({ _id: wishlist._id }, { $set: { items, updatedAt: new Date() } });
  }
}
console.log(`Checked ${wishlists.length} wishlists.`);

await client.close();
