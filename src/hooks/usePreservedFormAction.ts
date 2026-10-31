import { startTransition, useActionState, type FormEvent } from "react";
import type { FormActionState } from "@/types/review";

const IDLE_STATE: FormActionState = { status: "idle", message: "" };

type FormStateAction = (state: FormActionState, formData: FormData) => Promise<FormActionState>;

export default function usePreservedFormAction(action: FormStateAction) {
  const [state, formAction, isPending] = useActionState(action, IDLE_STATE);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return { state, isPending, handleSubmit };
}
