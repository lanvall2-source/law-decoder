import type { Metadata } from "next";
import { TermSearchClient } from "@/components/terms/TermSearchClient";
import { AdSlot } from "@/components/common/AdSlot";

export const metadata: Metadata = {
  title: "법제처 법률용어 쉬운 3줄 번역기",
  description:
    "대항력, 확정일자, 기한이익상실, 포괄임금제, 위약벌 등 어려운 법령 및 계약서 용어를 법제처 공식 원문과 쉬운 3줄 요약으로 번역해 드립니다.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          법제처 법률용어 쉬운 번역기
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          법제처 법령용어 API 공식 정의와 초등학생도 이해할 수 있는 3줄 요약, 계약서 실전 예시를 함께 확인하세요.
        </p>
      </div>
      <AdSlot slotId="terms-top-banner" format="banner" />
      <TermSearchClient />
    </div>
  );
}
