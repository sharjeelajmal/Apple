import type { Metadata } from "next";
import { Bell } from "lucide-react";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import AlertCard from "@/components/pages/Account/AlertCard";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { siteConfig } from "@/config/site";
import { getUserAlerts } from "@/lib/alerts";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: `Your Alerts | ${siteConfig.name}`,
};

export default async function AlertsPage() {
  const { user } = await requireSession();
  const alerts = await getUserAlerts(user.id);

  return (
    <>
      <AccountPageHeader
        title="Alerts"
        description="Price drops and back-in-stock updates for the products you're watching."
      />
      {alerts.length ? (
        <ul className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Bell}
          title="No alerts yet."
          description="Tap “Alert me if the price drops” on any product page and we'll keep an eye on it for you."
          actionLabel="Browse products"
          actionHref="/collections/all"
        />
      )}
    </>
  );
}
