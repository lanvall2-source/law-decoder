interface AdSlotProps {
  slotId?: string;
  format?: "banner" | "rectangle";
  label?: string;
}

export function AdSlot({
  slotId = "default-slot",
  format = "banner",
  label = "AD · 스폰서 배너 영역",
}: AdSlotProps) {
  const minHeightClass = format === "rectangle" ? "min-h-[250px]" : "min-h-[100px]";

  return (
    <aside
      aria-label="광고 영역"
      data-ad-slot={slotId}
      className={`print:hidden w-full ${minHeightClass} rounded-xl border border-dashed border-slate-300 bg-slate-50/80 flex flex-col items-center justify-center p-4 text-center`}
    >
      <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </span>
      <span className="text-[11px] text-slate-400 mt-1">
        CLS 레이아웃 시프트 방지 고정 높이 ({format === "rectangle" ? "250px+" : "100px+"})
      </span>
    </aside>
  );
}
