import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Compass } from "lucide-react";
import { GUIDE_ARTICLES } from "@/data/guides";
import { AdSlot } from "@/components/common/AdSlot";

export const metadata: Metadata = {
  title: "전세·근로계약서 필수 체크리스트 가이드 허브",
  description:
    "전세 계약 전 필수 확인 5가지, 사회초년생 근로계약서 사인 전 체크리스트, 월세 원상복구 분쟁 예방법 등 실전 가이드를 확인하세요.",
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-3xl font-semibold text-slate-900 flex items-center gap-2 break-keep">
          <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 shrink-0" />
          <span>계약 전 필수 체크리스트 가이드</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          계약서에 도장을 찍기 전에 꼭 점검해야 할 상황별 핵심 체크리스트와 분쟁 예방법입니다.
        </p>
      </div>

      <AdSlot slotId="guides-top-banner" format="banner" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GUIDE_ARTICLES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#0F172A] hover:shadow-md transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {guide.category}
                </span>
                <span className="text-slate-400">{guide.readingTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 leading-snug">
                {guide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {guide.description}
              </p>
              <ul className="space-y-1.5 pt-2">
                {guide.checklist.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs font-bold text-[#0F172A] flex items-center gap-1">
              <span>체크리스트 전체 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
