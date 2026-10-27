import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { TEXTBOOK_PAGES } from '../../data/japaneseData';

interface TextbookViewerTabProps {
  onNavigateTab: (tabId: string) => void;
}

export const TextbookViewerTab: React.FC<TextbookViewerTabProps> = ({ onNavigateTab }) => {
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentPage = TEXTBOOK_PAGES[selectedPageIdx];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const getPageNavigationAction = (idx: number) => {
    switch (idx) {
      case 0:
        return { label: '단어 학습하러 가기', tab: 'vocab' };
      case 1:
        return { label: '핵심 표현 학습하러 가기', tab: 'expressions' };
      case 2:
        return { label: '대화문 롤플레잉 하러 가기', tab: 'roleplay' };
      case 3:
        return { label: '패턴 교체 연습하러 가기', tab: 'patterns' };
      default:
        return { label: '학습하러 가기', tab: 'vocab' };
    }
  };

  const navAction = getPageNavigationAction(selectedPageIdx);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-700 to-gray-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-xs text-xs font-bold px-3 py-1 rounded-full mb-2">
              교과서 원본 스캔본 뷰어
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              실제 교과서 페이지 확인 & 복습
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
              업로드해주신 일본어 교과서 원본 페이지입니다. 원본 레이아웃을 확인하며 언제든 바로 해당 파트의 인터랙티브 암기 연습으로 이동할 수 있습니다.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab(navAction.tab)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start md:self-auto"
          >
            <span>{navAction.label}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TEXTBOOK_PAGES.map((page, idx) => {
          const isSelected = idx === selectedPageIdx;
          return (
            <button
              key={page.id}
              onClick={() => {
                setSelectedPageIdx(idx);
                setZoomLevel(1);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-100 font-bold'
                  : 'bg-white/80 border-gray-200 hover:border-emerald-300 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Page {idx + 1}
                </span>
                <Layers className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="text-xs font-bold text-gray-900 truncate">{page.title}</div>
              <div className="text-[10px] text-gray-500 truncate mt-0.5">{page.subTitle}</div>
            </button>
          );
        })}
      </div>

      {/* Viewer Window */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        {/* Controls Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 flex-wrap">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              {currentPage.title} - {currentPage.subTitle}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-white transition-colors"
              title="축소"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gray-700 px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-white transition-colors"
              title="확대"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-white transition-colors"
              title="배율 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Canvas with Scroll */}
        <div className="overflow-auto max-h-[750px] rounded-2xl bg-gray-50 flex items-center justify-center p-4 border border-gray-200/80">
          <img
            src={currentPage.imagePath}
            alt={currentPage.title}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            className="max-w-full h-auto rounded-xl shadow-lg transition-transform duration-200 object-contain"
          />
        </div>
      </div>
    </div>
  );
};
