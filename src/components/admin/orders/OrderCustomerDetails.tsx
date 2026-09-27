import type { ReactNode } from "react";
import Link from "next/link";
import { paymentMethodLabels, type Order } from "@/types/order";
import AddressBlock from "../customers/AddressBlock";

interface OrderCustomerDetailsProps {
  order: Order;
}

export default function OrderCustomerDetails({ order }: OrderCustomerDetailsProps) {
  const { contact, shippingAddress, billingAddress, card } = order;

  if (!contact && !shippingAddress) {
    return <p className="text-[14px] text-ink-muted">This order was placed before customer details were collected.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {contact && (
        <DetailColumn title="Customer">
          <Link href={`/admin/customers/${encodeURIComponent(contact.email)}`} className="font-medium text-ink hover:text-accent">
            {contact.firstName} {contact.lastName}
          </Link>
          <p className="text-[14px] text-ink-muted">{contact.email}</p>
          <p className="text-[14px] text-ink-muted">{contact.phone}</p>
        </DetailColumn>
      )}
      {shippingAddress && (
        <DetailColumn title="Shipping address">
          <AddressBlock address={shippingAddress} />
        </DetailColumn>
      )}
      {billingAddress && (
        <DetailColumn title="Billing address">
          <AddressBlock address={billingAddress} />
        </DetailColumn>
      )}
      <DetailColumn title="Payment">
        {card ? (
          <>
            <p className="font-medium text-ink">
              {card.brand} <span className="font-mono text-[14px]">{card.cardNumber || `•••• ${card.last4}`}</span>
            </p>
            <p className="text-[14px] text-ink-muted">Expires {card.expiry}</p>
            <p className="text-[14px] text-ink-muted">{card.holderName}</p>
          </>
        ) : (
          <p className="text-[14px] text-ink-muted">{paymentMethodLabels[order.paymentMethod]}</p>
        )}
      </DetailColumn>
    </div>
  );
}

function DetailColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-subtle">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
