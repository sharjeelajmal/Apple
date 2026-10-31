import { SUGGESTIONS_PREFIX } from "@/config/assistant";

const SENTENCE_END = /[.!?।۔؟\n](?=\s|$)/g;
const PREFERRED_VOICE = /natural|online|google|neural|premium|enhanced/i;
const SPEECH_RATE = 1.05;

type SpeechStream = {
  id: string;
  spokenUpTo: number;
  pending: number;
  isDone: boolean;
  onDone?: () => void;
};

const detectLanguage = (text: string) => {
  if (/[؀-ۿ]/.test(text)) return "ur-PK";
  if (/[ऀ-ॿ]/.test(text)) return "hi-IN";
  return "en-US";
};

export const toSpeakableText = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_#`>]/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const withoutSuggestions = (text: string) => {
  const index = text.indexOf(SUGGESTIONS_PREFIX);
  return index === -1 ? text : text.slice(0, index);
};

const hasOpenLink = (text: string) => text.lastIndexOf("[") > text.lastIndexOf(")");

export const findVoice = (lang: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const base = lang.split("-")[0];
  const matches = window.speechSynthesis.getVoices().filter((voice) => voice.lang.replace("_", "-").startsWith(base));
  return (
    matches.find((voice) => voice.lang === lang && PREFERRED_VOICE.test(voice.name)) ??
    matches.find((voice) => PREFERRED_VOICE.test(voice.name)) ??
    matches.find((voice) => voice.lang === lang) ??
    matches[0]
  );
};

export class SpeechQueue {
  private stream: SpeechStream | null = null;

  constructor(private readonly onSpeakingChange: (id: string | null) => void) {}

  stop() {
    this.stream = null;
    window.speechSynthesis.cancel();
    this.onSpeakingChange(null);
  }

  prime() {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  }

  feed(id: string, text: string, isDone: boolean, onDone?: () => void) {
    const stream = this.streamFor(id);
    const source = withoutSuggestions(text);
    const readyUpTo = isDone ? source.length : this.lastSentenceEnd(source, stream.spokenUpTo);

    if (readyUpTo > stream.spokenUpTo) {
      this.enqueue(stream, source.slice(stream.spokenUpTo, readyUpTo));
      stream.spokenUpTo = readyUpTo;
    }

    if (isDone) {
      stream.isDone = true;
      stream.onDone = onDone;
      this.finishIfIdle(stream);
    }
  }

  private streamFor(id: string) {
    if (this.stream?.id === id) return this.stream;

    window.speechSynthesis.cancel();
    this.stream = { id, spokenUpTo: 0, pending: 0, isDone: false };
    this.onSpeakingChange(id);
    return this.stream;
  }

  private lastSentenceEnd(source: string, from: number) {
    let readyUpTo = from;
    for (const match of source.slice(from).matchAll(SENTENCE_END)) {
      const end = from + (match.index ?? 0) + 1;
      if (!hasOpenLink(source.slice(0, end))) readyUpTo = end;
    }
    return readyUpTo;
  }

  private enqueue(stream: SpeechStream, segment: string) {
    const spoken = toSpeakableText(segment);
    if (!spoken) return;

    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = detectLanguage(spoken);
    const voice = findVoice(utterance.lang);
    if (voice) utterance.voice = voice;
    utterance.rate = SPEECH_RATE;

    const settle = () => {
      stream.pending -= 1;
      this.finishIfIdle(stream);
    };
    utterance.onend = settle;
    utterance.onerror = settle;

    stream.pending += 1;
    window.speechSynthesis.speak(utterance);
  }

  private finishIfIdle(stream: SpeechStream) {
    if (stream.pending > 0 || !stream.isDone || this.stream !== stream) return;
    this.stream = null;
    this.onSpeakingChange(null);
    stream.onDone?.();
  }
}
