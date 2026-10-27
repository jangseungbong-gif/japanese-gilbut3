import React, { useState } from 'react';
import { Volume2, Bookmark, Check, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { VocabItem } from '../types/japanese';
import { speakJapanese, playCheckSound, playClickSound } from '../utils/audio';

interface WordCardProps {
  item: VocabItem;
  speechSpeed: number;
  checks: [boolean, boolean, boolean];
  isBookmarked: boolean;
  onToggleCheck: (index: number) => void;
  onToggleBookmark: () => void;
  hideMeaningGlobal?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  item,
  speechSpeed,
  checks,
  isBookmarked,
  onToggleCheck,
  onToggleBookmark,
  hideMeaningGlobal = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [localShowMeaning, setLocalShowMeaning] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const isAllChecked = checks[0] && checks[1] && checks[2];
  const showMeaning = !hideMeaningGlobal || localShowMeaning;

  const handlePlayAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(true);
    speakJapanese(item.japanese, speechSpeed, () => {
      setIsPlaying(false);
    });
  };

  const handlePlayExample = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.exampleJa) {
      speakJapanese(item.exampleJa, speechSpeed);
    }
  };

  const handleCheckClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playCheckSound();
    onToggleCheck(idx);
  };

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
        isAllChecked
          ? 'bg-gradient-to-b from-emerald-50/70 to-teal-50/30 border-emerald-300 shadow-sm'
          : 'bg-white border-gray-200/90 hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      {/* Top Bar: Number Tag, Category Badge, Bookmark */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          {item.number ? (
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              {item.number}
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
              보충
            </span>
          )}
          {item.category === 'katakana_long' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              장음 (ー)
            </span>
          )}
          {isAllChecked && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> 암기 완료
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            onToggleBookmark();
          }}
          title={isBookmarked ? '중요 단어 해제' : '중요 단어로 표시'}
          className="p-1.5 text-gray-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition-colors"
        >
          <Bookmark
            className={`w-4 h-4 transition-transform ${
              isBookmarked ? 'fill-amber-400 text-amber-500 scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Main Japanese Text & Audio */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-wide font-sans">
              {item.japanese}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              [{item.koreanPron}]
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{item.romaji}</p>
        </div>

        {/* TTS Pronounce Button */}
        <button
          onClick={handlePlayAudio}
          className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-emerald-600 text-white shadow-md scale-95 ring-4 ring-emerald-200'
              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white shadow-xs'
          }`}
          title="발음 듣기 (일본어 TTS)"
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Korean Meaning (with Hide/Show toggle support) */}
      <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 mb-3">
        {showMeaning ? (
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-gray-800">
              {item.korean}
            </span>
            {hideMeaningGlobal && (
              <button
                onClick={() => setLocalShowMeaning(false)}
                className="text-xs text-gray-400 hover:text-gray-600 p-1"
                title="뜻 숨기기"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setLocalShowMeaning(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>뜻 확인하기 (클릭)</span>
          </button>
        )}

        {/* Example sentence if present */}
        {item.exampleJa && (
          <div className="mt-2 pt-2 border-t border-gray-200/70 text-xs">
            <div className="flex items-center justify-between text-gray-700">
              <span className="font-semibold text-emerald-900">{item.exampleJa}</span>
              <button
                onClick={handlePlayExample}
                className="text-emerald-600 hover:text-emerald-800 p-0.5"
                title="예문 발음 듣기"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {showMeaning && (
              <span className="text-gray-500 block mt-0.5">{item.exampleKo}</span>
            )}
          </div>
        )}
      </div>

      {/* 3-Times Speech Practice (세 번씩 따라 말하며 체크해 봅시다) */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
            <span>🗣️ 따라 말하기 체크 (3회)</span>
          </span>
          <span className="text-[10px] text-gray-400">
            {checks.filter(Boolean).length}/3 완료
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((idx) => {
            const isChecked = checks[idx];
            return (
              <button
                key={idx}
                onClick={(e) => handleCheckClick(idx, e)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  isChecked
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    isChecked
                      ? 'border-white bg-white/20'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </span>
                <span>{idx + 1}회</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note / Tip toggle */}
      {item.note && (
        <div className="mt-2.5">
          <button
            onClick={() => setShowNote(!showNote)}
            className="text-[11px] font-medium text-emerald-700 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{showNote ? '학습 팁 닫기' : '학습 팁 보기'}</span>
          </button>
          {showNote && (
            <div className="mt-1.5 p-2 bg-emerald-50/80 rounded-lg text-xs text-emerald-900 border border-emerald-100/70">
              {item.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
