import { useEffect, useState, useSyncExternalStore } from "react";
import { SpeechQueue } from "@/lib/speechQueue";

export { findVoice, toSpeakableText } from "@/lib/speechQueue";

const subscribe = () => () => {};
const isSpeechSupported = () => "speechSynthesis" in window;

export default function useSpeechSynthesis() {
  const isSupported = useSyncExternalStore(subscribe, isSpeechSupported, () => false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [queue] = useState(() => new SpeechQueue(setSpeakingId));

  useEffect(() => {
    if (!isSupported) return;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const stop = () => {
    if (isSupported) queue.stop();
  };

  const feed = (id: string, text: string, isDone: boolean, onDone?: () => void) => {
    if (isSupported) queue.feed(id, text, isDone, onDone);
    else if (isDone) onDone?.();
  };

  const speak = (id: string, text: string, onDone?: () => void) => {
    stop();
    feed(id, text, true, onDone);
  };

  const prime = () => {
    if (isSupported) queue.prime();
  };

  return { isSupported, speakingId, speak, feed, stop, prime };
}
