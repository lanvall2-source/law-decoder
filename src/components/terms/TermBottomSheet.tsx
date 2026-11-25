"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, BookOpen, ExternalLink, Loader2, Sparkles } from "lucide-react";
import type { LegalTerm } from "@/types/legal";

interface TermBottomSheetProps {
  termName: string | null;
  onClose: () => void;
}

export function TermBottomSheet({ termName, onClose }: TermBottomSheetProps) {
  const [loading, setLoading] = useState(false);
  const [termData, setTermData] = useState<LegalTerm | null>(null);

  useEffect(() => {
    if (!termName) return;
    let active = true;
    setLoading(true);
    fetch(`/api/terms?query=${encodeURIComponent(termName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const first = Array.isArray(data.terms) ? data.terms[0] : null;
        setTermData(first || null);
      })
      .catch(() => {
        if (active) setTermData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [termName]);

  if (!termName) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base">
              법률 용어 해설: {termName}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#0F172A]" />
              <span className="text-xs font-medium">법제처 용어 정의 및 AI 3줄 번역을 불러오는 중...</span>
            </div>
          ) : termData ? (
            <>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  법제처 법령용어 공식 원문
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {termData.officialDefinition}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>초등학생도 이해하는 AI 3줄 요약</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800 list-disc pl-4">
                  {termData.easySummary.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-3.5 text-xs text-slate-700">
                <strong className="text-blue-900 block mb-1">계약서 실전 예시</strong>
                {termData.contractExample}
              </div>

              {!termData.slug.startsWith("api-") && !termData.slug.startsWith("search-") && (
                <Link
                  href={`/terms/${termData.slug}`}
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  <span>상세 해설 페이지에서 더 보기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500 py-6 text-center">
              용어 정보를 불러오지 못했습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
