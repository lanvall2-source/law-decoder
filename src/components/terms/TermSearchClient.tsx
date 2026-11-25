"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bookmark, Sparkles, BookOpen, Loader2, ArrowRight } from "lucide-react";
import { CURATED_TERMS } from "@/data/terms";
import { useLegalStorage } from "@/lib/storage";
import type { LegalTerm } from "@/types/legal";

export function TermSearchClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalTerm[] | null>(null);
  const { savedTerms, toggleSaveTerm } = useLegalStorage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/terms?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data.terms) ? data.terms : []);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const displayList = searchResults !== null ? searchResults : CURATED_TERMS;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="궁금한 법률 용어를 입력하세요 (예: 대항력, 기한이익상실, 위약벌)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "검색"}
        </button>
      </form>

      {searchResults !== null && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>&apos;{query}&apos; 검색 결과 ({displayList.length}건)</span>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSearchResults(null);
            }}
            className="font-bold text-slate-700 hover:underline cursor-pointer"
          >
            전체 용어 목록 보기
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayList.map((item) => {
          const isSaved = savedTerms.includes(item.slug);
          const isStaticPage = !item.slug.startsWith("api-") && !item.slug.startsWith("search-");
          return (
            <div
              key={item.slug}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-1">
                      {item.category}
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      {item.term}{" "}
                      {item.hanja && (
                        <span className="text-xs font-normal text-slate-400">({item.hanja})</span>
                      )}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaveTerm(item.slug)}
                    aria-label="용어 저장"
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isSaved
                        ? "bg-amber-50 border-amber-300 text-amber-600"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* 법제처 공식 원문 */}
                <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed">
                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <BookOpen className="w-3 h-3" /> 법제처 공식 정의
                  </span>
                  {item.officialDefinition}
                </div>

                {/* 쉬운 3줄 요약 */}
                <div className="text-xs text-slate-800 bg-amber-50/60 rounded-xl p-3 border border-amber-200/70 space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-amber-600" /> 쉬운 3줄 번역
                  </span>
                  <ul className="list-disc pl-4 space-y-1">
                    {item.easySummary.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[65%]">{item.contractExample}</span>
                {isStaticPage && (
                  <Link
                    href={`/terms/${item.slug}`}
                    className="font-bold text-[#0F172A] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>상세보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
