interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ title, description, align = "center" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`mb-10 max-w-[640px] md:mb-14 ${alignment}`}>
      <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[48px]">{title}</h2>
      {description && <p className="mt-4 text-[17px] leading-relaxed text-ink-muted md:text-[19px]">{description}</p>}
    </div>
  );
}
