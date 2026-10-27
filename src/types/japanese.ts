export interface VocabItem {
  id: string;
  japanese: string; // e.g. スニーカー
  hiragana?: string; // furigana or kana reading
  romaji: string; // suni-ka-
  koreanPron: string; // 스니-카-
  korean: string; // 스니커즈 (운동화)
  category: 'core' | 'additional' | 'katakana_long';
  number?: number; // 1 to 8 as in page 1
  exampleJa?: string;
  exampleKo?: string;
  note?: string;
  imageUrl?: string;
}

export interface ExpressionItem {
  id: string;
  number: number;
  japanese: string;
  romaji: string;
  koreanPron: string;
  korean: string;
  situation: string;
  tip?: string;
}

export interface DialogueLine {
  id: string;
  speaker: '손님' | '점원';
  speakerRole: 'customer' | 'clerk';
  japanese: string;
  romaji: string;
  koreanPron: string;
  korean: string;
  note?: string;
}

export interface DialogueScene {
  id: number;
  title: string; // e.g. ① 말걸기, ② 존재, ③ 확인, ④ 의뢰
  situation: string;
  lines: DialogueLine[];
}

export interface PatternPractice {
  id: string;
  title: string;
  pattern: string;
  patternDescription: string;
  exampleQuestion: string;
  exampleAnswer: string;
  items: {
    word: string;
    wordKo: string;
    fullQuestion: string;
    fullAnswer: string;
    questionKo: string;
    answerKo: string;
  }[];
}

export interface KatakanaLongVowelItem {
  word: string;
  korean: string;
  koreanPron: string;
  longVowelPosition: string; // e.g. "マ ー ク"
  beats: number;
}
