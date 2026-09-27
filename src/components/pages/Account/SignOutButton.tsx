"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { authClient } from "@/lib/authClient";
import { useWishlist } from "@/context/WishlistContext";

export default function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { clearWishlist } = useWishlist();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    clearWishlist();
    router.replace("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex w-full items-center gap-3 rounded-field px-4 py-2.5 text-[15px] text-danger transition-colors hover:bg-danger-soft disabled:opacity-70"
    >
      {isSigningOut ? <Spinner className="h-4 w-4" /> : <LogOut size={18} />}
      Sign Out
    </button>
  );
}
