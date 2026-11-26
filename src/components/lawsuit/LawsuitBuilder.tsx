"use client";

import { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import type { LawsuitCaseType, LawsuitDraftInput, LawsuitDraftOutput } from "@/types/legal";
import { useLegalStorage } from "@/lib/storage";
import { AdSlot } from "@/components/common/AdSlot";
import { LegalDisclaimer } from "@/components/common/LegalDisclaimer";

const CASE_TYPES: { id: LawsuitCaseType; label: string; desc: string }[] = [
  { id: "deposit", label: "보증금 반환", desc: "전세·월세 만기 후 집주인이 보증금을 안 돌려줄 때" },
  { id: "wage", label: "임금·퇴직금 체불", desc: "월급, 연장수당, 퇴직금을 제때 지급받지 못했을 때" },
  { id: "loan", label: "대여금 미반환", desc: "빌려준 돈을 약속 기일이 지나도 갚지 않을 때" },
  { id: "goods", label: "물품·용역 대금", desc: "납품·외주 작업 완료 후 대금을 정산받지 못했을 때" },
  { id: "other", label: "기타 손해배상", desc: "계약 위반·부당이득 등으로 금전 배상을 청구할 때" },
];

export function LawsuitBuilder() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<LawsuitDraftInput>({
    caseType: "deposit",
    plaintiffName: "홍길동(가명)",
    defendantName: "김철수(가명)",
    claimAmount: "금 50,000,000원",
    incidentDate: "2026년 10월 31일",
    factsChronology: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<LawsuitDraftOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const { lawsuitDrafts, addLawsuitDraft } = useLegalStorage();

  const handleGenerate = async () => {
    if (form.factsChronology.trim().length < 10) {
      setError("언제, 무슨 일이 있었는지 사실관계를 10자 이상 입력해 주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/lawsuit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "초안 생성에 실패했습니다.");
      } else {
        setOutput(data);
        addLawsuitDraft(data);
      }
    } catch {
      setError("네트워크 연결 상태를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const formatPlainText = (doc: LawsuitDraftOutput) => {
    return `[${doc.title}]

1. 청구취지
${doc.claimPurpose}

2. 청구원인
${doc.claimCause}

3. 입증방법 체크리스트
${doc.evidenceChecklist.map((e) => `- ${e}`).join("\n")}

[안내]
본 문서는 참고용 초안이며 법적 효력이나 전문 자문을 대신하지 않습니다.`;
  };

  const handleCopyAll = () => {
    if (!output) return;
    navigator.clipboard.writeText(formatPlainText(output));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!output) return;
    const blob = new Blob([formatPlainText(output)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `소장초안_${output.caseType}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Step-by-Step 입력 폼 */}
      {!output && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            {[
              { num: 1, title: "사건 유형" },
              { num: 2, title: "당사자 정보" },
              { num: 3, title: "청구금액·사실관계" },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as 1 | 2 | 3)}
                className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                  step === s.num ? "text-[#0F172A]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step === s.num
                      ? "bg-[#0F172A] text-white"
                      : step > s.num
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Step 1: 사건 유형 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900">
                1단계: 어떤 사건의 소장(또는 내용증명) 초안이 필요하신가요?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CASE_TYPES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm({ ...form, caseType: c.id })}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      form.caseType === c.id
                        ? "border-[#0F172A] bg-slate-50 ring-1 ring-[#0F172A]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-900">{c.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{c.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>다음 단계</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 당사자 정보 (가명 입력 안내) */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900">
                2단계: 당사자 정보 입력 (개인정보 보호)
              </h2>
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3.5 text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
                <span>
                  개인정보 보호를 위해 <strong>가명(예: 홍길동, 임대인 A)</strong>으로 입력한 뒤, 다운로드 후 실제 제출 시에만 본인의 실명과 주소를 기입하세요.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    원고 (청구하는 사람)
                  </label>
                  <input
                    type="text"
                    value={form.plaintiffName}
                    onChange={(e) => setForm({ ...form, plaintiffName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    피고 (상대방)
                  </label>
                  <input
                    type="text"
                    value={form.defendantName}
                    onChange={(e) => setForm({ ...form, defendantName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>이전</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>다음 단계</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 청구금액 및 사실관계 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900">
                3단계: 청구 금액 및 핵심 사실관계
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    청구 금액
                  </label>
                  <input
                    type="text"
                    value={form.claimAmount}
                    onChange={(e) => setForm({ ...form, claimAmount: e.target.value })}
                    placeholder="예: 금 50,000,000원"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    계약일 또는 사건 발생일
                  </label>
                  <input
                    type="text"
                    value={form.incidentDate}
                    onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
                    placeholder="예: 2026년 10월 31일"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    시간순 사실관계 메모
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        factsChronology:
                          "2024년 10월 31일 보증금 5,000만 원에 2년 임대차 계약을 체결하고 전입신고 및 확정일자를 받았습니다. 2026년 8월 계약 갱신 거절 의사를 문자로 명확히 통보하였으나, 만기일인 2026년 10월 31일이 지나도 임대인이 다음 세입자가 구해지지 않았다며 보증금을 돌려주지 않고 있습니다.",
                      })
                    }
                    className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer"
                  >
                    예시 문구 채우기
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={form.factsChronology}
                  onChange={(e) => setForm({ ...form, factsChronology: e.target.value })}
                  placeholder="언제 계약했고, 얼마를 지급했으며, 상대방이 언제부터 약속을 어겼는지 시간순으로 편하게 적어주세요."
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-sm leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>이전</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>소장 구조화 생성 중...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>소장 초안 구조화하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 생성된 소장 초안 결과 */}
      {output && (
        <div className="space-y-5 ">
          <LegalDisclaimer />

          <div className="print:hidden flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setOutput(null)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              다시 작성하기
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "전체 복사됨" : "전체 복사"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.txt 저장</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>인쇄 / PDF 저장</span>
              </button>
            </div>
          </div>

          <AdSlot slotId="lawsuit-result-top" format="banner" />

          {/* 법원 전자소송 양식 구조화 본문 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="text-center border-b border-slate-200 pb-4">
              <h2 className="text-xl font-semibold text-slate-900">{output.title}</h2>
              <p className="text-xs text-slate-500 mt-1">
                원고: {form.plaintiffName} / 피고: {form.defendantName}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#0F172A] bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                1. 청구취지
              </h3>
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                {output.claimPurpose}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#0F172A] bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                2. 청구원인
              </h3>
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                {output.claimCause}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#0F172A] bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                3. 입증방법 (제출 증거 체크리스트)
              </h3>
              <ul className="space-y-2 p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs sm:text-sm text-slate-800">
                {output.evidenceChecklist.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {output.noticeTips.length > 0 && (
              <div className="print:hidden rounded-xl bg-slate-100 p-4 space-y-1.5 text-xs text-slate-700">
                <strong className="text-slate-900 block">전자소송 접수 전 실전 팁</strong>
                <ul className="list-disc pl-4 space-y-1">
                  {output.noticeTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <LegalDisclaimer />
        </div>
      )}

      {lawsuitDrafts.length > 0 && !output && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <h3 className="text-xs font-semibold text-slate-600">
            임시 저장된 소장 초안 ({lawsuitDrafts.length}건)
          </h3>
          {lawsuitDrafts.slice(0, 3).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setOutput(d)}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex justify-between cursor-pointer"
            >
              <span>{d.title}</span>
              <span className="text-blue-700">불러오기</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
