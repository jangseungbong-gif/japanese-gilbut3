import React, { useState } from 'react';
import { Volume2, Check, Music, Sparkles, BookOpen, Bookmark } from 'lucide-react';
import { ExpressionItem, KatakanaLongVowelItem } from '../../types/japanese';
import { speakJapanese, playCheckSound, playClickSound } from '../../utils/audio';

interface ExpressionsTabProps {
  expressions: ExpressionItem[];
  katakanaItems: KatakanaLongVowelItem[];
  speechSpeed: number;
  speechChecks: Record<string, [boolean, boolean, boolean]>;
  bookmarked: string[];
  onToggleCheck: (id: string, index: number) => void;
  onToggleBookmark: (id: string) => void;
}

export const ExpressionsTab: React.FC<ExpressionsTabProps> = ({
  expressions,
  katakanaItems,
  speechSpeed,
  speechChecks,
  bookmarked,
  onToggleCheck,
  onToggleBookmark,
}) => {
  const [activeKatakana, setActiveKatakana] = useState<string | null>(null);

  const handlePlayExpression = (text: string) => {
    speakJapanese(text, speechSpeed);
  };

  const handlePlayKatakana = (item: KatakanaLongVowelItem) => {
    setActiveKatakana(item.word);
    speakJapanese(item.word, speechSpeed * 0.9, () => {
      setActiveKatakana(null);
    });
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-teal-600/10">
        <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
          きいて はなす 1 • 표현 & 발음
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          실전 상점 회화 필수 표현 6가지
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-xl">
          일본 매장에서 가장 자주 쓰는 핵심 표현입니다. 교과서와 동일하게 3회씩 소리 내어 말하며 완벽히 입에 익혀보세요.
        </p>
      </div>

      {/* 6 Key Expressions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <span>잘 듣고 발음에 주의해서 3회씩 따라 말하기</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expressions.map((exp) => {
            const checks = speechChecks[exp.id] || [false, false, false];
            const isMastered = checks[0] && checks[1] && checks[2];
            const isFav = bookmarked.includes(exp.id);

            return (
              <div
                key={exp.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                  isMastered
                    ? 'bg-gradient-to-br from-teal-50/80 to-emerald-50/40 border-teal-300 shadow-sm'
                    : 'bg-white border-gray-200/90 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                      {exp.number}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{exp.situation}</span>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      onToggleBookmark(exp.id);
                    }}
                    className="p-1 text-gray-400 hover:text-amber-500 rounded-lg hover:bg-amber-50"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Japanese and Audio */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 font-sans tracking-tight">
                      {exp.japanese}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                        [{exp.koreanPron}]
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{exp.romaji}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayExpression(exp.japanese)}
                    className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs"
                    title="발음 듣기"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Korean Translation */}
                <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 text-sm font-bold text-gray-800 mb-3">
                  {exp.korean}
                </div>

                {/* 3 Checkboxes */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">따라 말하기</span>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((idx) => {
                      const checked = checks[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            playCheckSound();
                            onToggleCheck(exp.id, idx);
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${
                            checked
                              ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-teal-400'
                          }`}
                        >
                          {checked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `${idx + 1}회`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {exp.tip && (
                  <p className="text-[11px] text-gray-500 mt-2 bg-teal-50/40 p-2 rounded-lg border border-teal-100/50">
                    💡 <strong className="text-teal-900">TIP:</strong> {exp.tip}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Lesson: 가타카나의 장음 (야사시이 발음) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-teal-100 shadow-sm space-y-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>교과서 포인트 레슨 • やさしい発音</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              가타카나의 장음(ー) 박자 마스터하기
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              장음이란 <strong>앞 글자의 모음을 한 박(拍) 더 길게</strong> 발음하는 것을 말합니다.
              가타카나의 장음은 장음 부호(<strong>ー</strong>)로 표기하며, 한 글자처럼 온전한 1박자의 길이를 가집니다.
            </p>
          </div>
        </div>

        {/* Visual Rhythm Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {katakanaItems.map((item) => {
            const isPlayingThis = activeKatakana === item.word;
            return (
              <div
                key={item.word}
                onClick={() => handlePlayKatakana(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isPlayingThis
                    ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-200'
                    : 'bg-gray-50/70 border-gray-200 hover:bg-amber-50/50 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-black text-gray-900 font-sans">{item.word}</span>
                  <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full font-bold">
                    <Music className="w-3 h-3" />
                    <span>{item.beats}박자</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  <span className="font-semibold text-gray-800">{item.korean}</span>
                  <span className="ml-1.5 text-teal-700 font-medium">[{item.koreanPron}]</span>
                </div>

                {/* Rhythm breakdown visualizer */}
                <div className="flex items-center gap-1.5 mt-2">
                  {item.longVowelPosition.split(' ').map((char, i) => {
                    const isLongMark = char === 'ー';
                    return (
                      <span
                        key={i}
                        className={`flex-1 text-center py-1 rounded-md text-xs font-mono font-bold transition-all ${
                          isLongMark
                            ? 'bg-red-500 text-white shadow-xs font-black'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-200/60">
                  <span>클릭하여 박자 듣기</span>
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
