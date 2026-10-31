import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { assistantConfig, type AssistantProvider } from "@/config/env";

export class AiUnavailableError extends Error {}

let cachedClient: { key: string; client: Anthropic } | null = null;

export function getAi() {
  const provider = assistantConfig.provider;
  if (!provider) throw new AiUnavailableError("AI features aren't configured.");

  const key = `${provider.name}:${provider.apiKey ?? provider.authToken}`;
  if (cachedClient?.key !== key) {
    cachedClient = {
      key,
      client: new Anthropic({ apiKey: provider.apiKey, authToken: provider.authToken, baseURL: provider.baseURL }),
    };
  }
  return { client: cachedClient.client, provider };
}

export const providerExtras = (provider: AssistantProvider) =>
  provider.name === "anthropic"
    ? {
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default" as const,
        cache_control: { type: "ephemeral" as const },
      }
    : {};

export const toAiErrorMessage = (error: unknown) => {
  if (error instanceof AiUnavailableError) return "AI features aren't available right now.";
  if (error instanceof Anthropic.RateLimitError) return "AI is busy right now. Please try again in a minute.";
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return "The AI API key isn't working. Please check the server settings.";
  }
  if (error instanceof Anthropic.APIError && error.status === 402) return "The AI account is out of credit.";
  return "AI couldn't answer right now. Please try again.";
};
