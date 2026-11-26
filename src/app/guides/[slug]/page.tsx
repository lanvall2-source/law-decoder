import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileSearch, ArrowRight } from "lucide-react";
import { GUIDE_ARTICLES, getGuideBySlug } from "@/data/guides";
import { AdSlot } from "@/components/common/AdSlot";
import { LegalDisclaimer } from "@/components/common/LegalDisclaimer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "가이드를 찾을 수 없습니다" };

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: "계약서·생활법률 해독기",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>가이드 목록으로 돌아가기</span>
      </Link>

      <header className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
            {guide.category}
          </span>
          <span className="text-slate-400">· {guide.readingTime}</span>
          <span className="text-slate-400">· 업데이트 {guide.updatedAt}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
          {guide.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">{guide.description}</p>
      </header>

      <AdSlot slotId="guide-detail-top" format="banner" />

      {/* 핵심 체크리스트 박스 */}
      <section className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <h2 className="text-base font-semibold text-emerald-950">
          핵심 체크리스트
        </h2>
        <ul className="space-y-2.5">
          {guide.checklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 본문 섹션 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {guide.sections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{sec.heading}</h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{sec.body}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      {guide.faqs.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-3">
            {guide.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">Q. {faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA to Main AI Review Tool */}
      <div className="rounded-2xl bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">지금 내 계약서 특약을 바로 점검해 보세요</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            가이드 내용과 비교해 독소조항이 없는지 AI가 무료로 해독해 드립니다.
          </p>
        </div>
        <Link
          href="/review"
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shrink-0 transition-colors"
        >
          <FileSearch className="w-4 h-4" />
          <span>AI 계약서 검토하러 가기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <LegalDisclaimer />
    </article>
  );
}
