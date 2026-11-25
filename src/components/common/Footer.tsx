import Link from "next/link";
import { LegalDisclaimer } from "./LegalDisclaimer";

export function Footer() {
  return (
    <footer className="print:hidden bg-white border-t border-slate-200 mt-12 pb-20 md:pb-10">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <LegalDisclaimer compact />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">계약서·생활법률 해독기</p>
            <p className="mt-1">회원가입 없이 브라우저(LocalStorage)에 안전하게 임시 저장되는 제로 로그인 서비스입니다.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-medium">
            <Link href="/review" className="hover:text-slate-900">계약서 해독기</Link>
            <Link href="/terms" className="hover:text-slate-900">법률용어 번역기</Link>
            <Link href="/lawsuit" className="hover:text-slate-900">셀프 소장 도우미</Link>
            <Link href="/guides" className="hover:text-slate-900">체크리스트 가이드</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
