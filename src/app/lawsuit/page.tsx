import type { Metadata } from "next";
import { LawsuitBuilder } from "@/components/lawsuit/LawsuitBuilder";

export const metadata: Metadata = {
  title: "셀프 민사 소장·내용증명 초안 작성 도우미",
  description:
    "전세 보증금 미반환, 임금체불, 대여금 사건의 사실관계를 입력하면 법원 전자소송 양식에 맞춘 청구취지, 청구원인, 입증방법 초안을 무료로 구조화합니다.",
  alternates: {
    canonical: "/lawsuit",
  },
};

export default function LawsuitPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          민사 소장·내용증명 셀프 작성 도우미
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          단계별 폼에 사실관계를 입력하면 청구취지·청구원인·증거 체크리스트 초안을 구조화해 드립니다.
        </p>
      </div>
      <LawsuitBuilder />
    </div>
  );
}
