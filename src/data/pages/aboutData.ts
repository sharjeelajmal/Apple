import { Gem, Headphones, Leaf, ShieldCheck, type LucideIcon } from "lucide-react";

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutValue = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Milestone = {
  year: string;
  title: string;
  description: string;
};

export const aboutStats: AboutStat[] = [
  { value: "250K+", label: "Happy customers" },
  { value: "12", label: "Years of service" },
  { value: "1,500+", label: "Products in stock" },
  { value: "4.9/5", label: "Average rating" },
];

export const aboutValues: AboutValue[] = [
  {
    icon: ShieldCheck,
    title: "100% Genuine",
    description: "Every product is sourced from authorized distributors and ships with full manufacturer warranty.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Our certified specialists help you choose, set up, and get the most out of your devices.",
  },
  {
    icon: Gem,
    title: "Premium Experience",
    description: "From browsing to unboxing, every detail is designed to feel as good as the products themselves.",
  },
  {
    icon: Leaf,
    title: "Responsible Retail",
    description: "Recyclable packaging, trade-in programs, and carbon-neutral delivery across the country.",
  },
];

export const milestones: Milestone[] = [
  {
    year: "2014",
    title: "A small shop in Ottawa",
    description: "We opened our doors with a single counter and a big love for well-designed technology.",
  },
  {
    year: "2018",
    title: "Going online",
    description: "Our online store launched, bringing the same personal service to customers nationwide.",
  },
  {
    year: "2022",
    title: "Trade-in & repair",
    description: "We introduced device trade-ins and certified repairs to help products live longer.",
  },
  {
    year: "2026",
    title: "250,000 customers",
    description: "A milestone we owe to a community that trusts us with the devices they love most.",
  },
];
