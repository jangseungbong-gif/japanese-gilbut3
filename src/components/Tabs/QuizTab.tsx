import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Award, Brain, Headphones, Puzzle } from 'lucide-react';
import { CORE_VOCABULARY, ADDITIONAL_VOCABULARY, CORE_EXPRESSIONS } from '../../data/japaneseData';
import { speakJapanese, playSuccessSound, playWrongSound, playClickSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface QuizTabProps {
  speechSpeed: number;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

type QuizType = 'vocab' | 'listening' | 'sentence_puzzle';

interface MultipleChoiceQ {
  id: string;
  type: 'vocab' | 'listening';
  questionText: string;
  audioText?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

interface SentencePuzzleQ {
  id: string;
  korean: string;
  correctSentence: string;
  chunks: string[];
}

export const QuizTab: React.FC<QuizTabProps> = ({
  speechSpeed,
  highScore,
  onUpdateHighScore,
}) => {
  const [activeQuizType, setActiveQuizType] = useState<QuizType>('vocab');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // For sentence puzzle
  const [selectedChunks, setSelectedChunks] = useState<string[]>([]);
  const [puzzleSubmitted, setPuzzleSubmitted] = useState(false);
  const [isPuzzleCorrect, setIsPuzzleCorrect] = useState<boolean | null>(null);

  // Generate Questions
  const vocabQuestions: MultipleChoiceQ[] = React.useMemo(() => {
    const all = [...CORE_VOCABULARY, ...ADDITIONAL_VOCABULARY];
    return all.slice(0, 10).map((v, i) => {
      const others = all.filter((o) => o.id !== v.id).map((o) => o.korean);
      const shuffledOthers = [...others].sort(() => Math.sin(i * 3 + others.length) - 0.5).slice(0, 3);
      const options = [v.korean, ...shuffledOthers].sort(() => Math.sin(v.korean.length) - 0.5);

      return {
        id: `v_q_${v.id}`,
        type: 'vocab',
        questionText: v.japanese,
        audioText: v.japanese,
        correctAnswer: v.korean,
        options,
        explanation: `${v.japanese} [${v.koreanPron}] = ${v.korean}`,
      };
    });
  }, []);

  const listeningQuestions: MultipleChoiceQ[] = React.useMemo(() => {
    const pool = [
      ...CORE_VOCABULARY,
      ...CORE_EXPRESSIONS.map((e) => ({
        id: e.id,
        japanese: e.japanese,
        korean: e.korean,
        koreanPron: e.koreanPron,
      })),
    ];

    return pool.slice(0, 8).map((item, idx) => {
      const others = pool.filter((o) => o.id !== item.id).map((o) => o.japanese);
      const shuffledOthers = [...others].sort(() => Math.sin(idx * 2) - 0.5).slice(0, 3);
      const options = [item.japanese, ...shuffledOthers].sort(() => Math.sin(item.japanese.length) - 0.5);

      return {
        id: `list_q_${item.id}`,
        type: 'listening',
        questionText: '소리를 듣고 알맞은 일본어 표현을 고르세요',
        audioText: item.japanese,
        correctAnswer: item.japanese,
        options,
        explanation: `정답: ${item.japanese} (${item.korean})`,
      };
    });
  }, []);

  const sentencePuzzles: SentencePuzzleQ[] = [
    {
      id: 'sp1',
      korean: '저기, 실례합니다.',
      correctSentence: 'あのう、 すみません。',
      chunks: ['すみません。', 'あのう、'],
    },
    {
      id: 'sp2',
      korean: '스니커즈 있나요?',
      correctSentence: 'スニーカー ありますか。',
      chunks: ['ありますか。', 'スニーカー'],
    },
    {
      id: 'sp3',
      korean: '이쪽에 있습니다.',
      correctSentence: 'こちらに あります。',
      chunks: ['あります。', 'こちらに'],
    },
    {
      id: 'sp4',
      korean: '그럼, 이거 주세요.',
      correctSentence: 'じゃあ、 これ ください。',
      chunks: ['ください。', 'じゃあ、', 'これ'],
    },
    {
      id: 'sp5',
      korean: '이것은 리사이클 스니커즈네요.',
      correctSentence: 'これは リサイクル スニーカーですね。',
      chunks: ['スニーカーですね。', 'これは', 'リサイクル'],
    },
    {
      id: 'sp6',
      korean: '네. 알겠습니다.',
      correctSentence: 'はい。 わかりました。',
      chunks: ['わかりました。', 'はい。'],
    },
  ];

  // Auto-play audio when entering listening question
  useEffect(() => {
    if (activeQuizType === 'listening' && !isFinished) {
      const q = listeningQuestions[currentIdx];
      if (q && q.audioText) {
        speakJapanese(q.audioText, speechSpeed);
      }
    }
  }, [activeQuizType, currentIdx, isFinished, speechSpeed, listeningQuestions]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const curQ =
      activeQuizType === 'vocab'
        ? vocabQuestions[currentIdx]
        : listeningQuestions[currentIdx];

    if (opt === curQ.correctAnswer) {
      setScore((prev) => prev + 10);
      playSuccessSound();
    } else {
      playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    const listLength =
      activeQuizType === 'vocab'
        ? vocabQuestions.length
        : activeQuizType === 'listening'
        ? listeningQuestions.length
        : sentencePuzzles.length;

    if (currentIdx + 1 < listLength) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setSelectedChunks([]);
      setPuzzleSubmitted(false);
      setIsPuzzleCorrect(null);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === (activeQuizType === 'vocab' ? vocabQuestions[currentIdx]?.correctAnswer : listeningQuestions[currentIdx]?.correctAnswer) ? 10 : 0);
      if (finalScore > highScore) {
        onUpdateHighScore(finalScore);
      }
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleChunkClick = (chunk: string) => {
    if (puzzleSubmitted) return;
    playClickSound();
    if (selectedChunks.includes(chunk)) {
      setSelectedChunks((prev) => prev.filter((c) => c !== chunk));
    } else {
      setSelectedChunks((prev) => [...prev, chunk]);
    }
  };

  const handleCheckPuzzle = () => {
    const p = sentencePuzzles[currentIdx];
    const userBuilt = selectedChunks.join(' ');
    const isRight = userBuilt.trim() === p.correctSentence.trim();

    setPuzzleSubmitted(true);
    setIsPuzzleCorrect(isRight);

    if (isRight) {
      setScore((prev) => prev + 15);
      playSuccessSound();
      speakJapanese(p.correctSentence, speechSpeed);
    } else {
      playWrongSound();
    }
  };

  const handleRestart = (type?: QuizType) => {
    if (type) setActiveQuizType(type);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setSelectedChunks([]);
    setPuzzleSubmitted(false);
    setIsPuzzleCorrect(null);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-purple-600/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
              완벽 암기 검증 • 퀴즈 아레나
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              실력 점검 & 뇌새김 퀴즈
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-xl">
              단어 뜻, 원어민 발음 리스닝, 교과서 문장 순서 조립 퍼즐까지! 퀴즈를 풀며 기억을 장기기억으로 완성하세요.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 self-start md:self-auto">
            <div className="text-center">
              <span className="block text-2xl font-black text-amber-300">{score}점</span>
              <span className="text-[11px] text-purple-100 font-medium">현재 점수</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="block text-2xl font-black text-white">{highScore}점</span>
              <span className="text-[11px] text-purple-100 font-medium">최고 기록</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          {
            type: 'vocab',
            title: '1. 단어 뜻 맞히기',
            desc: '일본어를 보고 우리말 뜻 선택',
            icon: Brain,
          },
          {
            type: 'listening',
            title: '2. 듣기 평가 퀴즈',
            desc: '원어민 소리를 듣고 단어 선택',
            icon: Headphones,
          },
          {
            type: 'sentence_puzzle',
            title: '3. 문장 조립 퍼즐',
            desc: '블록을 순서대로 눌러 문장 완성',
            icon: Puzzle,
          },
        ].map((m) => {
          const isSelected = activeQuizType === m.type;
          const Icon = m.icon;
          return (
            <button
              key={m.type}
              onClick={() => handleRestart(m.type as QuizType)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-100'
                  : 'bg-white/80 border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className="text-xs font-bold text-gray-900">{m.title}</span>
              </div>
              <p className="text-[11px] text-gray-500">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Quiz Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm">
        {!isFinished ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                문제 {currentIdx + 1} /{' '}
                {activeQuizType === 'vocab'
                  ? vocabQuestions.length
                  : activeQuizType === 'listening'
                  ? listeningQuestions.length
                  : sentencePuzzles.length}
              </span>
              <span className="text-xs font-extrabold text-amber-600">누적: {score}점</span>
            </div>

            {activeQuizType !== 'sentence_puzzle' ? (
              (() => {
                const q =
                  activeQuizType === 'vocab'
                    ? vocabQuestions[currentIdx]
                    : listeningQuestions[currentIdx];

                return (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 text-center border border-gray-200/80">
                      {activeQuizType === 'vocab' ? (
                        <div>
                          <span className="text-xs text-gray-400 font-bold block mb-2">
                            다음 단어의 올바른 뜻은?
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-gray-900 font-sans tracking-wide">
                            {q.questionText}
                          </div>
                          <button
                            onClick={() => q.audioText && speakJapanese(q.audioText, speechSpeed)}
                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold hover:bg-purple-200 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>발음 듣기</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-gray-400 font-bold block mb-2">
                            귀 기울여 듣고 맞는 표현을 선택하세요
                          </span>
                          <button
                            onClick={() => q.audioText && speakJapanese(q.audioText, speechSpeed)}
                            className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                            title="다시 듣기"
                          >
                            <Volume2 className="w-8 h-8 animate-pulse" />
                          </button>
                          <span className="text-xs text-gray-500 mt-2 block font-medium">
                            버튼을 눌러 다시 들을 수 있습니다
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, i) => {
                        const isChosen = selectedOption === opt;
                        const isCorrectOpt = opt === q.correctAnswer;

                        let style = 'bg-white border-gray-200 hover:border-purple-300 text-gray-800';
                        if (isAnswered) {
                          if (isCorrectOpt) {
                            style = 'bg-emerald-500 text-white border-emerald-600 shadow-md font-bold';
                          } else if (isChosen) {
                            style = 'bg-red-500 text-white border-red-600 font-bold';
                          } else {
                            style = 'bg-gray-100 text-gray-400 border-gray-200';
                          }
                        }

                        return (
                          <button
                            key={i}
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(opt)}
                            className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between ${style}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isCorrectOpt && (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            )}
                            {isAnswered && isChosen && !isCorrectOpt && (
                              <XCircle className="w-5 h-5 text-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{q.explanation}</span>
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                        >
                          다음 문제 →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              (() => {
                const puzzle = sentencePuzzles[currentIdx];

                return (
                  <div className="space-y-6">
                    <div className="bg-emerald-50/60 rounded-3xl p-6 text-center border border-emerald-100">
                      <span className="text-xs text-emerald-800 font-bold block mb-1">
                        아래 한국어 문장에 맞게 블록을 순서대로 배열하세요
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-gray-900">
                        {puzzle.korean}
                      </div>
                    </div>

                    <div className="min-h-16 p-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 flex-wrap">
                      {selectedChunks.length === 0 ? (
                        <span className="text-xs text-gray-400">
                          아래 블록을 클릭하여 문장을 만드세요
                        </span>
                      ) : (
                        selectedChunks.map((chunk, i) => (
                          <span
                            key={i}
                            onClick={() => handleChunkClick(chunk)}
                            className="cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs hover:bg-emerald-700"
                            title="클릭하여 제거"
                          >
                            {chunk}
                          </span>
                        ))
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {puzzle.chunks.map((chunk, idx) => {
                        const isUsed = selectedChunks.includes(chunk);
                        return (
                          <button
                            key={idx}
                            disabled={puzzleSubmitted}
                            onClick={() => handleChunkClick(chunk)}
                            className={`px-4 py-2.5 rounded-2xl border-2 text-base font-bold transition-all ${
                              isUsed
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-default'
                                : 'bg-white hover:bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm active:scale-95'
                            }`}
                          >
                            {chunk}
                          </button>
                        );
                      })}
                    </div>

                    {!puzzleSubmitted ? (
                      <div className="flex justify-center pt-2">
                        <button
                          disabled={selectedChunks.length === 0}
                          onClick={handleCheckPuzzle}
                          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
                        >
                          정답 확인하기
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-2xl border flex items-center justify-between ${
                          isPuzzleCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-red-50 border-red-200 text-red-900'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">
                            {isPuzzleCorrect ? '완벽합니다! 👏' : '아쉬워요! 다시 확인해 보세요.'}
                          </div>
                          <div className="text-xs mt-0.5">
                            정답 문장: <strong>{puzzle.correctSentence}</strong>
                          </div>
                        </div>

                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
                        >
                          다음 문제 →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        ) : (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
              퀴즈 완주! 수고하셨습니다 🎉
            </h3>

            <p className="text-sm text-gray-600 max-w-md mx-auto">
              최종 획득 점수: <strong className="text-purple-700 text-lg">{score}점</strong>
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => handleRestart()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>한 번 더 풀기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
