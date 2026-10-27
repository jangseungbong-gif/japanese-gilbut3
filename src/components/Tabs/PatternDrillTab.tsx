import React, { useState } from 'react';
import { Volume2, Play, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { PATTERN_PRACTICES } from '../../data/japaneseData';
import { speakJapanese, playCheckSound, playSuccessSound } from '../../utils/audio';

interface PatternDrillTabProps {
  speechSpeed: number;
}

export const PatternDrillTab: React.FC<PatternDrillTabProps> = ({ speechSpeed }) => {
  const [selectedPatternId, setSelectedPatternId] = useState<'p1' | 'p2'>('p1');
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [speakingSide, setSpeakingSide] = useState<'question' | 'answer' | null>(null);
  const [completedDrills, setCompletedDrills] = useState<Record<string, boolean>>({});

  const currentPattern = PATTERN_PRACTICES.find((p) => p.id === selectedPatternId)!;
  const currentItem = currentPattern.items[selectedItemIdx];

  const handlePlayQuestion = () => {
    setSpeakingSide('question');
    speakJapanese(currentItem.fullQuestion, speechSpeed, () => {
      setSpeakingSide(null);
    });
  };

  const handlePlayAnswer = () => {
    setSpeakingSide('answer');
    speakJapanese(currentItem.fullAnswer, speechSpeed, () => {
      setSpeakingSide(null);
    });
  };

  const handlePlayFull = () => {
    setSpeakingSide('question');
    speakJapanese(currentItem.fullQuestion, speechSpeed, () => {
      setSpeakingSide('answer');
      setTimeout(() => {
        speakJapanese(currentItem.fullAnswer, speechSpeed, () => {
          setSpeakingSide(null);
        });
      }, 500);
    });
  };

  const handleMarkComplete = () => {
    playSuccessSound();
    const key = `${selectedPatternId}_${selectedItemIdx}`;
    setCompletedDrills((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-500/10">
        <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
          きいて はなす 2 • 패턴 교체 연습
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          단어만 바꿔 넣으면 술술 나오는 패턴 회화
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
          교과서 4페이지 실전 연습! <strong>'ありますか'</strong>(존재 묻기)와 <strong>'ください'</strong>(의뢰하기)
          패턴에 다양한 단어를 대입하며 유창하게 말해보세요.
        </p>
      </div>

      {/* Pattern Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PATTERN_PRACTICES.map((p) => {
          const isSelected = p.id === selectedPatternId;
          const completedCount = p.items.filter(
            (_, idx) => completedDrills[`${p.id}_${idx}`]
          ).length;

          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPatternId(p.id as 'p1' | 'p2');
                setSelectedItemIdx(0);
              }}
              className={`text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-100'
                  : 'bg-white/80 border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {p.id === 'p1' ? '패턴 1: 존재 묻기' : '패턴 2: 의뢰/주문하기'}
                </span>
                <span className="text-xs text-gray-400">
                  {completedCount}/{p.items.length} 완료
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">{p.title}</h3>
              <p className="text-xs text-emerald-700 font-mono mt-1 font-semibold">{p.pattern}</p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/90 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              1. 대입할 단어를 선택하세요
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              교과서 예시 및 연습 문제
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {currentPattern.items.map((item, idx) => {
              const isSelected = idx === selectedItemIdx;
              const isDone = !!completedDrills[`${selectedPatternId}_${idx}`];

              return (
                <button
                  key={item.word}
                  onClick={() => {
                    playCheckSound();
                    setSelectedItemIdx(idx);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 font-bold'
                      : 'bg-gray-50 hover:bg-emerald-50/60 border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-base sm:text-lg font-black">{item.word}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {item.wordKo}
                  </div>
                  {isDone && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-amber-300 font-bold">
                      <Sparkles className="w-2.5 h-2.5" /> 연습 완료
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dialogue Display */}
        <div className="space-y-4 bg-emerald-50/40 rounded-3xl p-5 sm:p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>2. 교체된 대화 듣고 직접 말하기</span>
            </span>

            <button
              onClick={handlePlayFull}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Q&A 연속 듣기</span>
            </button>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
              A
            </div>
            <div
              className={`flex-1 rounded-2xl p-4 transition-all border ${
                speakingSide === 'question'
                  ? 'bg-white border-blue-400 ring-4 ring-blue-100 shadow-md'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-black text-gray-900">
                    {currentItem.fullQuestion}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {currentItem.questionKo}
                  </div>
                </div>
                <button
                  onClick={handlePlayQuestion}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  title="질문 발음 듣기"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center shrink-0">
              B
            </div>
            <div
              className={`flex-1 rounded-2xl p-4 transition-all border ${
                speakingSide === 'answer'
                  ? 'bg-white border-teal-400 ring-4 ring-teal-100 shadow-md'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-black text-gray-900">
                    {currentItem.fullAnswer}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {currentItem.answerKo}
                  </div>
                </div>
                <button
                  onClick={handlePlayAnswer}
                  className="p-2 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                  title="대답 발음 듣기"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            소리 내어 A와 B 역할을 모두 말해보셨나요?
          </span>
          <button
            onClick={handleMarkComplete}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>이 패턴 말하기 마스터 완료!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
