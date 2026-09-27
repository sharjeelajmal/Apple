import { Heart, PackageCheck, Zap } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Faster checkout",
    description: "Your saved addresses and payment details, ready when you are.",
  },
  {
    icon: PackageCheck,
    title: "Track every order",
    description: "Follow your delivery from our warehouse to your door.",
  },
  {
    icon: Heart,
    title: "Saved favorites",
    description: "Keep your wishlist in sync across all of your devices.",
  },
];

export default function AuthBenefits() {
  return (
    <ul className="flex flex-col gap-6">
      {benefits.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-accent shadow-soft">
            <Icon size={20} />
          </span>
          <div>
            <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
