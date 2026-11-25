"use client";

import { useState } from "react";
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  Loader2,
  History,
  BookOpen,
} from "lucide-react";
import type { ContractCategory, ContractReviewResult, RiskLevel } from "@/types/legal";
import { SAMPLE_CONTRACTS } from "@/data/samples";
import { useLegalStorage } from "@/lib/storage";
import { AdSlot } from "@/components/common/AdSlot";
import { LegalDisclaimer } from "@/components/common/LegalDisclaimer";
import { TermBottomSheet } from "@/components/terms/TermBottomSheet";

const CATEGORIES: { id: ContractCategory; label: string }[] = [
  { id: "lease", label: "전세·월세 계약서" },
  { id: "labor", label: "근로계약서·약관" },
  { id: "general", label: "일반 계약서" },
];

const RISK_BADGE: Record<
  RiskLevel,
  { label: string; bg: string; text: string; border: string }
> = {
  safe: {
    label: "안전 (양호)",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
  },
  caution: {
    label: "주의 (보완 권장)",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  danger: {
    label: "분쟁 소지 높음 (위험)",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-300",
  },
};

export function ContractReviewer() {
  const [category, setCategory] = useState<ContractCategory>("lease");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContractReviewResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const { recentReviews, addReview } = useLegalStorage();

  const handleAnalyze = async () => {
    if (text.trim().length < 10) {
      setError("계약서 특약이나 검토할 조항을 10자 이상 입력해 주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석 중 오류가 발생했습니다.");
      } else {
        setResult(data);
        addReview(data);
      }
    } catch {
      setError("네트워크 연결 상태를 확인한 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, copyStr: string) => {
    navigator.clipboard.writeText(copyStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 입력 카드 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                category === c.id
                  ? "bg-[#0F172A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="contract-input" className="text-xs font-bold text-slate-700">
            계약서 조항 또는 특약사항 붙여넣기
          </label>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE_CONTRACTS[category].text);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{SAMPLE_CONTRACTS[category].label} 채우기</span>
          </button>
        </div>

        <textarea
          id="contract-input"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 임차인은 퇴거 시 집안의 모든 벽지와 장판을 완벽히 원상복구한다..."
          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A] leading-relaxed"
        />

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3.5 px-5 rounded-xl bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI 독소조항·분쟁 소지 정밀 분석 중...</span>
            </>
          ) : (
            <>
              <FileSearch className="w-4 h-4 text-amber-400" />
              <span>독소조항 & 분쟁 소지 해독하기</span>
            </>
          )}
        </button>
      </div>

      {/* 로딩 시 광고 슬롯 (CLS 방지) */}
      {loading && (
        <div className="space-y-3">
          <AdSlot slotId="review-loading-slot" format="rectangle" label="AD · 분석 중 스폰서 안내" />
        </div>
      )}

      {/* 분석 결과 리포트 */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <LegalDisclaimer />

          <AdSlot slotId="review-result-top" format="banner" />

          {/* 종합 신호등 카드 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                    RISK_BADGE[result.overallRisk].bg
                  } ${RISK_BADGE[result.overallRisk].text} ${
                    RISK_BADGE[result.overallRisk].border
                  }`}
                >
                  {result.overallRisk === "danger" ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : result.overallRisk === "caution" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {RISK_BADGE[result.overallRisk].label}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  위험지수 {result.riskScore}점 / 100점
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {result.source === "ai" ? "Gemini AI 실시간 분석" : "표준 법률 규칙 엔진 분석"}
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* 조항별 상세 분석 & 수정 제안 */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">
              상세 조항 점검 및 방어용 수정 제안 ({result.clauses.length}건)
            </h2>
            {result.clauses.map((clause) => {
              const badge = RISK_BADGE[clause.riskLevel];
              return (
                <div
                  key={clause.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {clause.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* 원문 하이라이트 */}
                  <div className="rounded-xl bg-red-50/50 border border-red-200/70 p-3.5 text-xs sm:text-sm text-slate-800">
                    <span className="text-[10px] font-bold text-red-700 uppercase block mb-1">
                      검토 대상 조항
                    </span>
                    <p className="font-medium leading-relaxed">{clause.originalClause}</p>
                  </div>

                  {/* 분쟁 소지 이유 */}
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">왜 주의해야 하나요? </strong>
                    {clause.reason}
                  </div>

                  {/* 수정 제안 특약 */}
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-900">
                        ✅ 방어용 수정 제안 특약
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(clause.id, clause.suggestedRevision)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        {copiedId === clause.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>수정 문구 복사</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                      {clause.suggestedRevision}
                    </p>
                  </div>

                  {/* 문장 내 법률 용어 클릭 바텀시트 */}
                  {clause.relatedTerms && clause.relatedTerms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        용어 쉬운 번역:
                      </span>
                      {clause.relatedTerms.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSelectedTerm(term)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0F172A] hover:text-white text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {term} ?
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 행동 체크리스트 */}
          {result.actionChecklist.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                서명 전 최종 행동 체크리스트
              </h3>
              <ul className="space-y-2">
                {result.actionChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AdSlot slotId="review-result-bottom" format="banner" />
          <LegalDisclaimer />
        </div>
      )}

      {/* 최근 로컬 검토 내역 (LocalStorage) */}
      {recentReviews.length > 0 && !result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
            <History className="w-4 h-4 text-slate-500" />
            <span>이 브라우저에 임시 저장된 최근 검토 기록 ({recentReviews.length}건)</span>
          </div>
          <div className="space-y-2">
            {recentReviews.slice(0, 3).map((rev) => (
              <button
                key={rev.id}
                type="button"
                onClick={() => setResult(rev)}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-500">
                    {rev.category === "lease"
                      ? "전세·월세"
                      : rev.category === "labor"
                      ? "근로계약"
                      : "일반계약"}{" "}
                    · {new Date(rev.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">{rev.summary}</p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 shrink-0">다시 보기 →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <TermBottomSheet termName={selectedTerm} onClose={() => setSelectedTerm(null)} />
    </div>
  );
}
