interface UserAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function UserAvatar({ name, image, className = "h-16 w-16 text-[22px]" }: UserAvatarProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        referrerPolicy="no-referrer"
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent via-violet-500 to-fuchsia-500 font-semibold text-white ${className}`}
    >
      {getInitials(name) || "A"}
    </span>
  );
}
