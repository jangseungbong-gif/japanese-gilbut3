import React, { useState, useMemo } from 'react';
import { Play, Pause, Shuffle, Eye, EyeOff, RotateCcw, CheckCircle2 } from 'lucide-react';
import { VocabItem } from '../../types/japanese';
import { WordCard } from '../WordCard';
import { speakJapanese, stopSpeech } from '../../utils/audio';

interface VocabularyTabProps {
  items: VocabItem[];
  speechSpeed: number;
  speechChecks: Record<string, [boolean, boolean, boolean]>;
  bookmarked: string[];
  onToggleCheck: (id: string, index: number) => void;
  onToggleBookmark: (id: string) => void;
  showOnlyBookmarks: boolean;
}

export const VocabularyTab: React.FC<VocabularyTabProps> = ({
  items,
  speechSpeed,
  speechChecks,
  bookmarked,
  onToggleCheck,
  onToggleBookmark,
  showOnlyBookmarks,
}) => {
  const [filter, setFilter] = useState<'all' | 'core' | 'additional' | 'uncompleted'>('all');
  const [hideMeanings, setHideMeanings] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState<number | null>(null);
  const [shuffled, setShuffled] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    let list = [...items];

    if (showOnlyBookmarks) {
      list = list.filter((it) => bookmarked.includes(it.id));
    } else if (filter === 'core') {
      list = list.filter((it) => it.category === 'core');
    } else if (filter === 'additional') {
      list = list.filter((it) => it.category === 'additional');
    } else if (filter === 'uncompleted') {
      list = list.filter((it) => {
        const c = speechChecks[it.id] || [false, false, false];
        return !(c[0] && c[1] && c[2]);
      });
    }

    if (shuffled) {
      return [...list].sort(() => Math.sin(list.length) - 0.5);
    }
    return list;
  }, [items, filter, showOnlyBookmarks, bookmarked, speechChecks, shuffled]);

  // Mastered counts
  const totalCompleted = items.filter((it) => {
    const c = speechChecks[it.id];
    return c && c[0] && c[1] && c[2];
  }).length;

  // Auto-play all words one by one with Japanese audio
  const handleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      setAutoPlayIndex(null);
      stopSpeech();
      return;
    }

    if (filteredItems.length === 0) return;

    setIsAutoPlaying(true);
    let idx = 0;

    const playNext = () => {
      if (idx >= filteredItems.length) {
        setIsAutoPlaying(false);
        setAutoPlayIndex(null);
        return;
      }
      setAutoPlayIndex(idx);
      const curItem = filteredItems[idx];
      speakJapanese(curItem.japanese, speechSpeed, () => {
        idx++;
        setTimeout(playNext, 900);
      });
    };

    playNext();
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
              きいて はなす 1 • 단어 암기장
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              소리내어 3번씩 말하며 외우기
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              교과서 체크박스처럼 단어 발음을 듣고 3번 소리 내어 말하면서 버튼을 클릭하세요.
              입으로 직접 소리 내는 것이 가장 빠른 암기 비결입니다!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 self-start md:self-auto">
            <div className="text-center">
              <span className="block text-2xl font-black text-amber-300">
                {totalCompleted}
              </span>
              <span className="text-[11px] text-emerald-100 font-medium">완료한 단어</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="block text-2xl font-black text-white">
                {items.length}
              </span>
              <span className="text-[11px] text-emerald-100 font-medium">전체 단어</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Blind Mode, Auto Play */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `전체 (${items.length})` },
            { id: 'core', label: '교과서 1~8번 (8개)' },
            { id: 'additional', label: '보충 어휘 (7개)' },
            { id: 'uncompleted', label: `미완료 (${items.length - totalCompleted})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as typeof filter);
                setShuffled(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Blind Mode Toggle */}
          <button
            onClick={() => setHideMeanings(!hideMeanings)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              hideMeanings
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
            }`}
            title="한국어 뜻을 가리고 일본어만 보며 스스로 테스트합니다."
          >
            {hideMeanings ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideMeanings ? '뜻 가리기 켜짐' : '뜻 가리기 (암기 테스트)'}</span>
          </button>

          {/* Shuffle Toggle */}
          <button
            onClick={() => setShuffled(!shuffled)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              shuffled
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
            }`}
            title="단어 순서 랜덤 섞기"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>섞기</span>
          </button>

          {/* Auto Listen */}
          <button
            onClick={handleAutoPlay}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs ${
              isAutoPlaying
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>정지 ({autoPlayIndex !== null ? autoPlayIndex + 1 : 0}/{filteredItems.length})</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>연속 듣기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Word Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">해당하는 단어가 없습니다!</h3>
          <p className="text-xs text-gray-500 mt-1">모든 단어를 마스터했거나 필터 조건에 맞는 단어가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`transition-all ${
                autoPlayIndex === idx ? 'ring-4 ring-emerald-400 rounded-2xl scale-[1.02]' : ''
              }`}
            >
              <WordCard
                item={item}
                speechSpeed={speechSpeed}
                checks={speechChecks[item.id] || [false, false, false]}
                isBookmarked={bookmarked.includes(item.id)}
                onToggleCheck={(checkIndex) => onToggleCheck(item.id, checkIndex)}
                onToggleBookmark={() => onToggleBookmark(item.id)}
                hideMeaningGlobal={hideMeanings}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
