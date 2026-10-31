import { useCallback, useEffect, useRef, useState } from "react";
import { completeShortPhrases, continuationWords, SHORT_PHRASE_WORDS, voiceTiming } from "@/config/voice";

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };

type RecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<RecognitionResult> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type RecognitionConstructor = new () => RecognitionInstance;

type ListeningSession = {
  startedAt: number;
  lastResultAt: number;
  lastVoiceAt: number;
  recentLevels: number[];
  committed: string;
  transcript: string;
  finished: boolean;
};

const SENTENCE_END = /[.!?।۔؟]$/;
const VOICE_MARGIN = 0.04;
const VOICE_RATIO = 2;
const NOISE_WINDOW_FRAMES = 90;
const MAX_VOICE_EXTENSION_MS = 1500;
const LEVEL_GAIN = 6;

const getRecognition = () => {
  const speechWindow = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
};

const normalize = (text: string) => text.toLowerCase().replace(/[.,!?।۔؟،]/g, "").trim();

export const requiredPauseMs = (transcript: string) => {
  const text = normalize(transcript);
  const words = text.split(/\s+/).filter(Boolean);
  const lastWord = words.at(-1) ?? "";

  if (completeShortPhrases.has(text)) return voiceTiming.sentenceEndPauseMs;
  if (continuationWords.has(lastWord)) return voiceTiming.basePauseMs + voiceTiming.continuationExtraMs;
  if (words.length < SHORT_PHRASE_WORDS) return voiceTiming.basePauseMs + voiceTiming.shortPhraseExtraMs;
  if (SENTENCE_END.test(transcript.trim())) return voiceTiming.sentenceEndPauseMs;
  return voiceTiming.basePauseMs;
};

type UseVoiceConversationOptions = {
  lang: string;
  onUtterance: (text: string) => void;
};

export default function useVoiceConversation({ lang, onUtterance }: UseVoiceConversationOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");

  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const sessionRef = useRef<ListeningSession | null>(null);
  const checkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<{ stream: MediaStream; context: AudioContext; frame: number } | null>(null);
  const onUtteranceRef = useRef(onUtterance);

  useEffect(() => {
    onUtteranceRef.current = onUtterance;
  }, [onUtterance]);

  const stopMeter = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(audio.frame);
    audio.stream.getTracks().forEach((track) => track.stop());
    audio.context.close();
    audioRef.current = null;
    setLevel(0);
  }, []);

  const startMeter = useCallback(async (session: ListeningSession) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      if (session.finished) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);

      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / samples.length);
        const current = Math.min(1, rms * LEVEL_GAIN);
        session.recentLevels.push(current);
        if (session.recentLevels.length > NOISE_WINDOW_FRAMES) session.recentLevels.shift();
        const noiseFloor = Math.min(...session.recentLevels);
        if (current > noiseFloor * VOICE_RATIO + VOICE_MARGIN) session.lastVoiceAt = performance.now();
        setLevel(current);
        if (audioRef.current) audioRef.current.frame = requestAnimationFrame(tick);
      };
      audioRef.current = { stream, context, frame: requestAnimationFrame(tick) };
    } catch {
      setLevel(0);
    }
  }, []);

  const clearCheck = () => {
    if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    checkTimerRef.current = null;
  };

  const finish = useCallback(() => {
    const session = sessionRef.current;
    if (!session || session.finished) return;
    session.finished = true;
    clearCheck();
    recognitionRef.current?.stop();
    stopMeter();
    const text = session.transcript.trim();
    if (text) onUtteranceRef.current(text);
  }, [stopMeter]);

  const stop = useCallback(() => {
    if (sessionRef.current) sessionRef.current.finished = true;
    clearCheck();
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    stopMeter();
    setIsListening(false);
  }, [stopMeter]);

  const checkForEndOfTurn = useCallback(() => {
    const session = sessionRef.current;
    if (!session || session.finished) return;

    const now = performance.now();
    if (!session.transcript) {
      if (now - session.startedAt > voiceTiming.noSpeechTimeoutMs) stop();
      return;
    }

    const lastSpeechAt = Math.max(session.lastResultAt, Math.min(session.lastVoiceAt, session.lastResultAt + MAX_VOICE_EXTENSION_MS));
    const quietFor = now - lastSpeechAt;
    if (quietFor >= requiredPauseMs(session.transcript) || now - session.startedAt > voiceTiming.maxUtteranceMs) finish();
  }, [finish, stop]);

  const start = useCallback(() => {
    const Recognition = getRecognition();
    if (!Recognition) {
      setError("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    recognitionRef.current?.abort();
    clearCheck();
    const now = performance.now();
    const session: ListeningSession = { startedAt: now, lastResultAt: now, lastVoiceAt: 0, recentLevels: [], committed: "", transcript: "", finished: false };
    sessionRef.current = session;
    setTranscript("");
    setError("");

    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      if (session.finished) return;
      const heard = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      session.transcript = `${session.committed} ${heard}`.replace(/\s+/g, " ").trim();
      session.lastResultAt = performance.now();
      setTranscript(session.transcript);
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Please allow microphone access to talk to the assistant.");
      }
    };
    recognition.onend = () => {
      if (session.finished || recognitionRef.current !== recognition) {
        setIsListening(false);
        return;
      }
      session.committed = session.transcript;
      session.lastResultAt = performance.now();
      recognition.start();
    };

    recognitionRef.current = recognition;
    checkTimerRef.current = setInterval(checkForEndOfTurn, voiceTiming.checkIntervalMs);
    setIsListening(true);
    startMeter(session);
    recognition.start();
  }, [lang, checkForEndOfTurn, startMeter]);

  useEffect(() => stop, [stop]);

  return { isListening, transcript, level, error, start, stop, finish };
}
