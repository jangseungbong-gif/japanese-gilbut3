import React, { useState } from 'react';
import { Volume2, Play, Pause, User, Store, Eye, EyeOff, RotateCcw, Check, Sparkles } from 'lucide-react';
import { DIALOGUE_SCENES } from '../../data/japaneseData';
import { speakJapanese, stopSpeech, playSuccessSound, playClickSound } from '../../utils/audio';

interface RoleplayTabProps {
  speechSpeed: number;
}

export const RoleplayTab: React.FC<RoleplayTabProps> = ({ speechSpeed }) => {
  const [role, setRole] = useState<'all' | 'customer' | 'clerk'>('all');
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [hideJapanese, setHideJapanese] = useState(false);
  const [hideKorean, setHideKorean] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [completedLines, setCompletedLines] = useState<Record<string, boolean>>({});

  const allLines = DIALOGUE_SCENES.flatMap((scene) =>
    scene.lines.map((line) => ({ ...line, sceneTitle: scene.title }))
  );

  const handlePlayLine = (lineId: string, text: string) => {
    setActiveLineId(lineId);
    speakJapanese(text, speechSpeed, () => {
      setActiveLineId(null);
    });
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
      setActiveLineId(null);
      stopSpeech();
      return;
    }

    setIsPlayingAll(true);
    let idx = 0;

    const playNext = () => {
      if (idx >= allLines.length) {
        setIsPlayingAll(false);
        setActiveLineId(null);
        playSuccessSound();
        return;
      }

      const line = allLines[idx];
      setActiveLineId(line.id);

      // If user is playing a role, pause to let user speak!
      const isUserRole =
        (role === 'customer' && line.speakerRole === 'customer') ||
        (role === 'clerk' && line.speakerRole === 'clerk');

      if (isUserRole) {
        // give user 3 seconds to speak
        setTimeout(() => {
          idx++;
          playNext();
        }, 3200);
      } else {
        speakJapanese(line.japanese, speechSpeed, () => {
          idx++;
          setTimeout(playNext, 800);
        });
      }
    };

    playNext();
  };

  const handleToggleComplete = (lineId: string) => {
    playClickSound();
    setCompletedLines((prev) => ({
      ...prev,
      [lineId]: !prev[lineId],
    }));
  };

  const totalLines = allLines.length;
  const completedCount = Object.values(completedLines).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
              きいて はなす 2 • 실전 대화 롤플레잉
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              신발 매장 실전 상황극 4단계
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              손님과 점원이 되어 직접 대화해보세요.
              말걸기부터 존재 확인, 물건 확인, 구매 의뢰까지 자연스럽게 이어집니다!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePlayAll}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md transition-all ${
                isPlayingAll
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>재생 중지</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>전체 대화 연속 듣기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Role Selection & Mask options */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Role Selector */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            모든 대화 보기
          </button>
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>손님 역할</span>
          </button>
          <button
            onClick={() => setRole('clerk')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'clerk'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>점원 역할</span>
          </button>
        </div>

        {/* Mask Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideKorean(!hideKorean)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              hideKorean
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
            }`}
          >
            {hideKorean ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideKorean ? '해석 가림' : '해석 가리기'}</span>
          </button>

          <button
            onClick={() => setHideJapanese(!hideJapanese)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              hideJapanese
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
            }`}
          >
            {hideJapanese ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideJapanese ? '일본어 가림 (듣기 평가)' : '일본어 가리기'}</span>
          </button>
        </div>
      </div>

      {/* 4 Dialogue Scenes */}
      <div className="space-y-6">
        {DIALOGUE_SCENES.map((scene) => (
          <div
            key={scene.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-4"
          >
            {/* Scene Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-sm font-black text-blue-900 tracking-wide">
                  {scene.title}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">{scene.situation}</p>
              </div>
            </div>

            {/* Conversation Bubbles */}
            <div className="space-y-4 pt-1">
              {scene.lines.map((line) => {
                const isCustomer = line.speakerRole === 'customer';
                const isCurrentActive = activeLineId === line.id;
                const isUserRole =
                  (role === 'customer' && isCustomer) || (role === 'clerk' && !isCustomer);
                const isDone = !!completedLines[line.id];

                return (
                  <div
                    key={line.id}
                    className={`flex items-start gap-3 sm:gap-4 transition-all duration-300 ${
                      isCustomer ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs font-bold text-xs ${
                        isCustomer
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isCustomer ? <User className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                    </div>

                    {/* Speech Bubble Card */}
                    <div
                      className={`max-w-xl w-full rounded-2xl p-4 transition-all border ${
                        isCurrentActive
                          ? 'ring-4 ring-blue-300 scale-[1.01] shadow-md bg-white border-blue-400'
                          : isUserRole
                          ? 'bg-amber-50/60 border-amber-200/80 shadow-xs'
                          : 'bg-gray-50/90 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              isCustomer
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {line.speaker}
                          </span>
                          {isUserRole && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              ⭐ 나의 대사 차례!
                            </span>
                          )}
                        </div>

                        {/* Audio & Check */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePlayLine(line.id, line.japanese)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="발음 듣기"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleComplete(line.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDone
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-gray-300 hover:text-emerald-500 hover:bg-gray-100'
                            }`}
                            title="말하기 연습 완료 체크"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>

                      {/* Japanese Line */}
                      <div className="my-1">
                        {hideJapanese ? (
                          <div className="py-2 text-xs font-medium text-gray-400 italic">
                            [일본어 가림 상태 - 소리 듣고 따라 하거나 기억해 보세요]
                          </div>
                        ) : (
                          <div className="text-lg sm:text-xl font-black text-gray-900 tracking-tight font-sans">
                            {line.japanese}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                            [{line.koreanPron}]
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{line.romaji}</span>
                        </div>
                      </div>

                      {/* Korean Translation */}
                      {!hideKorean && (
                        <div className="mt-2 pt-2 border-t border-gray-200/70 text-sm font-bold text-gray-700">
                          {line.korean}
                        </div>
                      )}

                      {/* Note */}
                      {line.note && (
                        <div className="text-[11px] text-gray-500 mt-1.5">
                          💡 {line.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Roleplay Completion Box */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span className="text-xs sm:text-sm font-bold text-emerald-900">
            대화문 연습 진도: {completedCount} / {totalLines} 문장 마스터
          </span>
        </div>
        {completedCount === totalLines && (
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            🎉 대화문 완전 정복!
          </span>
        )}
      </div>
    </div>
  );
};
