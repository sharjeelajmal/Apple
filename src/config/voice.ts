export const voiceTiming = {
  basePauseMs: 1000,
  sentenceEndPauseMs: 750,
  continuationExtraMs: 900,
  shortPhraseExtraMs: 600,
  checkIntervalMs: 120,
  noSpeechTimeoutMs: 9000,
  maxUtteranceMs: 30000,
};

export const SHORT_PHRASE_WORDS = 3;

export const continuationWords = new Set([
  "and", "or", "but", "the", "a", "an", "of", "to", "for", "with", "my", "your", "is", "are", "was", "that",
  "which", "about", "in", "on", "at", "from", "i", "i'm", "want", "need", "like", "if", "so", "because",
  "then", "also", "um", "uh", "ki", "ka", "ke", "ko", "se", "mein", "me", "aur", "ya", "lekin", "magar",
  "mera", "meri", "mere", "apna", "apni", "ye", "yeh", "woh", "wo", "kya", "kaun", "jo", "agar", "to",
  "phir", "bhi", "liye", "wala", "wali", "کی", "کا", "کے", "کو", "سے", "میں", "اور", "یا", "لیکن",
  "مگر", "میرا", "میری", "میرے", "یہ", "وہ", "کیا", "جو", "اگر", "تو", "پھر", "بھی", "لیے", "والا",
  "والی", "की", "का", "के", "को", "से", "में", "और", "या", "लेकिन", "मगर", "मेरा", "मेरी", "मेरे",
  "यह", "ये", "वह", "वो", "क्या", "जो", "अगर", "तो", "फिर", "भी", "लिए", "वाला", "वाली",
]);

export const completeShortPhrases = new Set([
  "yes", "no", "ok", "okay", "thanks", "thank you", "yes please", "no thanks", "cancel it", "go ahead",
  "haan", "han", "ji", "nahi", "nahin", "theek hai", "shukriya", "bilkul",
  "ہاں", "جی", "نہیں", "ٹھیک ہے", "شکریہ", "بالکل",
  "हाँ", "हां", "जी", "नहीं", "ठीक है", "धन्यवाद", "बिल्कुल",
]);
