import { ShieldAlert } from "lucide-react";

interface LegalDisclaimerProps {
  compact?: boolean;
}

export function LegalDisclaimer({ compact = false }: LegalDisclaimerProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-100/90 text-slate-600 ${
        compact ? "p-3 text-xs" : "p-4 text-xs sm:text-sm"
      } leading-relaxed`}
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-slate-800">법적 책임 한계 및 면책 고지: </strong>
          본 결과는 법제처 공개 데이터와 AI를 활용한 참고용 정보 및 문서 구조화 초안이며, 법적 효력이나 변호사의 전문 법률 자문을 대신하지 않습니다. 실제 소송·계약 체결 전 반드시 법률 전문가와 상담하세요.
        </p>
      </div>
    </div>
  );
}
