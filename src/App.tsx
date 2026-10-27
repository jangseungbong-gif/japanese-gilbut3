import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  MessageSquare,
  Repeat,
  Sparkles,
  Brain,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { CORE_VOCABULARY, ADDITIONAL_VOCABULARY, CORE_EXPRESSIONS, KATAKANA_LONG_VOWELS } from './data/japaneseData';
import { UserProgress, loadProgress, saveProgress } from './utils/storage';
import { Header } from './components/Header';
import { VocabularyTab } from './components/Tabs/VocabularyTab';
import { ExpressionsTab } from './components/Tabs/ExpressionsTab';
import { RoleplayTab } from './components/Tabs/RoleplayTab';
import { PatternDrillTab } from './components/Tabs/PatternDrillTab';
import { GrammarTab } from './components/Tabs/GrammarTab';
import { QuizTab } from './components/Tabs/QuizTab';
import { TextbookViewerTab } from './components/Tabs/TextbookViewerTab';
import confetti from 'canvas-confetti';

type TabType = 'vocab' | 'expressions' | 'roleplay' | 'patterns' | 'grammar' | 'quiz' | 'textbook';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [activeTab, setActiveTab] = useState<TabType>('vocab');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const allVocab = [...CORE_VOCABULARY, ...ADDITIONAL_VOCABULARY];
  const allPracticeItems = [
    ...allVocab.map((v) => v.id),
    ...CORE_EXPRESSIONS.map((e) => e.id),
  ];

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const totalChecks = Object.values(progress.speechChecks).reduce((acc, checks) => {
    return acc + (checks[0] ? 1 : 0) + (checks[1] ? 1 : 0) + (checks[2] ? 1 : 0);
  }, 0);
  const maxChecks = allPracticeItems.length * 3;

  const handleToggleCheck = (id: string, index: number) => {
    setProgress((prev) => {
      const current = prev.speechChecks[id] || [false, false, false];
      const updated: [boolean, boolean, boolean] = [...current];
      updated[index] = !updated[index];

      if (updated[0] && updated[1] && updated[2] && !(current[0] && current[1] && current[2])) {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
      }

      return {
        ...prev,
        speechChecks: {
          ...prev.speechChecks,
          [id]: updated,
        },
      };
    });
  };

  const handleToggleBookmark = (id: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarked.includes(id);
      return {
        ...prev,
        bookmarked: exists
          ? prev.bookmarked.filter((item) => item !== id)
          : [...prev.bookmarked, id],
      };
    });
  };

  const handleSpeedChange = (speed: number) => {
    setProgress((prev) => ({ ...prev, speechSpeed: speed }));
  };

  const handleUpdateHighScore = (newScore: number) => {
    setProgress((prev) => ({
      ...prev,
      quizHighScore: Math.max(prev.quizHighScore, newScore),
      totalQuizzesTaken: prev.totalQuizzesTaken + 1,
    }));
  };

  const handleConfirmReset = () => {
    const fresh: UserProgress = {
      speechChecks: {},
      bookmarked: [],
      quizHighScore: 0,
      totalQuizzesTaken: 0,
      speechSpeed: 1.0,
    };
    setProgress(fresh);
    saveProgress(fresh);
    setShowResetModal(false);
  };

  const navItems = [
    {
      id: 'vocab',
      label: '단어 암기',
      sub: '3회 말하기 체크',
      icon: BookOpen,
      badge: `${allVocab.length}개`,
    },
    {
      id: 'expressions',
      label: '핵심 표현',
      sub: '상점 회화 & 장음(ー)',
      icon: Volume2,
      badge: `${CORE_EXPRESSIONS.length}개`,
    },
    {
      id: 'roleplay',
      label: '대화문 롤플레잉',
      sub: '손님/점원 4단계',
      icon: MessageSquare,
      badge: '실전',
    },
    {
      id: 'patterns',
      label: '패턴 교체 연습',
      sub: 'ありますか · ください',
      icon: Repeat,
      badge: '스피킹',
    },
    {
      id: 'grammar',
      label: '존재 표현 레슨',
      sub: 'あります vs います',
      icon: Sparkles,
      badge: '문법',
    },
    {
      id: 'quiz',
      label: '암기 퀴즈',
      sub: '뜻·듣기·문장퍼즐',
      icon: Brain,
      badge: '테스트',
    },
    {
      id: 'textbook',
      label: '교과서 원본',
      sub: '4페이지 스캔본',
      icon: FileText,
      badge: '원본',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-gray-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-16">
      <Header
        totalChecks={totalChecks}
        maxChecks={maxChecks}
        bookmarkedCount={progress.bookmarked.length}
        speechSpeed={progress.speechSpeed}
        onSpeedChange={handleSpeedChange}
        onResetProgress={() => setShowResetModal(true)}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleOnlyBookmarks={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
      />

      <nav className="bg-white border-b border-gray-200/80 sticky top-[69px] sm:top-[77px] z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-left whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold leading-tight">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] hidden sm:block ${
                        isActive ? 'text-emerald-100' : 'text-gray-400'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 w-full flex-1">
        {activeTab === 'vocab' && (
          <VocabularyTab
            items={allVocab}
            speechSpeed={progress.speechSpeed}
            speechChecks={progress.speechChecks}
            bookmarked={progress.bookmarked}
            onToggleCheck={handleToggleCheck}
            onToggleBookmark={handleToggleBookmark}
            showOnlyBookmarks={showOnlyBookmarks}
          />
        )}

        {activeTab === 'expressions' && (
          <ExpressionsTab
            expressions={CORE_EXPRESSIONS}
            katakanaItems={KATAKANA_LONG_VOWELS}
            speechSpeed={progress.speechSpeed}
            speechChecks={progress.speechChecks}
            bookmarked={progress.bookmarked}
            onToggleCheck={handleToggleCheck}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'roleplay' && (
          <RoleplayTab speechSpeed={progress.speechSpeed} />
        )}

        {activeTab === 'patterns' && (
          <PatternDrillTab speechSpeed={progress.speechSpeed} />
        )}

        {activeTab === 'grammar' && (
          <GrammarTab speechSpeed={progress.speechSpeed} />
        )}

        {activeTab === 'quiz' && (
          <QuizTab
            speechSpeed={progress.speechSpeed}
            highScore={progress.quizHighScore}
            onUpdateHighScore={handleUpdateHighScore}
          />
        )}

        {activeTab === 'textbook' && (
          <TextbookViewerTab
            onNavigateTab={(tab) => setActiveTab(tab as TabType)}
          />
        )}
      </main>

      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-900">학습 진행도 초기화</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                지금까지 체크한 3회 말하기 체크박스와 북마크, 퀴즈 점수가 모두 초기화됩니다. 계속 진행하시겠습니까?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmReset}
                className="py-2.5 px-4 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm"
              >
                초기화하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
