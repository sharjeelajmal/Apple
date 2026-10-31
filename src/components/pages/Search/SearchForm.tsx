import Form from "next/form";
import { Search } from "lucide-react";

export default function SearchForm({ defaultValue }: { defaultValue: string }) {
  return (
    <Form action="/search" role="search" className="relative mx-auto w-full max-w-[640px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" size={20} />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        aria-label="Search products"
        placeholder="Search iPhone, iPad, Mac, Watch..."
        className="h-12 w-full rounded-field border border-line bg-white pl-12 pr-4 text-[17px] text-ink outline-none transition-colors focus:border-accent"
      />
    </Form>
  );
}
