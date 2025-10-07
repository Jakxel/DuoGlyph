export type HangulSymbol = {
  symbol: string;
  romanization: string;
  group: "vowel" | "double" | "plain" | "aspirated" | "tense";
};

export const koreanSymbols: HangulSymbol[] = [
  // Vowels (basic)
  { symbol: "ㅏ", romanization: "a", group: "vowel" },
  { symbol: "ㅑ", romanization: "ya", group: "vowel" },
  { symbol: "ㅓ", romanization: "eo", group: "vowel" },
  { symbol: "ㅕ", romanization: "yeo", group: "vowel" },
  { symbol: "ㅗ", romanization: "o", group: "vowel" },
  { symbol: "ㅛ", romanization: "yo", group: "vowel" },
  { symbol: "ㅜ", romanization: "u", group: "vowel" },
  { symbol: "ㅠ", romanization: "yu", group: "vowel" },
  { symbol: "ㅡ", romanization: "eu", group: "vowel" },
  { symbol: "ㅣ", romanization: "i", group: "vowel" },

  // Double vowels (diphthongs)
  { symbol: "ㅐ", romanization: "ae", group: "double" },
  { symbol: "ㅒ", romanization: "yae", group: "double" },
  { symbol: "ㅔ", romanization: "e", group: "double" },
  { symbol: "ㅖ", romanization: "ye", group: "double" },
  { symbol: "ㅘ", romanization: "wa", group: "double" },
  { symbol: "ㅙ", romanization: "wae", group: "double" },
  { symbol: "ㅚ", romanization: "oe", group: "double" },
  { symbol: "ㅝ", romanization: "wo", group: "double" },
  { symbol: "ㅞ", romanization: "we", group: "double" },
  { symbol: "ㅟ", romanization: "wi", group: "double" },
  { symbol: "ㅢ", romanization: "ui", group: "double" },

  // Plain consonants
  { symbol: "ㄱ", romanization: "g", group: "plain" },
  { symbol: "ㄴ", romanization: "n", group: "plain" },
  { symbol: "ㄷ", romanization: "d", group: "plain" },
  { symbol: "ㄹ", romanization: "rl", group: "plain" },
  { symbol: "ㅁ", romanization: "m", group: "plain" },
  { symbol: "ㅂ", romanization: "b", group: "plain" },
  { symbol: "ㅅ", romanization: "s", group: "plain" },
  { symbol: "ㅇ", romanization: "ng", group: "plain" },
  { symbol: "ㅈ", romanization: "j", group: "plain" },
  { symbol: "ㅎ", romanization: "h", group: "plain" },

  // Aspirated consonants
  { symbol: "ㅋ", romanization: "k", group: "aspirated" },
  { symbol: "ㅌ", romanization: "t", group: "aspirated" },
  { symbol: "ㅍ", romanization: "p", group: "aspirated" },
  { symbol: "ㅊ", romanization: "ch", group: "aspirated" },

  // Tense consonants
  { symbol: "ㄲ", romanization: "kk", group: "tense" },
  { symbol: "ㄸ", romanization: "tt", group: "tense" },
  { symbol: "ㅃ", romanization: "pp", group: "tense" },
  { symbol: "ㅆ", romanization: "ss", group: "tense" },
  { symbol: "ㅉ", romanization: "jj", group: "tense" },
];