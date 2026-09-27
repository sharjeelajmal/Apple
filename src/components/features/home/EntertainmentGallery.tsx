"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface TvShow {
  id: string;
  title: string;
  genre: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  href: string;
}

interface ServiceCard {
  id: string;
  service: "music" | "arcade" | "fitness";
  title: string;
  badge: string;
  imageUrl: string;
  bgColor: string;
  buttonText: string;
  href: string;
}

const tvShows: TvShow[] = [
  {
    id: "f1",
    title: "Formula 1",
    genre: "Sports",
    description: "Every Grand Prix™, live and on demand—all in one place, all year long.",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features/v4/47/76/ea/4776ea5e-5e00-a76b-c8f1-6fda44050f30/3dd9b6d8-a87a-4a15-80bb-0cc06dfa62d4.png/1250x668sr.jpg",
    buttonText: "F1 on Apple TV",
    href: "https://tv.apple.com",
  },
  {
    id: "ted-lasso",
    title: "Ted Lasso",
    genre: "Comedy",
    description: "The hit comedy is back and Tedder than ever.",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/eD8DZGJ170t3MyFhlWOkdw/1250x668sr.jpg",
    buttonText: "Stream now",
    href: "https://tv.apple.com",
  },
  {
    id: "lucky",
    title: "Lucky",
    genre: "Action",
    description: "Anya Taylor-Joy is a grifter running for her life after a heist goes sideways.",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/3aJOoInTKLjwSg8kv-ifDg/1250x668sr.jpg",
    buttonText: "Stream now",
    href: "https://tv.apple.com",
  },
  {
    id: "pickleball",
    title: "Pickleball",
    genre: "Comedy",
    description: "It’s pickleball vs. tennis in the hilarious new movie.",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/koGPFMce0cxPTuuHdx325g/1250x668sr.jpg",
    buttonText: "Stream now",
    href: "https://tv.apple.com",
  },
  {
    id: "widows-bay",
    title: "Widow’s Bay",
    genre: "Mystery",
    description: "19 Emmy® Nominations Including Best Comedy",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/CqMFl0CvUAUE1axxV4k-ew/1250x668sr.jpg",
    buttonText: "Stream now",
    href: "https://tv.apple.com",
  },
];

const serviceCards: ServiceCard[] = [
  {
    id: "music-sabrina",
    service: "music",
    title: "Sabrina Carpenter: The Zane Lowe Interview",
    badge: "Apple Music",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/55/2b/5f/552b5f86-46e6-d848-ee06-5395bf09c206/83e0ed3d-c824-4ed9-9572-ae9e784568cb.png/226x226sr.jpg",
    bgColor: "#000000",
    buttonText: "Listen now",
    href: "https://music.apple.com",
  },
  {
    id: "arcade-kitty",
    service: "arcade",
    title: "Hello Kitty Island Adventure",
    badge: "Apple Arcade",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/5b/b3/4a/5bb34a60-695c-a96f-75ec-8a957fc2a20b/45899847-e52c-44a1-9ce5-09aedebb7a78.png/470x264.jpg",
    bgColor: "#f4f8fb",
    buttonText: "Play now",
    href: "https://apps.apple.com",
  },
  {
    id: "fitness-bowie",
    service: "fitness",
    title: "David Bowie Workout Spotlight",
    badge: "Apple Fitness+",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Features221/v4/c1/e6/09/c1e609c8-914d-6037-cda2-4cfdaf87a263/07eaa70a-574b-4abe-aea4-bcb530d837e3.png/470x264.jpg",
    bgColor: "#2d2a45",
    buttonText: "Watch now",
    href: "https://fitness.apple.com",
  },
];

export default function EntertainmentGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % tvShows.length);
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const currentShow = tvShows[activeIndex];

  return (
    <section
      aria-label="Endless Entertainment"
      className="w-full py-16 bg-white overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] sm:text-[40px] md:text-[52px] font-semibold tracking-tight text-[#1d1d1f]">
            Endless entertainment.
          </h2>
        </div>

        {/* Featured Apple TV+ Carousel Slider */}
        <div className="relative w-full rounded-[24px] overflow-hidden bg-black aspect-[16/9] md:aspect-[21/9] max-h-[640px] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentShow.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Link
                href={currentShow.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full h-full group"
              >
                <Image
                  src={currentShow.imageUrl}
                  alt={currentShow.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 1440px) 100vw, 1440px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-12 md:left-12 z-10 flex flex-col sm:flex-row sm:items-center gap-4 max-w-[85%]">
                  <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-semibold text-[15px] sm:text-[17px] shadow hover:bg-white/90 transition-colors shrink-0">
                    {currentShow.buttonText}
                  </span>
                  <p className="text-white text-[16px] sm:text-[19px] md:text-[21px] font-normal leading-snug drop-shadow-md">
                    {currentShow.genre && (
                      <span className="font-semibold mr-2">{currentShow.genre} ·</span>
                    )}
                    {currentShow.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            {tvShows.map((show, idx) => (
              <button
                key={show.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-8 bg-[#1d1d1f]"
                    : "w-2.5 bg-black/20 hover:bg-black/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            className="p-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors ml-2"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Apple Services Cards (Music, Arcade, Fitness+) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {serviceCards.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col justify-between h-[360px] sm:h-[400px] rounded-[20px] overflow-hidden p-6 text-white group shadow-md transition-transform duration-300 hover:scale-[1.01]"
              style={{ backgroundColor: item.bgColor }}
            >
              {/* Badge */}
              <div className="z-10 flex items-center justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              {/* Artwork Image */}
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Title & Action */}
              <div className="z-10 mt-auto flex flex-col gap-3">
                <h3 className="text-[20px] font-semibold text-white leading-snug drop-shadow">
                  {item.title}
                </h3>
                <span className="inline-flex items-center justify-center w-max px-5 py-2 rounded-full bg-white text-black font-semibold text-[14px] shadow hover:bg-white/90 transition-colors">
                  {item.buttonText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
