import { Search } from "lucide-react";
import { productCategories } from "@/config/categories";
import AdminSelect from "../form/AdminSelect";
import { TextInput } from "../form/inputs";

interface InventoryFiltersProps {
  search: string;
  category: string;
}

export default function InventoryFilters({ search, category }: InventoryFiltersProps) {
  return (
    <form className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
        <TextInput name="search" defaultValue={search} placeholder="Search products..." className="pl-10" />
      </div>
      <AdminSelect
        name="category"
        defaultValue={category}
        ariaLabel="Category"
        className="sm:w-52"
        options={[{ value: "", label: "All categories" }, ...productCategories.map(({ slug, name }) => ({ value: slug, label: name }))]}
      />
      <button type="submit" className="h-11 rounded-full bg-ink px-6 text-[14px] font-medium text-white hover:bg-black">
        Filter
      </button>
    </form>
  );
}
