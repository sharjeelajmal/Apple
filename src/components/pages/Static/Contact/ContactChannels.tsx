import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

type Channel = {
  icon: LucideIcon;
  title: string;
  value: string;
  href?: string;
};

const { contact } = siteConfig;

const channels: Channel[] = [
  { icon: Mail, title: "Email us", value: contact.email, href: `mailto:${contact.email}` },
  { icon: Phone, title: "Call us", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
  { icon: MapPin, title: "Visit us", value: contact.address },
  { icon: Clock, title: "Opening hours", value: contact.hours },
];

export default function ContactChannels() {
  return (
    <ul className="flex flex-col gap-3">
      {channels.map(({ icon: Icon, title, value, href }) => {
        const content = (
          <>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-[14px] text-ink-muted">{title}</span>
              <span className="block text-[17px] font-medium text-ink">{value}</span>
            </span>
          </>
        );

        return (
          <li key={title}>
            {href ? (
              <a
                href={href}
                className="flex items-center gap-4 rounded-card border border-line-light bg-surface p-5 shadow-soft transition-colors hover:border-accent"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-center gap-4 rounded-card border border-line-light bg-surface p-5 shadow-soft">
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
