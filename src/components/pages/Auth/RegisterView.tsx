import Link from "next/link";
import AuthShell from "./AuthShell";
import AuthDivider from "./AuthDivider";
import RegisterForm from "./RegisterForm";
import SocialAuthButtons from "./SocialAuthButtons";
import { AUTH_ROUTES, type SocialProvider } from "@/config/auth";
import { siteConfig } from "@/config/site";

interface RegisterViewProps {
  enabledProviders: SocialProvider[];
}

export default function RegisterView({ enabledProviders }: RegisterViewProps) {
  return (
    <AuthShell
      headline="Create your"
      highlight="store account."
      description="Track orders, save your favorites, and check out in seconds. It only takes a minute."
      cardTitle="Create Your Account"
      cardSubtitle={`One account for everything at ${siteConfig.name}.`}
      footer={
        <>
          Already have an account?{" "}
          <Link href={AUTH_ROUTES.login} className="text-hyperlink hover:underline">
            Sign in.
          </Link>
        </>
      }
    >
      <SocialAuthButtons enabledProviders={enabledProviders} errorRedirect={AUTH_ROUTES.register} />
      <AuthDivider />
      <RegisterForm />
    </AuthShell>
  );
}
