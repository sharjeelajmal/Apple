interface AccountPageHeaderProps {
  title: string;
  description: string;
}

export default function AccountPageHeader({ title, description }: AccountPageHeaderProps) {
  return (
    <header className="mb-8">
      <h2 className="text-[28px] font-semibold tracking-tight text-ink md:text-[32px]">{title}</h2>
      <p className="mt-1 text-[15px] text-ink-muted">{description}</p>
    </header>
  );
}
