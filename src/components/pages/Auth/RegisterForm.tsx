"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingField from "@/components/ui/FloatingField";
import PasswordStrength from "./PasswordStrength";
import PasswordToggle from "./PasswordToggle";
import Spinner from "@/components/ui/Spinner";
import FormAlert from "@/components/ui/FormAlert";
import { authClient } from "@/lib/authClient";
import { AUTH_ROUTES } from "@/config/auth";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
} from "@/lib/validators";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type FieldName = keyof typeof initialValues;
type FieldErrors = Partial<Record<FieldName | "terms", string>>;

const validate = (values: typeof initialValues, acceptedTerms: boolean): FieldErrors => {
  const errors: FieldErrors = {
    firstName: validateRequired(values.firstName, "first name"),
    lastName: validateRequired(values.lastName, "last name"),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validatePasswordMatch(values.password, values.confirmPassword),
    terms: acceptedTerms ? "" : "Please accept the terms to continue.",
  };

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
};

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const updateField = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fieldProps = (name: FieldName) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => updateField(name, event.target.value),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate(values, acceptedTerms);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    setFormError("");

    const { error } = await authClient.signUp.email({
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      email: values.email.trim(),
      password: values.password,
    });

    if (error) {
      setFormError(error.message ?? "Unable to create your account. Please try again.");
      setIsSubmitting(false);
      return;
    }

    router.replace(AUTH_ROUTES.dashboard);
    router.refresh();
  };

  const passwordToggle = (
    <PasswordToggle isVisible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormAlert message={formError} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FloatingField label="First Name" autoComplete="given-name" {...fieldProps("firstName")} />
        <FloatingField label="Last Name" autoComplete="family-name" {...fieldProps("lastName")} />
      </div>

      <FloatingField type="email" label="Email" autoComplete="email" {...fieldProps("email")} />

      <FloatingField
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete="new-password"
        trailing={passwordToggle}
        {...fieldProps("password")}
      />
      {values.password && <PasswordStrength password={values.password} />}

      <FloatingField
        type={showPassword ? "text" : "password"}
        label="Confirm Password"
        autoComplete="new-password"
        {...fieldProps("confirmPassword")}
      />

      <label className="mt-2 flex items-start gap-3 text-[14px] leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => {
            setAcceptedTerms(event.target.checked);
            if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
          }}
          className="mt-1 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          I agree to the{" "}
          <Link href="/pages/terms-of-use" className="text-hyperlink hover:underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/pages/privacy-policy" className="text-hyperlink hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {errors.terms && <p className="pl-1 text-[13px] text-danger">{errors.terms}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-[17px] font-medium text-white transition-colors duration-300 ease-smooth hover:bg-accent-hover disabled:opacity-70"
      >
        {isSubmitting && <Spinner className="h-4 w-4" />}
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
