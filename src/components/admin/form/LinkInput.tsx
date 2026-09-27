import type { InputHTMLAttributes } from "react";
import { productCategories } from "@/config/categories";
import { sitemapGroups } from "@/config/siteLinks";
import { TextInput } from "./inputs";

const LINK_LIST_ID = "admin-site-links";

const suggestions = [
  ...productCategories.map(({ slug, name }) => ({ href: `/collections/${slug}`, label: name })),
  ...sitemapGroups.flatMap((group) => group.links).map(({ href, label }) => ({ href, label })),
];

export default function LinkInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <TextInput list={LINK_LIST_ID} placeholder="/collections/iphone" {...props} />
      <datalist id={LINK_LIST_ID}>
        {[...new Map(suggestions.map((item) => [item.href, item])).values()].map(({ href, label }) => (
          <option key={href} value={href}>
            {label}
          </option>
        ))}
      </datalist>
    </>
  );
}
