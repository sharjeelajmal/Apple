import { GraduationCap, HeartPulse, Laptop, Plane, type LucideIcon } from "lucide-react";

export type JobOpening = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  summary: string;
};

export type JobPerk = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const jobOpenings: JobOpening[] = [
  {
    id: "product-specialist",
    title: "Product Specialist",
    department: "Retail",
    location: "Ottawa, ON",
    type: "Full-time",
    summary: "Help customers discover the right products and deliver an unforgettable in-store experience.",
  },
  {
    id: "technical-specialist",
    title: "Technical Specialist",
    department: "Support",
    location: "Ottawa, ON",
    type: "Full-time",
    summary: "Diagnose and repair devices, and guide customers through setup and troubleshooting.",
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    summary: "Build fast, beautiful shopping experiences with React and Next.js.",
  },
  {
    id: "customer-care-advisor",
    title: "Customer Care Advisor",
    department: "Support",
    location: "Remote",
    type: "Part-time",
    summary: "Answer customer questions over chat, phone, and email with care and clarity.",
  },
  {
    id: "visual-merchandiser",
    title: "Visual Merchandiser",
    department: "Marketing",
    location: "Ottawa, ON",
    type: "Contract",
    summary: "Design product displays and seasonal campaigns that bring our store to life.",
  },
];

export const jobPerks: JobPerk[] = [
  { icon: Laptop, title: "Product discounts", description: "Generous employee pricing on the products you love." },
  { icon: HeartPulse, title: "Health & wellness", description: "Comprehensive health, dental, and vision coverage." },
  { icon: GraduationCap, title: "Learning budget", description: "Annual budget for courses, certifications, and books." },
  { icon: Plane, title: "Paid time off", description: "Flexible vacation plus your birthday off, every year." },
];
