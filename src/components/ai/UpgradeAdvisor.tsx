"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ArrowRight, CircleCheck, Hourglass } from "lucide-react";
import { getUpgradeAdvice, type AiPick } from "@/actions/aiActions";
import { upgradeBudgets, upgradeDeviceSuggestions, upgradePriorities } from "@/config/aiTools";
import AiLoading from "./AiLoading";
import AiPickGrid from "./AiPickGrid";
import AiSubmitButton from "./AiSubmitButton";
import ChipPicker, { toOptions, toggleValue } from "./ChipPicker";

type Advice = {
  verdict: "upgrade" | "wait";
  summary: string;
  improvements: { area: string; current: string; upgrade: string }[];
  picks: AiPick[];
};

export default function UpgradeAdvisor() {
  const [device, setDevice] = useState("");
  const [priorities, setPriorities] = useState<string[]>(["Camera", "Battery life"]);
  const [budget, setBudget] = useState("0");
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await getUpgradeAdvice({ currentDevice: device, priorities, budget: Number(budget) });
      setError(result.error ?? "");
      setAdvice(result.data ?? null);
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-card border border-line-light p-6 shadow-soft md:p-8">
        <div>
          <label htmlFor="current-device" className="mb-3 block text-[15px] font-semibold text-ink">
            Which device do you have now?
          </label>
          <input
            id="current-device"
            value={device}
            onChange={(event) => setDevice(event.target.value)}
            maxLength={80}
            placeholder="e.g. iPhone 13, MacBook Air M1, Galaxy S23"
            className="h-12 w-full rounded-field border border-line px-4 text-[16px] text-ink outline-none focus:border-accent"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {upgradeDeviceSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setDevice(suggestion)}
                className="rounded-full bg-surface-muted px-3 py-1.5 text-[13px] text-ink-muted hover:text-ink"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <ChipPicker
          label="What matters most to you?"
          options={toOptions(upgradePriorities)}
          selected={priorities}
          onToggle={(value) => setPriorities((current) => toggleValue(current, value))}
        />
        <ChipPicker
          label="Budget"
          options={upgradeBudgets.map(({ label, value }) => ({ label, value: String(value) }))}
          selected={[budget]}
          onToggle={setBudget}
        />
        {error && <p className="text-[14px] text-danger">{error}</p>}
        <AiSubmitButton isLoading={isPending} label="Should I upgrade?" loadingLabel="Comparing your device…" />
      </form>

      {isPending && <AiLoading message="AI is comparing your device with our latest models…" lines={4} />}

      {advice && !isPending && (
        <div className="flex flex-col gap-10">
          <div
            className={`flex flex-col gap-3 rounded-card p-6 md:flex-row md:items-center md:gap-5 md:p-8 ${
              advice.verdict === "upgrade" ? "bg-positive/10" : "bg-amber-50"
            }`}
          >
            {advice.verdict === "upgrade" ? (
              <CircleCheck size={40} className="shrink-0 text-positive" />
            ) : (
              <Hourglass size={40} className="shrink-0 text-amber-600" />
            )}
            <div>
              <p className="text-[24px] font-semibold text-ink">
                {advice.verdict === "upgrade" ? "Yes, it's worth upgrading" : "You can wait a little longer"}
              </p>
              <p className="mt-1 text-[16px] text-ink-muted">{advice.summary}</p>
            </div>
          </div>

          {advice.improvements.length > 0 && (
            <div className="overflow-x-auto rounded-card border border-line-light">
              <table className="w-full min-w-[520px] text-left text-[15px]">
                <thead className="bg-surface-muted text-[13px] uppercase tracking-wider text-ink-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">What changes</th>
                    <th className="px-5 py-3 font-semibold">Your {device}</th>
                    <th className="px-5 py-3 font-semibold">Top pick</th>
                  </tr>
                </thead>
                <tbody>
                  {advice.improvements.map((row) => (
                    <tr key={row.area} className="border-t border-line-light">
                      <td className="px-5 py-4 font-semibold text-ink">{row.area}</td>
                      <td className="px-5 py-4 text-ink-muted">{row.current}</td>
                      <td className="px-5 py-4 text-ink">
                        <span className="inline-flex items-center gap-2">
                          <ArrowRight size={14} className="text-positive" />
                          {row.upgrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {advice.picks.length > 0 && <AiPickGrid picks={advice.picks} highlightFirst />}
        </div>
      )}
    </div>
  );
}
