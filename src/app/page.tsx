import Link from "next/link";
import {
  FileSearch,
  BookOpen,
  FileText,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { CURATED_TERMS } from "@/data/terms";
import { GUIDE_ARTICLES } from "@/data/guides";
import { AdSlot } from "@/components/common/AdSlot";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl bg-[#0F172A] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>회원가입 없는 Zero-Login AI 생활법률 해독기</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
            어려운 계약서 특약과 독소조항,
            <br />
            <span className="text-amber-400">사인하기 전에 10초 만에</span> 해독하세요
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            전세·월세 임대차계약서, 사회초년생 근로계약서의 불리한 조항을 AI가 짚어내고 방어용 수정 특약까지 제안합니다. 법제처 공식 용어 쉬운 번역과 셀프 민사 소장 초안 작성까지 한 번에 이용하세요.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-colors shadow-sm"
            >
              <FileSearch className="w-4 h-4" />
              <span>계약서 무료 검토 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lawsuit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>셀프 소장 초안 작성</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4대 핵심 모듈 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/review"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700">
              1. AI 계약서·특약 독소조항 해독기
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              전세·월세 특약이나 근로계약서 문구를 붙여넣으면 위험도 신호등(안전/주의/위험)과 대체 수정 문구를 즉시 제안합니다.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>지금 바로 검토하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/terms"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700">
              2. 법제처 법률용어 쉬운 3줄 번역기
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              대항력, 확정일자, 기한이익상실, 포괄임금제 등 어려운 법령 용어를 초등학생도 이해하는 3줄 요약과 실전 예시로 풀어드립니다.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-amber-700 flex items-center gap-1">
            <span>용어 검색·번역하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/lawsuit"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-rose-700">
              3. 민사 소장·내용증명 셀프 작성 도우미
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              보증금 미반환, 임금체불, 대여금 사건의 사실관계를 단계별로 입력하면 [청구취지·청구원인·입증방법] 초안을 구조화합니다.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-rose-700 flex items-center gap-1">
            <span>소장 초안 구조화하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/guides"
          className="group rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#0F172A] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700">
              4. 상황별 계약 전 필수 체크 가이드
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              전세 계약 전 필수 확인 5가지, 사회초년생 근로계약서 체크리스트 등 실전 분쟁 예방법을 한눈에 확인하세요.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>가이드 전체 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </section>

      <AdSlot slotId="home-mid-banner" format="banner" />

      {/* 자주 찾는 필수 법률 용어 (pSEO 내부 링크 허브) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              자주 검색되는 필수 계약·법률 용어
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              클릭하면 법제처 공식 정의와 쉬운 3줄 요약을 바로 확인할 수 있습니다.
            </p>
          </div>
          <Link href="/terms" className="text-xs font-bold text-slate-700 hover:text-slate-900">
            전체보기 →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {CURATED_TERMS.map((t) => (
            <Link
              key={t.slug}
              href={`/terms/${t.slug}`}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#0F172A] hover:text-white border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              # {t.term}
            </Link>
          ))}
        </div>
      </section>

      {/* 실전 가이드 허브 미리보기 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            계약 전 반드시 읽어야 할 핵심 가이드
          </h2>
          <Link href="/guides" className="text-xs font-bold text-slate-700 hover:text-slate-900">
            더 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GUIDE_ARTICLES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-slate-400 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {g.category}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">{g.description}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
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
          <p className="font-bold text-slate-900">회원가입·개인정보 수집 없는 안심 사용</p>
          <p>
            검토한 계약서 내역, 저장한 용어, 작성 중인 소장 초안은 외부 서버에 영구 저장되지 않고 사용자 기기의 브라우저(`LocalStorage`)에만 임시 보관됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}
