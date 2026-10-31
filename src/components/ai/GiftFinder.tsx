"use client";

import { Gift } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { getGiftIdeas, type AiPick } from "@/actions/aiActions";
import { giftBudgets, giftInterests, giftOccasions, giftRecipients } from "@/config/aiTools";
import { formatPrice } from "@/lib/format";
import AiLoading from "./AiLoading";
import AiPickGrid from "./AiPickGrid";
import AiSubmitButton from "./AiSubmitButton";
import ChipPicker, { toOptions, toggleValue } from "./ChipPicker";

export default function GiftFinder() {
  const [recipient, setRecipient] = useState("Brother");
  const [occasion, setOccasion] = useState("Birthday");
  const [budget, setBudget] = useState("500");
  const [interests, setInterests] = useState<string[]>(["Gaming", "Music"]);
  const [note, setNote] = useState("");
  const [ideas, setIdeas] = useState<{ intro: string; picks: AiPick[] } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await getGiftIdeas({ recipient, occasion, budget: Number(budget), interests, note });
      setError(result.error ?? "");
      setIdeas(result.data ?? null);
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-card border border-line-light p-6 shadow-soft md:p-8">
        <ChipPicker label="Who is it for?" options={toOptions(giftRecipients)} selected={[recipient]} onToggle={setRecipient} />
        <ChipPicker label="Occasion" options={toOptions(giftOccasions)} selected={[occasion]} onToggle={setOccasion} />
        <ChipPicker
          label="Budget"
          options={giftBudgets.map((value) => ({ label: `Up to ${formatPrice(value).replace(".00", "")}`, value: String(value) }))}
          selected={[budget]}
          onToggle={setBudget}
        />
        <ChipPicker
          label="What are they into?"
          options={toOptions(giftInterests)}
          selected={interests}
          onToggle={(value) => setInterests((current) => toggleValue(current, value))}
        />
        <div>
          <label htmlFor="gift-note" className="mb-3 block text-[15px] font-semibold text-ink">
            Anything else? <span className="font-normal text-ink-subtle">(optional)</span>
          </label>
          <textarea
            id="gift-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={300}
            rows={2}
            dir="auto"
            placeholder="e.g. He already has an iPhone 15 and is starting university."
            className="w-full resize-none rounded-field border border-line px-4 py-3 text-[16px] text-ink outline-none focus:border-accent"
          />
        </div>
        {error && <p className="text-[14px] text-danger">{error}</p>}
        <AiSubmitButton isLoading={isPending} label="Find the perfect gift" loadingLabel="Finding gift ideas…" />
      </form>

      {isPending && <AiLoading message="AI is picking gifts that fit…" lines={3} />}

      {ideas && !isPending && (
        <div className="flex flex-col gap-8">
          <p className="flex items-center gap-3 text-[20px] font-semibold text-ink md:text-[24px]">
            <Gift size={28} className="shrink-0 text-accent" />
            {ideas.intro}
          </p>
          {ideas.picks.length > 0 && <AiPickGrid picks={ideas.picks} highlightFirst />}
        </div>
      )}
    </div>
  );
}
