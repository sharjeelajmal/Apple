import { readFileSync, writeFileSync } from "node:fs";
import { v2 as cloudinary } from "cloudinary";

const env = Object.fromEntries(
  readFileSync("../.env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)])
);
cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET, secure: true });

const raw = JSON.parse(readFileSync("catalog-raw.json", "utf8"));
const live = JSON.parse(readFileSync("live-prices.json", "utf8"));
const DEFAULT_STOCK = 10;

const storageSize = (value) => {
  const match = value.match(/^(\d+)(GB|TB|mm)$/);
  return match ? Number(match[1]) * (match[2] === "TB" ? 1024 : 1) : 0;
};
const sortTable = (table) => Object.fromEntries(Object.entries(table).sort(([a], [b]) => storageSize(a) - storageSize(b)));

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const cleanTitle = (name) => name.replace(/[‐-―]/g, "-").replace(/-in\./g, "-inch").replace(/\s+/g, " ").trim();

const iphonePrices = {
  "iPhone 17 Pro": { "256GB": 1099, "512GB": 1299, "1TB": 1499 },
  "iPhone 17 Pro Max": { "256GB": 1199, "512GB": 1399, "1TB": 1599, "2TB": 1999 },
  "iPhone 16 Pro": { "128GB": 999, "256GB": 1099, "512GB": 1299, "1TB": 1499 },
  "iPhone 16 Pro Max": { "256GB": 1199, "512GB": 1399, "1TB": 1599 },
  "iPhone 16 Plus": { "128GB": 899, "256GB": 999, "512GB": 1199 },
  "iPhone 16e": { "128GB": 599, "256GB": 699, "512GB": 899 },
  "iPhone 15 Pro": { "128GB": 999, "256GB": 1099, "512GB": 1299, "1TB": 1499 },
  "iPhone 15 Pro Max": { "256GB": 1199, "512GB": 1399, "1TB": 1599 },
  "iPhone 15": { "128GB": 799, "256GB": 899, "512GB": 1099 },
  "iPhone 15 Plus": { "128GB": 899, "256GB": 999, "512GB": 1199 },
  "iPhone 14 Pro": { "128GB": 999, "256GB": 1099, "512GB": 1299, "1TB": 1499 },
  "iPhone 14 Pro Max": { "128GB": 1099, "256GB": 1199, "512GB": 1399, "1TB": 1599 },
  "iPhone 14": { "128GB": 799, "256GB": 899, "512GB": 1099 },
};

const liveIphoneTiers = () => {
  const tiers = {};
  for (const { name, price } of Object.values(live)) {
    const match = name.replace(/\s+/g, " ").match(/^(iPhone .+?) (\d+(?:GB|TB)) /);
    if (match) (tiers[match[1]] ??= {})[match[2]] = price;
  }
  tiers["iPhone 16"] = { "128GB": live.MYAP3.price, "256GB": live.MYAP3.price + 100 };
  return tiers;
};

const basePrices = {
  ipad: {
    "iPad Pro 13-inch (M5)": live.IPADPRO13_WI_2025.price,
    "iPad Pro 11-inch (M5)": live.IPADPRO11_WI_2025.price,
    "iPad Air 13-inch (M4)": live.IPADAIR13_2026_WI.price,
    "iPad Air 11-inch (M4)": live.IPADAIR11_2026_WI.price,
    "iPad (A16)": live.IPAD2025_WIFI.price,
    "iPad mini (A17 Pro)": live.IPADMINI2024_WIFI.price,
    "iPad Pro 13-inch (M4)": 1299,
    "iPad Pro 11-inch (M4)": 999,
    "iPad Air 13-inch (M3)": 799,
    "iPad Air 11-inch (M3)": 599,
    "iPad Air 13-inch (M2)": 799,
    "iPad Air 11-inch (M2)": 599,
    "iPad (10th generation)": 449,
    "iPad Pro 12.9-inch (6th generation)": 1099,
    "iPad Pro 11-inch (4th generation)": 799,
    "iPad mini (6th generation)": 499,
    "iPad Air (5th generation)": 599,
    "iPad (9th generation)": 329,
    "iPad Pro 12.9-inch (5th generation)": 1099,
    "iPad Pro 11-inch (3rd generation)": 799,
  },
  watch: {
    "Apple Watch Series 12": live.WS12_A_AL_DB_G.price,
    "Apple Watch Ultra 4": live.WATCH_UL_4_TI_C49.price,
    "Apple Watch SE 3": live.WSE5_A_AL_SL_G.price,
    "Apple Watch Series 11": 399,
    "Apple Watch Ultra 3": 799,
    "Apple Watch SE 2": 249,
    "Apple Watch Series 10": 399,
    "Apple Watch Ultra 2": 799,
    "Apple Watch Series 9": 399,
    "Apple Watch Ultra": 799,
    "Apple Watch Series 8": 399,
    "Apple Watch Series 7": 399,
    "Apple Watch Series 6": 399,
    "Apple Watch SE": 279,
  },
  mac: {
    "MacBook Neo (A18 Pro)": live.MBN_2026_MAIN.price,
    "MacBook Air 13-inch (M5)": live.MDH74.price,
    "MacBook Air 15-inch (M5)": live.MDV94.price,
    "MacBook Pro 14-inch (M5)": live.MACBOOKPRO_M5_MAIN_2026.price,
    "MacBook Pro 14-inch (M5 Pro)": live.MGDN4.price,
    "MacBook Pro 14-inch (M5 Max)": live.MGDQ4.price,
    "MacBook Pro 16-inch (M5 Pro)": live.MGE44.price,
    "MacBook Pro 16-inch (M5 Max)": live.MGE74.price,
    "MacBook Air 13-inch (M4)": 999,
    "MacBook Air 15-inch (M4)": 1199,
    "MacBook Pro 14-inch (M4 Max)": 3199,
    "MacBook Pro 14-inch (M4 Pro)": 1999,
    "MacBook Pro 14-inch (M4)": 1599,
    "MacBook Pro 16-inch (M4 Max)": 3499,
    "MacBook Pro 16-inch (M4 Pro)": 2499,
    "MacBook Air 13-inch (M3)": 1099,
    "MacBook Air 15-inch (M3)": 1299,
    "MacBook Pro 14-inch (M3)": 1599,
    "MacBook Pro 14-inch (M3 Pro or M3 Max)": 1999,
    "MacBook Pro 16-inch (M3 Pro or M3 Max)": 2499,
  },
};

const ipadStep = (from, to, isPro) =>
  ({ "64GB>256GB": 150, "128GB>256GB": 100, "256GB>512GB": 200, "512GB>1TB": isPro ? 400 : 200, "1TB>2TB": 400 })[`${from}>${to}`] ?? 200;
const macStep = (to) => ({ "512GB": 200, "1TB": 200, "2TB": 400, "4TB": 600, "8TB": 1200 })[to] ?? 200;

const tieredPrices = (options, base, step) => {
  const prices = {};
  options.forEach((option, index) => {
    prices[option] = index === 0 ? base : prices[options[index - 1]] + step(options[index - 1], option);
  });
  return prices;
};

const categoryConfig = {
  iphone: { slug: "iphone", type: "Smartphone" },
  ipad: { slug: "apple-ipad", type: "Tablet" },
  watch: { slug: "apple-watch", type: "Smartwatch" },
  mac: { slug: "macbook", type: "Laptop" },
};

function pricesFor(category, title, storages, iphoneTiers) {
  if (category === "iphone") {
    const table = iphoneTiers[title] ?? iphonePrices[title];
    if (!table) throw new Error(`No iPhone prices for ${title}`);
    return sortTable(table);
  }
  const base = basePrices[category][title];
  if (!base) throw new Error(`No base price for ${title}`);
  if (category === "ipad") return tieredPrices(storages, base, (from, to) => ipadStep(from, to, /Pro/.test(title)));
  if (category === "mac") return tieredPrices(storages, base, (_, to) => macStep(to));
  return tieredPrices(storages, base, () => 30);
}

const describe = (title, specs) => {
  const sentences = specs
    .map((spec) =>
      spec
        .replace(/^[^"]*">/, "")
        .replace(/"?>/g, " ")
        .replace(/\s+\d+$/, "")
        .replace(/\s·\s/g, ", ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .map((spec) => (/^(\d+GB\s*)+$/.test(spec) ? `Memory options: ${spec.split(/\s+/).join(", ")}` : spec))
    .map((spec) => (spec.length > 140 ? `${spec.slice(0, spec.lastIndexOf(" ", 140))}` : spec))
    .filter((spec, index, all) => all.findIndex((other) => other.toLowerCase() === spec.toLowerCase()) === index)
    .filter((spec) => spec.length > 3 && !/^(Wi-Fi|GPS|Available|New)$/i.test(spec))
    .slice(0, 10);
  return `${title}. ${sentences.join(". ")}.`.replace(/\.\./g, ".").replace(/″\./g, "″");
};

const CACHE_FILE = "uploads-cache.json";

async function uploadAll(tasks, concurrency = 6) {
  let cached = {};
  try {
    cached = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
  } catch {}
  const results = new Map(Object.entries(cached));
  tasks = tasks.filter((task) => !results.has(task.url));
  let cursor = 0;
  let done = 0;
  const worker = async () => {
    while (cursor < tasks.length) {
      const { url, publicId } = tasks[cursor++];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const upload = await cloudinary.uploader.upload(url, { public_id: publicId, overwrite: false, unique_filename: false });
          results.set(url, upload.secure_url);
          break;
        } catch (error) {
          if (attempt === 3) throw new Error(`Upload failed for ${url}: ${error.message}`);
        }
      }
      done++;
      if (done % 25 === 0) console.log(`  uploaded ${done}/${tasks.length}`);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  writeFileSync(CACHE_FILE, JSON.stringify(Object.fromEntries(results), null, 2));
  return results;
}

const homeImages = {
  iphone18Pro: "https://www.apple.com/v/homepage/images/iphone-18-pro/a/hero_iphone_18_pro__fqe1motd0ymy_large_2x.jpg",
  iphoneDuo: "https://www.apple.com/v/homepage/images/iphone-duo/a/hero_iphone_duo_announce__fh4u8yzndpe2_large_2x.jpg",
  macbookAir: "https://www.apple.com/v/homepage/images/macbook-air-m5/a/promo_macbook_air_m5__e5xk2yysqiie_large_2x.jpg",
  watchSeries12: "https://www.apple.com/v/homepage/images/apple-watch-series-12/a/hero_apple_watch_series_12__n9rln7bzvwya_large_2x.jpg",
  ipadAir: "https://www.apple.com/v/homepage/images/ipad-air-m4/a/promo_ipad_air_m4__bgcv7t286k8y_large_2x.jpg",
  watchUltra4: "https://www.apple.com/v/homepage/images/apple-watch-ultra-4/a/promo_apple_watch_ultra_4__e4r3qertak2u_large_2x.jpg",
};

const iphoneTiers = liveIphoneTiers();
const products = [];
const uploads = [];

for (const [category, items] of Object.entries(raw)) {
  const { slug: categorySlug, type } = categoryConfig[category];
  for (const item of items) {
    const title = cleanTitle(item.name);
    const handle = slugify(title);
    const colors = item.colors.filter((color) => color.image && color.hex);
    if (!colors.length) throw new Error(`${title} has no usable colors`);

    const prices = pricesFor(category, title, item.storages, iphoneTiers);
    const storages = Object.keys(prices);
    const images = [...new Set([item.hero, ...colors.map((color) => color.image)].filter(Boolean))];
    images.forEach((url, index) => uploads.push({ url, publicId: `apple-store/catalog/${handle}/${index === 0 && item.hero ? "hero" : slugify(colors[index - (item.hero ? 1 : 0)]?.name ?? String(index))}` }));

    products.push({
      category,
      source: { title, images, colors, prices },
      product: {
        title,
        handle,
        category: categorySlug,
        status: "active",
        vendor: "Apple",
        type,
        description: describe(title, item.specs),
        rating: 0,
        totalReviews: 0,
        availableStorages: storages,
      },
    });
  }
}

Object.values(homeImages).forEach((url) => uploads.push({ url, publicId: `apple-store/home/${url.split("/").pop().split("__")[0]}` }));

console.log(`Uploading ${uploads.length} images to Cloudinary...`);
const uploaded = await uploadAll(uploads);
const cdn = (url) => {
  const result = uploaded.get(url);
  if (!result) throw new Error(`Missing upload for ${url}`);
  return result;
};

const catalog = products.map(({ source, product }) => {
  const availableColors = source.colors.map((color) => ({ name: color.name, hex: color.hex, image: cdn(color.image) }));
  return {
    ...product,
    basePrice: Math.min(...Object.values(source.prices)),
    images: source.images.map(cdn),
    availableColors,
    variants: Object.entries(source.prices).flatMap(([storage, price]) =>
      availableColors.map((color) => ({
        id: slugify(`${storage}-${color.name}`),
        storage,
        color: { name: color.name, hex: color.hex },
        price,
        inventory: DEFAULT_STOCK,
        image: color.image,
      }))
    ),
  };
});

const home = Object.fromEntries(Object.entries(homeImages).map(([key, url]) => [key, cdn(url)]));
writeFileSync("catalog-final.json", JSON.stringify({ catalog, home }, null, 2));
console.log(`Wrote ${catalog.length} products, ${catalog.reduce((n, p) => n + p.variants.length, 0)} variants.`);
