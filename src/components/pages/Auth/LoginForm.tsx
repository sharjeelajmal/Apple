"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FloatingField from "@/components/ui/FloatingField";
import PasswordToggle from "./PasswordToggle";
import Spinner from "@/components/ui/Spinner";
import FormAlert from "@/components/ui/FormAlert";
import { authClient } from "@/lib/authClient";
import { validateEmail, validatePassword } from "@/lib/validators";
import { AUTH_ROUTES } from "@/config/auth";

type Step = "email" | "password";

export default function LoginForm() {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const continueToPassword = () => {
    const emailError = validateEmail(email);
    setErrors({ email: emailError, password: "" });
    if (emailError) return;

    setStep("password");
    requestAnimationFrame(() => passwordRef.current?.focus());
  };

  const submitCredentials = async () => {
    const passwordError = validatePassword(password);
    setErrors({ email: "", password: passwordError });
    if (passwordError) return;

    setIsSubmitting(true);
    setFormError("");

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe: remember,
    });

    if (error) {
      setFormError(error.message ?? "Unable to sign in. Please try again.");
      setIsSubmitting(false);
      return;
    }

    router.replace(AUTH_ROUTES.dashboard);
    router.refresh();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (step === "email") {
      continueToPassword();
    } else {
      submitCredentials();
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (step === "password") setStep("email");
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const submitIcon = isSubmitting ? <Spinner className="h-4 w-4" /> : <ArrowRight size={18} />;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormAlert message={formError} />
      <FloatingField
        name="email"
        type="email"
        label="Email"
        autoComplete="username"
        value={email}
        error={errors.email}
        onChange={(event) => handleEmailChange(event.target.value)}
        trailing={
          step === "email" && (
            <button
              type="submit"
              aria-label="Continue"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors duration-300 ease-smooth hover:border-ink hover:text-ink"
            >
              <ArrowRight size={18} />
            </button>
          )
        }
      />

      <AnimatePresence initial={false}>
        {step === "password" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <FloatingField
              ref={passwordRef}
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete="current-password"
              value={password}
              error={errors.password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              trailing={
                <div className="flex items-center gap-1">
                  <PasswordToggle
                    isVisible={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                  <button
                    type="submit"
                    aria-label="Sign in"
                    disabled={isSubmitting}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors duration-300 ease-smooth hover:bg-accent-hover disabled:opacity-70"
                  >
                    {submitIcon}
                  </button>
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 flex items-center text-[14px]">
        <label className="flex items-center gap-2 text-ink">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded accent-accent"
          />
          Remember me
        </label>
      </div>
    </form>
  );
}
