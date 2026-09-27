"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import FloatingField from "@/components/ui/FloatingField";
import FloatingTextarea from "@/components/ui/FloatingTextarea";
import FormAlert from "@/components/ui/FormAlert";
import Spinner from "@/components/ui/Spinner";
import { sendContactMessage, type ContactErrors, type ContactInput } from "@/actions/contactActions";

const initialValues: ContactInput = { name: "", email: "", orderNumber: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState({ tone: "success" as "success" | "error", message: "" });
  const [isPending, startTransition] = useTransition();

  const fieldProps = (name: keyof ContactInput) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [name]: event.target.value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus((prev) => ({ ...prev, message: "" }));

    startTransition(async () => {
      try {
        const result = await sendContactMessage(values);
        setErrors(result.errors);

        if (result.success) {
          setValues(initialValues);
          setStatus({ tone: "success", message: "Thanks for reaching out! We'll get back to you within one business day." });
        }
      } catch {
        setStatus({ tone: "error", message: "We couldn't send your message. Please try again." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormAlert message={status.message} tone={status.tone} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FloatingField label="Your Name" autoComplete="name" {...fieldProps("name")} />
        <FloatingField type="email" label="Email" autoComplete="email" {...fieldProps("email")} />
      </div>
      <FloatingField label="Order Number (optional)" {...fieldProps("orderNumber")} />
      <FloatingTextarea label="How can we help?" {...fieldProps("message")} />
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-8 text-[17px] font-medium text-white transition-colors duration-300 ease-smooth hover:bg-accent-hover disabled:opacity-70 sm:self-start"
      >
        {isPending && <Spinner className="h-4 w-4" />}
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
