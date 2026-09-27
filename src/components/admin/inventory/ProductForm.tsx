"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import SectionCard from "@/components/shared/dashboard/SectionCard";
import { productCategories } from "@/config/categories";
import { deleteProduct, saveProduct } from "@/actions/admin/productActions";
import { slugify } from "@/lib/slugify";
import { buildVariants } from "@/lib/variants";
import type { CatalogProduct, ProductInput } from "@/types/catalog";
import Field from "../form/Field";
import ImageListField from "../form/ImageListField";
import SaveBar, { type SaveStatus } from "../form/SaveBar";
import TagsField from "../form/TagsField";
import AdminSelect from "../form/AdminSelect";
import { TextArea, TextInput } from "../form/inputs";
import ColorOptionsEditor from "./ColorOptionsEditor";
import VariantTable from "./VariantTable";

const emptyProduct: ProductInput = {
  title: "",
  handle: "",
  category: productCategories[0].slug,
  status: "active",
  vendor: "Apple",
  type: "",
  basePrice: 0,
  description: "",
  images: [],
  rating: 5,
  totalReviews: 0,
  availableStorages: [],
  availableColors: [],
  variants: buildVariants({ availableStorages: [], availableColors: [], variants: [] }),
};

const statusOptions = [
  { value: "active", label: "Active (visible in store)" },
  { value: "draft", label: "Draft (hidden)" },
];

const categoryOptions = productCategories.map(({ slug, name }) => ({ value: slug, label: name }));

const toInput = (product: CatalogProduct): ProductInput => ({
  title: product.title,
  handle: product.handle,
  category: product.category,
  status: product.status,
  vendor: product.vendor,
  type: product.type,
  basePrice: product.basePrice,
  description: product.description,
  images: product.images,
  rating: product.rating,
  totalReviews: product.totalReviews,
  availableStorages: product.availableStorages,
  availableColors: product.availableColors,
  variants: product.variants,
});

interface ProductFormProps {
  product?: CatalogProduct;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductInput>(product ? toInput(product) : emptyProduct);
  const [isHandleEdited, setIsHandleEdited] = useState(Boolean(product));
  const [status, setStatus] = useState<SaveStatus>({ tone: "success", message: "" });
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const update = (patch: Partial<ProductInput>) => setValues((prev) => ({ ...prev, ...patch }));

  const updateOptions = (patch: Pick<Partial<ProductInput>, "availableStorages" | "availableColors">) =>
    setValues((prev) => {
      const next = { ...prev, ...patch };
      return { ...next, variants: buildVariants(next) };
    });

  const handleTitleChange = (title: string) =>
    update({ title, ...(!isHandleEdited && { handle: slugify(title) }) });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ tone: "success", message: "" });

    startSaving(async () => {
      const variants = values.variants.map((variant) => ({ ...variant, image: variant.image || values.images[0] || "" }));
      const basePrice = Math.min(...variants.map((variant) => variant.price));
      const result = await saveProduct({ ...values, variants, basePrice }, product?.id);

      if (result.error) {
        setStatus({ tone: "error", message: result.error });
        return;
      }

      setStatus({ tone: "success", message: "Product saved." });
      if (!product && result.id) {
        router.replace(`/admin/inventory/${result.id}`);
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!product || !window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;

    startDeleting(async () => {
      await deleteProduct(product.id);
      router.replace("/admin/inventory");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <SectionCard title="Basic details">
            <div className="grid gap-4">
              <Field label="Product name">
                <TextInput required value={values.title} onChange={(event) => handleTitleChange(event.target.value)} />
              </Field>
              <Field label="Description" hint="Shown on the product detail page.">
                <TextArea rows={6} value={values.description} onChange={(event) => update({ description: event.target.value })} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Images">
            <ImageListField label="Product photos" value={values.images} onChange={(images) => update({ images })} />
          </SectionCard>

          <SectionCard title="Options" description="Add storage sizes and colors. Variants are created automatically.">
            <div className="grid gap-6">
              <TagsField
                label="Storage options"
                placeholder="e.g. 128GB, then press Enter"
                hint="Leave empty if this product has no storage options."
                value={values.availableStorages}
                onChange={(availableStorages) => updateOptions({ availableStorages })}
              />
              <ColorOptionsEditor
                colors={values.availableColors}
                onChange={(availableColors) => updateOptions({ availableColors })}
              />
            </div>
          </SectionCard>

          <SectionCard title="Pricing & stock" description="Set the price and available quantity for each variant.">
            <VariantTable variants={values.variants} onChange={(variants) => update({ variants })} />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard title="Organization">
            <div className="grid gap-4">
              <Field label="Status">
                <AdminSelect
                  value={values.status}
                  onChange={(status) => update({ status: status as ProductInput["status"] })}
                  options={statusOptions}
                />
              </Field>
              <Field label="Category">
                <AdminSelect
                  value={values.category}
                  onChange={(category) => update({ category: category as ProductInput["category"] })}
                  options={categoryOptions}
                />
              </Field>
              <Field label="URL handle" hint={`/products/${values.handle || "product-name"}`}>
                <TextInput
                  value={values.handle}
                  onChange={(event) => {
                    setIsHandleEdited(true);
                    update({ handle: slugify(event.target.value) });
                  }}
                />
              </Field>
              <Field label="Vendor">
                <TextInput value={values.vendor} onChange={(event) => update({ vendor: event.target.value })} />
              </Field>
              <Field label="Product type" hint="e.g. Smartphone, Laptop">
                <TextInput value={values.type} onChange={(event) => update({ type: event.target.value })} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Reviews">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating (0–5)">
                <TextInput
                  type="number"
                  min={0}
                  max={5}
                  step="0.1"
                  value={values.rating}
                  onChange={(event) => update({ rating: Number(event.target.value) })}
                />
              </Field>
              <Field label="Review count">
                <TextInput
                  type="number"
                  min={0}
                  value={values.totalReviews}
                  onChange={(event) => update({ totalReviews: Number(event.target.value) })}
                />
              </Field>
            </div>
          </SectionCard>
        </div>
      </div>

      <SaveBar status={status} isSaving={isSaving} label={product ? "Save Changes" : "Create Product"}>
        {product && (
          <>
            <a
              href={`/products/${product.handle}`}
              target="_blank"
              className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] text-ink hover:bg-surface-muted"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">View</span>
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] text-danger hover:border-danger hover:bg-danger-soft disabled:opacity-60"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </>
        )}
      </SaveBar>
    </form>
  );
}
