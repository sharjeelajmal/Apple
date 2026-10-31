import type { Metadata } from "next";
import { headers } from "next/headers";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import ConnectedAccounts from "@/components/pages/Account/ConnectedAccounts";
import PasswordForm from "@/components/pages/Account/PasswordForm";
import ProfileForm from "@/components/pages/Account/ProfileForm";
import SectionCard from "@/components/shared/dashboard/SectionCard";
import { auth, enabledSocialProviders } from "@/lib/auth";
import { requireSession } from "@/lib/session";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Account Settings | ${siteConfig.name}`,
};

export default async function SettingsPage() {
  const { user } = await requireSession();
  const accounts = await auth.api.listUserAccounts({ headers: await headers() });
  const linkedAccounts = accounts.map(({ id, providerId }) => ({ id, providerId }));
  const hasPassword = linkedAccounts.some((account) => account.providerId === "credential");

  return (
    <div className="flex flex-col gap-8">
      <AccountPageHeader title="Settings" description="Update your personal details and sign-in options." />

      <SectionCard title="Personal Information" description="This name appears on your orders and receipts.">
        <ProfileForm name={user.name} email={user.email} />
      </SectionCard>

      {hasPassword && (
        <SectionCard title="Password" description="Use at least 8 characters with a mix of letters and numbers.">
          <PasswordForm />
        </SectionCard>
      )}

      <SectionCard title="Connected Accounts" description="Sign in faster with your Google account.">
        <ConnectedAccounts linkedAccounts={linkedAccounts} enabledProviders={enabledSocialProviders} />
      </SectionCard>
    </div>
  );
}
