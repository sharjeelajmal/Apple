"use client";

import { Rotate3d } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { getArModelPath } from "@/config/arModels";
import ArQrDialog from "./ArQrDialog";

type ArViewButtonProps = {
  handle: string;
  title: string;
  image: string;
};

const subscribe = () => () => {};
const supportsQuickLook = () => document.createElement("a").relList.supports("ar");

const buttonClassName =
  "flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-ink";

export default function ArViewButton({ handle, title, image }: ArViewButtonProps) {
  const canUseQuickLook = useSyncExternalStore(subscribe, supportsQuickLook, () => false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (canUseQuickLook) {
    return (
      <a rel="ar" href={getArModelPath(handle)} className={buttonClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-5 w-5 object-contain" />
        View in your space
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setIsDialogOpen(true)} className={buttonClassName}>
        <Rotate3d size={16} />
        View in AR
      </button>
      {isDialogOpen && <ArQrDialog title={title} onClose={() => setIsDialogOpen(false)} />}
    </>
  );
}
