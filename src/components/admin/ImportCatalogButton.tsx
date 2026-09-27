"use client";

import { useState, useTransition } from "react";
import { DownloadCloud } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { importStarterCatalog } from "@/actions/admin/productActions";

export default function ImportCatalogButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleImport = () =>
    startTransition(async () => {
      const { imported } = await importStarterCatalog();
      setMessage(imported ? `${imported} products imported.` : "All starter products are already in your inventory.");
    });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleImport}
        disabled={isPending}
        className="flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isPending ? <Spinner className="h-4 w-4" /> : <DownloadCloud size={18} />}
        Import Starter Catalog
      </button>
      {message && <p className="text-[14px] text-ink-muted">{message}</p>}
    </div>
  );
}
