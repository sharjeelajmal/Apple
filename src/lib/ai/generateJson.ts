import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { getAi, providerExtras } from "./client";

export type JsonSchema = Record<string, unknown>;

type GenerateJsonOptions = {
  system: string;
  content: string | Anthropic.Beta.BetaContentBlockParam[];
  schema: JsonSchema;
  maxTokens?: number;
};

const DEFAULT_MAX_TOKENS = 6000;

export async function generateJson<T>({ system, content, schema, maxTokens = DEFAULT_MAX_TOKENS }: GenerateJsonOptions) {
  const { client, provider } = getAi();

  const message = await client.beta.messages
    .stream({
      model: provider.model,
      max_tokens: maxTokens,
      output_config: { effort: "low", format: { type: "json_schema", schema } },
      system,
      messages: [{ role: "user", content }],
      ...providerExtras(provider),
    })
    .finalMessage();

  if (message.stop_reason === "refusal") throw new Error("The AI declined this request.");
  if (message.stop_reason === "max_tokens") throw new Error("The AI response was cut off.");

  const text = message.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
  return JSON.parse(text) as T;
}

export const objectSchema = (properties: Record<string, JsonSchema>): JsonSchema => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

export const stringArray: JsonSchema = { type: "array", items: { type: "string" } };
