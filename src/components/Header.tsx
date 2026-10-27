import React from 'react';
import { Volume2, Sparkles, RotateCcw, CheckCircle2, Bookmark } from 'lucide-react';

interface HeaderProps {
  totalChecks: number;
  maxChecks: number;
  bookmarkedCount: number;
  speechSpeed: number;
  onSpeedChange: (speed: number) => void;
  onResetProgress: () => void;
  showOnlyBookmarks: boolean;
  onToggleOnlyBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalChecks,
  maxChecks,
  bookmarkedCount,
  speechSpeed,
  onSpeedChange,
  onResetProgress,
  showOnlyBookmarks,
  onToggleOnlyBookmarks,
}) => {
  const progressPercent = Math.round((totalChecks / Math.max(maxChecks, 1)) * 100);

  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Subject */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold text-lg tracking-wider">
              き
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  듣고 말하기 (きいて はなす)
                </span>
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  3회 반복 암기
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                일본어 교과서 완벽 암기 마스터
              </h1>
            </div>
          </div>

          {/* Quick Settings & Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end sm:self-center">
            {/* Speed Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-medium text-gray-600">
              <span className="px-2 text-gray-400 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> 음성
              </span>
              {[0.8, 1.0, 1.2].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    speechSpeed === s
                      ? 'bg-white text-emerald-700 font-bold shadow-xs'
                      : 'hover:text-gray-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Bookmark Filter */}
            <button
              onClick={onToggleOnlyBookmarks}
              title="북마크한 단어만 모아보기"
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                showOnlyBookmarks
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-white' : 'text-amber-500'}`} />
              <span>중요 ({bookmarkedCount})</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetProgress}
              title="학습 진행도 초기화"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>3회 소리내어 말하기 완성도</span>
            <span className="text-emerald-600">
              {totalChecks} / {maxChecks} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex-1">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {progressPercent === 100 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-bounce">
              <Sparkles className="w-3.5 h-3.5" /> 마스터 달성!
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
