import { Button } from "@/components/ui/Button";

export default function CheckoutEmptyBag() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-center text-[32px] font-semibold tracking-tight text-ink md:text-[40px]">Your bag is empty.</h1>
      <Button href="/collections/all" className="py-4 font-medium">
        Continue Shopping
      </Button>
    </div>
  );
}
