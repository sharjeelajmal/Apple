import { Package, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ImportCatalogButton from "@/components/admin/ImportCatalogButton";
import InventoryFilters from "@/components/admin/inventory/InventoryFilters";
import ProductTable from "@/components/admin/inventory/ProductTable";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { Button } from "@/components/ui/Button";
import { isCategorySlug, productCategories } from "@/config/categories";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminProducts, getStartingPrice, getTotalInventory } from "@/lib/catalog";

export default async function InventoryPage({ searchParams }: PageProps<"/admin/inventory">) {
  await requireAdmin();
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim() : "";
  const category = typeof params.category === "string" && isCategorySlug(params.category) ? params.category : undefined;

  const products = (await getAdminProducts({ search, category })).map((product) => ({
    ...product,
    stock: getTotalInventory(product),
    startingPrice: getStartingPrice(product),
  }));
  const isFiltered = Boolean(search || category);

  return (
    <>
      <AdminPageHeader
        title="Inventory"
        description={`Manage products across ${productCategories.map((item) => item.name).join(", ")}.`}
        actions={
          <Button href="/admin/inventory/new" size="sm" className="gap-2 font-medium">
            <Plus size={16} />
            Add Product
          </Button>
        }
      />

      <InventoryFilters search={search} category={category ?? ""} />

      {products.length ? (
        <ProductTable products={products} />
      ) : isFiltered ? (
        <EmptyState icon={Package} title="No matching products." description="Try a different search or category." />
      ) : (
        <div className="flex flex-col items-center gap-6 rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
          <div>
            <h3 className="text-[19px] font-semibold text-ink">No products yet.</h3>
            <p className="mt-2 text-[15px] text-ink-muted">Add your first product, or import the current storefront catalog.</p>
          </div>
          <ImportCatalogButton />
        </div>
      )}
    </>
  );
}
