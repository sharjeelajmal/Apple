"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import FloatingField from "@/components/ui/FloatingField";
import FormAlert from "@/components/ui/FormAlert";
import SubmitButton from "@/components/ui/SubmitButton";
import { authClient } from "@/lib/authClient";
import { validatePassword, validatePasswordMatch } from "@/lib/validators";

const initialValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

type FieldName = keyof typeof initialValues;

export default function PasswordForm() {
  const [values, setValues] = useState(initialValues);
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [status, setStatus] = useState({ tone: "success" as "success" | "error", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  const fieldProps = (name: FieldName) => ({
    name,
    type: "password",
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [name]: event.target.value })),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError =
      (values.currentPassword ? "" : "Enter your current password.") ||
      validatePassword(values.newPassword) ||
      validatePasswordMatch(values.newPassword, values.confirmPassword);

    if (validationError) {
      setStatus({ tone: "error", message: validationError });
      return;
    }

    setIsSaving(true);
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: signOutOthers,
    });
    setIsSaving(false);

    if (error) {
      setStatus({ tone: "error", message: error.message ?? "Unable to change your password." });
      return;
    }

    setValues(initialValues);
    setStatus({ tone: "success", message: "Your password has been changed." });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormAlert message={status.message} tone={status.tone} />
      <FloatingField label="Current Password" autoComplete="current-password" {...fieldProps("currentPassword")} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FloatingField label="New Password" autoComplete="new-password" {...fieldProps("newPassword")} />
        <FloatingField label="Confirm New Password" autoComplete="new-password" {...fieldProps("confirmPassword")} />
      </div>
      <label className="mt-1 flex items-center gap-2 text-[14px] text-ink">
        <input
          type="checkbox"
          checked={signOutOthers}
          onChange={(event) => setSignOutOthers(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Sign out of all other devices
      </label>
      <SubmitButton isLoading={isSaving}>Change Password</SubmitButton>
    </form>
  );
}
