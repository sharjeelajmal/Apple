import { useSyncExternalStore } from "react";
import { VOICE_LANGUAGE_STORAGE_KEY, voiceLanguages } from "@/config/assistant";

const CHANGE_EVENT = "voice-language-change";
const DEFAULT_LANGUAGE = voiceLanguages[0].value;

const readLanguage = () => {
  try {
    const saved = localStorage.getItem(VOICE_LANGUAGE_STORAGE_KEY);
    return voiceLanguages.find((language) => language.value === saved)?.value ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
};

const saveLanguage = (language: string) => {
  try {
    localStorage.setItem(VOICE_LANGUAGE_STORAGE_KEY, language);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export default function useVoiceLanguage() {
  const language = useSyncExternalStore(subscribe, readLanguage, () => DEFAULT_LANGUAGE);
  return [language, saveLanguage] as const;
}
