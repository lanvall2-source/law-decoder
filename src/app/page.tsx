import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { CURATED_TERMS } from "@/data/terms";
import { GUIDE_ARTICLES } from "@/data/guides";
import { AdSlot } from "@/components/common/AdSlot";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-10 shadow-sm">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-snug break-keep">
            계약서 특약과 독소조항,
            <br />
            <span className="text-amber-400">서명 전에 미리</span> 점검하세요
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            전세·월세 임대차계약서와 근로계약서의 불리한 조항을 분석하고 대체 수정 특약을 제안합니다. 법제처 용어 번역과 민사 소장 초안 구조화도 로그인 없이 사용할 수 있습니다.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/review"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              계약서 검토 시작하기
            </Link>
            <Link
              href="/lawsuit"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-colors"
            >
              셀프 소장 초안 작성
            </Link>
          </div>
        </div>
      </section>

      {/* 4대 핵심 모듈 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/review"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] transition-colors flex flex-col justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
              AI 계약서·특약 독소조항 해독기
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              전세·월세 특약이나 근로계약서 문구를 붙여넣으면 위험도 신호등과 대체 수정 문구를 제안합니다.
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-blue-700">
            계약서 검토하기
          </div>
        </Link>

        <Link
          href="/terms"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] transition-colors flex flex-col justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700">
              법제처 법률용어 쉬운 3줄 번역기
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              대항력, 확정일자, 기한이익상실, 포괄임금제 등 법령 용어를 3줄 요약과 실전 예시로 설명합니다.
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-amber-700">
            용어 검색하기
          </div>
        </Link>

        <Link
          href="/lawsuit"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] transition-colors flex flex-col justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-rose-700">
              민사 소장·내용증명 셀프 작성 도우미
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              보증금 미반환, 임금체불, 대여금 사건의 사실관계를 입력하면 청구취지·청구원인·입증방법 초안을 구조화합니다.
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-rose-700">
            소장 초안 작성하기
          </div>
        </Link>

        <Link
          href="/guides"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] transition-colors flex flex-col justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
              상황별 계약 전 필수 체크 가이드
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              전세 계약 전 필수 확인 5가지, 사회초년생 근로계약서 체크리스트 등 분쟁 예방법을 확인하세요.
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-emerald-700">
            가이드 목록 보기
          </div>
        </Link>
      </section>

      <AdSlot slotId="home-mid-banner" format="banner" />

      {/* 자주 찾는 필수 법률 용어 (pSEO 내부 링크 허브) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              자주 검색되는 필수 계약·법률 용어
            </h2>
          </div>
          <Link href="/terms" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
            전체 용어 보기
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {CURATED_TERMS.map((t) => (
            <Link
              key={t.slug}
              href={`/terms/${t.slug}`}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#0F172A] hover:text-white border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              {t.term}
            </Link>
          ))}
        </div>
      </section>

      {/* 실전 가이드 허브 미리보기 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            계약 전 확인 가이드
          </h2>
          <Link href="/guides" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
            가이드 전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GUIDE_ARTICLES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-slate-400 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {g.category}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">{g.description}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>체크리스트 {g.checklist.length}개 포함</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Zero-Login 신뢰 안내 */}
      <section className="rounded-2xl bg-slate-100 border border-slate-200 p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">회원가입 없는 브라우저 로컬 저장</p>
          <p>
            검토한 계약서 내역, 저장한 용어, 작성 중인 소장 초안은 외부 서버에 영구 저장되지 않고 사용자 기기의 브라우저(LocalStorage)에만 임시 보관됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}
