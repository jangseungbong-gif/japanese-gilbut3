import React, { useState } from 'react';
import { Sparkles, Check, X, RotateCcw, Volume2, Award } from 'lucide-react';
import { EXISTENCE_QUIZ_DATA } from '../../data/japaneseData';
import { playSuccessSound, playWrongSound, playCheckSound, speakJapanese } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface GrammarTabProps {
  speechSpeed: number;
}

export const GrammarTab: React.FC<GrammarTabProps> = ({ speechSpeed }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const currentQuestion = EXISTENCE_QUIZ_DATA[currentIdx];

  const handleSelect = (choice: 'あります' | 'います') => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(choice);
    const correct = choice === currentQuestion.correct;
    setIsCorrect(correct);
    setAnsweredCount((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 1);
      playSuccessSound();
      speakJapanese(choice, speechSpeed);
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentIdx + 1 < EXISTENCE_QUIZ_DATA.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setGameFinished(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setAnsweredCount(0);
    setGameFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-amber-600/10">
        <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
          교과서 まめ知識 (토막 지식) • 존재 표현
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          사물/식물은 あります, 사람/동물은 います!
        </h2>
        <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
          일본어에서는 대상의 생명과 자발적 움직임에 따라 존재를 나타내는 동사가 달라집니다.
          규칙을 배우고 즉석 분류 퀴즈로 완전히 내 것으로 만들어보세요!
        </p>
      </div>

      {/* Grammar Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* あります Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              사물 & 식물
            </span>
            <button
              onClick={() => speakJapanese('あります', speechSpeed)}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-sans">
              あります
            </div>
            <p className="text-xs text-gray-500 font-semibold">[아리마스] / 기본형: ある</p>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-3 text-xs sm:text-sm text-emerald-950 space-y-1.5 border border-emerald-100">
            <p className="font-bold">🌱 적용 대상:</p>
            <ul className="list-disc list-inside space-y-0.5 text-emerald-900">
              <li>스스로 움직이지 못하는 모든 사물 (스니커즈, 가방, 휴대폰 등)</li>
              <li>식물 및 나무, 꽃 (생명이 있지만 움직이지 않음)</li>
            </ul>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <strong>교과서 예문:</strong> スニーカー <strong>あります</strong>か。(스니커즈 있습니까?)
          </div>
        </div>

        {/* います Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-orange-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
              사람 & 동물
            </span>
            <button
              onClick={() => speakJapanese('います', speechSpeed)}
              className="p-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-orange-800 font-sans">
              います
            </div>
            <p className="text-xs text-gray-500 font-semibold">[이마스] / 기본형: いる</p>
          </div>

          <div className="bg-orange-50/70 rounded-2xl p-3 text-xs sm:text-sm text-orange-950 space-y-1.5 border border-orange-100">
            <p className="font-bold">🐾 적용 대상:</p>
            <ul className="list-disc list-inside space-y-0.5 text-orange-900">
              <li>스스로 생각하고 움직이는 사람 (친구, 선생님, 손님 등)</li>
              <li>동물 및 곤충 (강아지, 고양이, 새 등)</li>
            </ul>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <strong>대표 예문:</strong> いぬが <strong>います</strong>。(개가 있습니다.)
          </div>
        </div>
      </div>

      {/* Interactive Mini Classifier Game */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              실전 판별 챌린지: あります 일까? います 일까?
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
            {currentIdx + 1} / {EXISTENCE_QUIZ_DATA.length} 문제
          </span>
        </div>

        {!gameFinished ? (
          <div className="space-y-6">
            {/* Target Item Display */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <span className="text-xs font-bold text-gray-400 block mb-1">
                다음 대상에는 어느 쪽을 써야 할까요?
              </span>
              <div className="text-2xl sm:text-3xl font-black text-gray-900">
                {currentQuestion.item}
              </div>
            </div>

            {/* Choice Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSelect('あります')}
                disabled={selectedAnswer !== null}
                className={`py-4 px-4 rounded-2xl text-lg sm:text-xl font-black border-2 transition-all ${
                  selectedAnswer === 'あります'
                    ? isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-4 ring-emerald-200'
                      : 'bg-red-500 text-white border-red-600'
                    : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-800 hover:shadow-md'
                }`}
              >
                <div>あります</div>
                <div className="text-xs font-medium opacity-80 mt-0.5">(사물·식물)</div>
              </button>

              <button
                onClick={() => handleSelect('います')}
                disabled={selectedAnswer !== null}
                className={`py-4 px-4 rounded-2xl text-lg sm:text-xl font-black border-2 transition-all ${
                  selectedAnswer === 'います'
                    ? isCorrect
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md ring-4 ring-orange-200'
                      : 'bg-red-500 text-white border-red-600'
                    : 'bg-white hover:bg-orange-50 border-orange-300 text-orange-800 hover:shadow-md'
                }`}
              >
                <div>います</div>
                <div className="text-xs font-medium opacity-80 mt-0.5">(사람·동물)</div>
              </button>
            </div>

            {/* Feedback & Explanation */}
            {selectedAnswer !== null && (
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-bold text-sm">
                      {isCorrect ? '정답입니다! 🎉' : `틀렸습니다! 정답은 [${currentQuestion.correct}] 입니다.`}
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 shadow-sm"
                  >
                    다음 문제 →
                  </button>
                </div>
                <p className="text-xs mt-1.5 opacity-90">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          /* Game Result Screen */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-gray-900">챌린지 완료!</h4>
            <p className="text-sm text-gray-600">
              총 {EXISTENCE_QUIZ_DATA.length}문제 중 <strong>{score}</strong>문제를 맞혔습니다!
            </p>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 도전하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
