import { countriesData } from "@/data/countries";
import type { OrderAddress } from "@/types/order";

export const getCountryName = (code: string) => countriesData[code as keyof typeof countriesData]?.name ?? code;

export default function AddressBlock({ address }: { address: OrderAddress }) {
  return (
    <address className="text-[14px] not-italic leading-relaxed text-ink-muted">
      {address.street}
      {address.apartment && `, ${address.apartment}`}
      <br />
      {[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}
      <br />
      {getCountryName(address.country)}
    </address>
  );
}
