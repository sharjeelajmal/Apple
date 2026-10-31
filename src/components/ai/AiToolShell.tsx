import type { ReactNode } from "react";
import AiBadge from "./AiBadge";

type AiToolShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AiToolShell({ title, description, children }: AiToolShellProps) {
  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="bg-surface-muted px-4 py-14 text-center md:py-20">
        <AiBadge />
        <h1 className="mx-auto mt-4 max-w-[760px] text-[36px] font-semibold leading-tight tracking-tight text-ink md:text-[52px]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] text-[17px] text-ink-muted md:text-[19px]">{description}</p>
      </section>
      <section className="mx-auto w-full max-w-[1100px] px-4 py-10 md:py-14">{children}</section>
    </main>
  );
}
