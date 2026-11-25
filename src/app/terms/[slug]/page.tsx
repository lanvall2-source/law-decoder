import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Sparkles, AlertTriangle, ArrowLeft, FileSearch } from "lucide-react";
import { CURATED_TERMS, getTermBySlug } from "@/data/terms";
import { AdSlot } from "@/components/common/AdSlot";
import { LegalDisclaimer } from "@/components/common/LegalDisclaimer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURATED_TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) return { title: "용어를 찾을 수 없습니다" };

  return {
    title: `${term.term}${term.hanja ? `(${term.hanja})` : ""} 뜻과 계약서 실전 예시 - 쉬운 3줄 번역`,
    description: `${term.term}의 법제처 공식 정의와 초등학생도 이해하는 쉬운 3줄 요약: ${term.easySummary[0]}`,
    alternates: {
      canonical: `/terms/${term.slug}`,
    },
    openGraph: {
      title: `${term.term} 뜻과 계약서 주의사항 | 계약서·생활법률 해독기`,
      description: term.easySummary[0],
      type: "article",
    },
  };
}

export default async function TermDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: term.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <article className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Link
        href="/terms"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>전체 법률용어 사전으로 돌아가기</span>
      </Link>

      <header className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
          {term.category}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {term.term}{" "}
          {term.hanja && <span className="text-lg font-medium text-slate-400">({term.hanja})</span>}
        </h1>
        <p className="text-sm text-slate-600">
          계약서와 생활법률에서 자주 쓰이는 &lsquo;{term.term}&rsquo;의 법제처 공식 정의 및 실전 해설입니다.
        </p>
      </header>

      <AdSlot slotId="term-detail-top" format="banner" />

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4 text-[#0F172A]" />
            <span>법제처 법령용어 공식 원문</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {term.officialDefinition}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>초등학생도 이해하는 3줄 요약</span>
          </h2>
          <ul className="space-y-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-sm text-slate-800 list-disc pl-8">
            {term.easySummary.map((line, i) => (
              <li key={i} className="leading-relaxed">{line}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-1.5">
            <h3 className="text-xs font-extrabold text-blue-900">계약서 실전 적용 예시</h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {term.contractExample}
            </p>
          </div>
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 space-y-1.5">
            <h3 className="text-xs font-extrabold text-red-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> 꼭 확인해야 할 주의사항
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {term.precaution}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {term.faqs.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-3">
            {term.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Q. {faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA to Main Tool */}
      <div className="rounded-2xl bg-[#0F172A] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold">내 계약서에도 &lsquo;{term.term}&rsquo; 조항이 있나요?</h3>
          <p className="text-xs text-slate-300 mt-1">
            계약서 문구를 붙여넣으면 불리한 독소조항인지 AI가 무료로 점검해 드립니다.
          </p>
        </div>
        <Link
          href="/review"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 transition-colors"
        >
          <FileSearch className="w-4 h-4" />
          <span>계약서 무료 점검하기</span>
        </Link>
      </div>

      <LegalDisclaimer />
    </article>
  );
}
