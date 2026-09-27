import Link from "next/link";
import AuthShell from "./AuthShell";
import AuthDivider from "./AuthDivider";
import LoginForm from "./LoginForm";
import SocialAuthButtons from "./SocialAuthButtons";
import FormAlert from "@/components/ui/FormAlert";
import { AUTH_ROUTES, type SocialProvider } from "@/config/auth";

interface LoginViewProps {
  enabledProviders: SocialProvider[];
  socialError?: string;
}

export default function LoginView({ enabledProviders, socialError }: LoginViewProps) {
  return (
    <AuthShell
      headline="Sign in for"
      highlight="faster checkout."
      description="One account for everything you love. Pick up right where you left off, on any device."
      cardTitle="Sign in to Apple Store"
      cardSubtitle="Use your email or Google account to continue."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href={AUTH_ROUTES.register} className="text-hyperlink hover:underline">
            Create yours now.
          </Link>
        </>
      }
    >
      {socialError && (
        <div className="mb-4">
          <FormAlert message={socialError} />
        </div>
      )}
      <LoginForm />
      <AuthDivider />
      <SocialAuthButtons enabledProviders={enabledProviders} errorRedirect={AUTH_ROUTES.login} />
    </AuthShell>
  );
}
