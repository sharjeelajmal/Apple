"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FloatingField from "@/components/ui/FloatingField";
import FormAlert from "@/components/ui/FormAlert";
import SubmitButton from "@/components/ui/SubmitButton";
import { authClient } from "@/lib/authClient";
import { validateRequired } from "@/lib/validators";

interface ProfileFormProps {
  name: string;
  email: string;
}

export default function ProfileForm({ name, email }: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(name);
  const [status, setStatus] = useState({ tone: "success" as "success" | "error", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameError = validateRequired(fullName, "name");
    if (nameError) {
      setStatus({ tone: "error", message: nameError });
      return;
    }

    setIsSaving(true);
    const { error } = await authClient.updateUser({ name: fullName.trim() });
    setIsSaving(false);

    if (error) {
      setStatus({ tone: "error", message: error.message ?? "Unable to update your profile." });
      return;
    }

    setStatus({ tone: "success", message: "Your profile has been updated." });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormAlert message={status.message} tone={status.tone} />
      <FloatingField
        name="name"
        label="Full Name"
        autoComplete="name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
      />
      <FloatingField name="email" label="Email" value={email} readOnly disabled className="opacity-70" />
      <SubmitButton isLoading={isSaving} disabled={fullName.trim() === name}>
        Save Changes
      </SubmitButton>
    </form>
  );
}
