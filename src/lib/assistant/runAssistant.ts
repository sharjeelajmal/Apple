import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  ASSISTANT_MAX_PRODUCT_CARDS,
  ASSISTANT_MAX_TOKENS,
  ASSISTANT_VOICE_MAX_TOKENS,
  ASSISTANT_MAX_TOOL_ROUNDS,
  SUGGESTIONS_PREFIX,
  toolStatusLabels,
} from "@/config/assistant";
import { siteConfig } from "@/config/site";
import { getCatalogOverview } from "@/lib/ai/catalogContext";
import { getAi, providerExtras } from "@/lib/ai/client";
import { getProductsByHandles, toCardProduct } from "@/lib/catalog";
import type { AssistantEvent, ChatTurn } from "@/types/assistant";
import type { AssistantToolCall } from "@/types/assistantLog";
import { assistantTools, runAssistantTool, type ToolContext } from "./tools";

const SYSTEM_PROMPT = `You are the shopping assistant for ${siteConfig.name}, an online store that sells official Apple iPhone, iPad, Mac and Apple Watch models. Prices are in US dollars.

Help shoppers pick the right product: ask at most one short clarifying question when the request is vague, otherwise recommend. Remember what the shopper already told you in this conversation (budget, what they use it for, preferences, the product they're looking at) and build on it instead of asking again.
Be quick: the live catalog overview below lists every product with its price, options, stock, rating and key specs, so answer straight from it whenever it has what you need. Use search_products or get_product_details only for full specifications or details the overview doesn't show, and request several lookups together in one turn. Only mention products, prices, options and stock from the overview or the tools. The catalog includes models newer than you may know about, so treat it as the source of truth and never claim Apple doesn't make something that's listed. Never invent discounts, offers, payment plans or delivery promises.
For questions about orders, delivery, returns, payment or warranty, use get_my_orders or get_store_info and answer from what they return.
Shoppers can cancel an order that has not shipped yet, and can request a return for a delivered order within 14 days. Before calling cancel_order or request_return, look the order up, explain exactly what will happen and ask the shopper to confirm. Only call those tools with confirmed set to true after the shopper clearly agrees in their latest message.
When the shopper shares a photo, say in one sentence what you see, then find the closest or best matching products in this store. If it is not an Apple product, suggest the Apple equivalent we sell.
When you mention a product, link it as a Markdown link to its page, for example [iPhone 17](/products/iphone-17), using the handle from the tools. Link store pages the same way, for example [your orders](/account/orders).
Keep answers short and friendly: a sentence or two of advice, then up to three recommendations with the one reason each fits. Use plain text, **bold** for emphasis and simple "-" bullet lists only, no headings or tables.
Reply in the language the shopper writes in, such as English, Hindi, Urdu or Roman Urdu, but keep product names, prices and links exactly as the tools return them.
If someone asks about something unrelated to shopping in this store, say briefly that you can only help with the store's products and orders.
End every answer with one final line that starts with "${SUGGESTIONS_PREFIX}" followed by two or three short follow-up questions the shopper might ask next, written in the shopper's language and separated by " | ". Always write the word "${SUGGESTIONS_PREFIX}" itself in English.`;

const FALLBACK_REPLY = "Sorry, I couldn't finish that. Could you ask again in a different way?";

const voiceReplyLanguages = {
  en: "Reply in English.",
  hi: "Reply in Hindi written in Devanagari script. If the shopper speaks Urdu, still write in Devanagari: spoken Hindi and Urdu sound the same and their device can only read Devanagari aloud.",
  ur: "Reply in Urdu written in Urdu script.",
};

const voiceInstructions = (language: keyof typeof voiceReplyLanguages) =>
  `The shopper is talking to you by voice, and your reply will be read aloud by a speech engine. Their words come from speech recognition, so some may be misheard or split oddly (for example "I phone" for iPhone or "order kia" for "order kiya"): work out the most likely meaning from the whole conversation, and only if it's genuinely unclear, ask one short question to confirm.Answer like a quick spoken reply: one to three short sentences, under 60 words, in a warm conversational tone. Don't use lists, headings, tables, emojis or symbols, and don't add the ${SUGGESTIONS_PREFIX} line. You can still link product names as Markdown links. ${voiceReplyLanguages[language]}`;

const buildSystem = async ({ viewingProduct, voiceLanguage }: ToolContext): Promise<Anthropic.Beta.BetaTextBlockParam[]> => [
  { type: "text", text: SYSTEM_PROMPT },
  {
    type: "text",
    text: `Live catalog overview (handle | title | category | price | options | colors | stock | rating | key specs):\n${await getCatalogOverview()}`,
    cache_control: { type: "ephemeral" },
  },
  ...(voiceLanguage ? [{ type: "text" as const, text: voiceInstructions(voiceLanguage) }] : []),
  ...(viewingProduct
    ? [
        {
          type: "text" as const,
          text: `The shopper opened this chat from the ${viewingProduct.title} page (handle: ${viewingProduct.handle}). Questions like "is it good for gaming?" are about this product unless they say otherwise.`,
        },
      ]
    : []),
];

const toMessageParam = ({ role, text, images = [] }: ChatTurn): Anthropic.Beta.BetaMessageParam => ({
  role,
  content: images.length
    ? [
        ...images.map(
          (image): Anthropic.Beta.BetaImageBlockParam => ({
            type: "image",
            source: { type: "base64", media_type: image.mediaType, data: image.data },
          })
        ),
        { type: "text", text: text || "What can you tell me about this?" },
      ]
    : text,
});

export const splitSuggestions = (reply: string) => {
  const index = reply.lastIndexOf(SUGGESTIONS_PREFIX);
  if (index === -1) return { answer: reply.trim(), suggestions: [] };

  const suggestions = reply
    .slice(index + SUGGESTIONS_PREFIX.length)
    .split("|")
    .map((suggestion) => suggestion.trim())
    .filter(Boolean)
    .slice(0, 3);
  return { answer: reply.slice(0, index).trim(), suggestions };
};

const linkedHandles = (reply: string) =>
  [...new Set([...reply.matchAll(/\]\(\/products\/([a-z0-9-]+)\)/g)].map((match) => match[1]))].slice(
    0,
    ASSISTANT_MAX_PRODUCT_CARDS
  );

const summarizeToolResult = (content: string, isError: boolean) => {
  if (isError) return { ok: false, summary: content };
  try {
    const result = JSON.parse(content);
    if (result.error) return { ok: false, summary: String(result.error) };
    if (typeof result.message === "string") return { ok: result.ok !== false && result.signedIn !== false, summary: result.message };
    if (typeof result.totalMatches === "number") return { ok: true, summary: `${result.totalMatches} matching products` };
    if (typeof result.totalOrders === "number") return { ok: true, summary: `${result.totalOrders} orders found` };
    if (typeof result.title === "string") return { ok: true, summary: `Details for ${result.title}` };
    return { ok: true, summary: "Done" };
  } catch {
    return { ok: true, summary: "Done" };
  }
};

export async function* runAssistant(
  history: ChatTurn[],
  context: ToolContext,
  toolLog: AssistantToolCall[] = []
): AsyncGenerator<AssistantEvent> {
  const { client, provider } = getAi();
  const system = await buildSystem(context);
  const messages = history.map(toMessageParam);
  let reply = "";

  for (let round = 0; round < ASSISTANT_MAX_TOOL_ROUNDS; round++) {
    const stream = client.beta.messages.stream({
      model: context.voiceLanguage ? provider.voiceModel : provider.model,
      max_tokens: context.voiceLanguage ? ASSISTANT_VOICE_MAX_TOKENS : ASSISTANT_MAX_TOKENS,
      output_config: { effort: "low" },
      system,
      tools: assistantTools,
      messages,
      ...providerExtras(provider),
    });

    if (reply && !reply.endsWith("\n")) {
      reply += "\n\n";
      yield { type: "text", delta: "\n\n" };
    }

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        reply += event.delta.text;
        yield { type: "text", delta: event.delta.text };
      }
    }

    const message = await stream.finalMessage();
    if (message.stop_reason === "refusal") break;

    const toolUses = message.content.filter(
      (block): block is Anthropic.Beta.BetaToolUseBlock => block.type === "tool_use"
    );
    if (message.stop_reason !== "tool_use" || !toolUses.length) {
      const { answer, suggestions } = splitSuggestions(reply);
      const products = (await getProductsByHandles(linkedHandles(answer))).map(toCardProduct);
      yield { type: "done", products, suggestions };
      return;
    }

    for (const label of new Set(toolUses.map((toolUse) => toolStatusLabels[toolUse.name]).filter(Boolean))) {
      yield { type: "status", label };
    }

    messages.push({ role: "assistant", content: message.content });
    const toolResults = await Promise.all(
      toolUses.map(async (toolUse): Promise<Anthropic.Beta.BetaToolResultBlockParam> => {
        const result = await runAssistantTool(toolUse.name, toolUse.input, context);
        toolLog.push({
          name: toolUse.name,
          input: (toolUse.input ?? {}) as Record<string, unknown>,
          ...summarizeToolResult(result.content, result.isError),
        });
        return { type: "tool_result", tool_use_id: toolUse.id, content: result.content, is_error: result.isError };
      })
    );
    messages.push({ role: "user", content: toolResults });
  }

  if (!reply.trim()) yield { type: "text", delta: FALLBACK_REPLY };
  yield { type: "done", products: [], suggestions: [] };
}
