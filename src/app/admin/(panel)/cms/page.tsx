import { ExternalLink } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import HomeCmsEditor from "@/components/admin/cms/HomeCmsEditor";
import { getCategoryName } from "@/config/categories";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminProducts } from "@/lib/catalog";
import { getHomeContent } from "@/lib/cms";

export default async function CmsPage() {
  await requireAdmin();
  const [content, products] = await Promise.all([getHomeContent(), getAdminProducts({})]);

  const productOptions = products
    .filter((product) => product.status === "active")
    .map((product) => ({
      handle: product.handle,
      title: product.title,
      image: product.images[0] ?? "",
      categoryName: getCategoryName(product.category),
    }));

  return (
    <>
      <AdminPageHeader
        title="Home Page CMS"
        description="Edit the text, images, buttons and products in every section of the home page."
        actions={
          <a
            href="/"
            target="_blank"
            className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[14px] text-ink hover:bg-surface-muted"
          >
            <ExternalLink size={16} />
            Preview home page
          </a>
        }
      />
      <HomeCmsEditor content={content} productOptions={productOptions} />
    </>
  );
}
