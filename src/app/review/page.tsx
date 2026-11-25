import type { Metadata } from "next";
import { ContractReviewer } from "@/components/review/ContractReviewer";

export const metadata: Metadata = {
  title: "전세·월세 & 근로계약서 독소조항 AI 해독기",
  description:
    "전세계약서 특약사항, 월세 원상복구 조항, 사회초년생 근로계약서 포괄임금·위약벌 조항을 AI가 10초 만에 분석하고 방어용 수정 문구를 제안합니다.",
  alternates: {
    canonical: "/review",
  },
};

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          계약서 독소조항 & 분쟁 소지 해독기
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          임대차 특약, 근로계약서 등 검토하고 싶은 문구를 붙여넣으면 불리한 조항을 찾아내고 수정 특약을 제안합니다.
        </p>
      </div>
      <ContractReviewer />
    </div>
  );
}
