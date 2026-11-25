import type {
  ContractCategory,
  ContractReviewResult,
  ContractClauseRisk,
  LawsuitDraftInput,
  LawsuitDraftOutput,
} from "@/types/legal";

export const SAMPLE_CONTRACTS: Record<
  ContractCategory,
  { label: string; text: string }
> = {
  lease: {
    label: "전세 독소조항 샘플",
    text: `[임대차계약 특약사항]
1. 임차인은 퇴거 시 집안의 모든 벽지, 장판, 옵션 가전 등 일체의 시설을 입주 당시 상태 그대로 완벽히 원상복구하여야 하며, 미이행 시 임대인이 임의로 수리비를 공제한 후 보증금을 반환한다.
2. 임대인의 자금 사정 또는 주택 매매 시 임대차 기간 중이라도 임대인의 통보로 계약을 해지할 수 있다.
3. 보일러, 배관 등 주요 설비의 노후로 인한 고장 및 수리 비용은 거주 중인 임차인이 전액 부담한다.
4. 임차인이 월세를 1일이라도 연체할 경우 즉시 기한이익상실로 보아 계약을 해지하고 퇴거한다.`,
  },
  labor: {
    label: "근로계약서 불공정 조항 샘플",
    text: `[표준 근로계약서 주요 조항]
제4조(임금) 월 급여는 세전 250만원으로 하며, 여기에는 연장근로·야간근로·휴일근로 수당이 모두 포함된 포괄임금제로 산정한다.
제5조(수습기간) 입사일로부터 6개월간 수습기간을 두며, 본 계약 기간이 6개월인 경우에도 수습기간 중에는 약정 급여의 80%만 지급한다.
제8조(손해배상 및 위약벌) 근로자가 사직 30일 전에 사전 통보 없이 퇴사하거나 무단결근할 경우, 회사의 실제 손해와 별개로 위약벌 금 200만원을 즉시 배상하여야 한다.`,
  },
  general: {
    label: "일반 용역·거래 계약서 샘플",
    text: `[프리랜서 외주 용역계약서]
제5조(납품 및 지체상금) 을(수급인)이 약정된 기한 내에 결과물을 납품하지 못할 경우, 발주자(갑)의 피드백 지연 여부와 무관하게 지체 1일당 총 계약대금의 2%에 해당하는 지체상금을 한도 없이 지급한다.
제9조(저작권 및 해지) 계약 체결 후 갑의 단순 변심으로 계약을 중도 해지하더라도 갑은 이미 진행된 작업물에 대한 대금을 지급하지 않으며, 모든 중간 산출물의 권리는 갑에게 귀속된다.`,
  },
};

export function generateMockContractReview(
  category: ContractCategory,
  text: string
): ContractReviewResult {
  const clauses: ContractClauseRisk[] = [];

  if (text.includes("원상복구") || text.includes("수리비")) {
    clauses.push({
      id: "c-restoration",
      originalClause:
        "임차인은 퇴거 시 일체의 시설을 완벽히 원상복구하여야 하며, 임대인이 임의로 수리비를 공제한다.",
      riskLevel: "danger",
      title: "과도한 원상복구 의무 및 임의 공제 조항",
      reason:
        "시간 경과에 따른 통상적 손모(자연 마모)까지 임차인에게 전가하고, 객관적 견적 없이 임대인이 일방적으로 보증금을 공제할 수 있어 분쟁 소지가 매우 높습니다.",
      suggestedRevision:
        "임차인의 고의 또는 중대한 과실로 인한 파손에 한하여 원상복구하며, 통상적인 사용에 따른 자연 마모 및 노후는 제외한다. 수리비 공제 시 객관적인 수리 견적서를 사전 협의한다.",
      relatedTerms: ["원상복구", "대항력"],
    });
  }

  if (text.includes("보일러") || text.includes("수리 비용") || text.includes("노후")) {
    clauses.push({
      id: "c-repair",
      originalClause:
        "보일러, 배관 등 주요 설비의 노후로 인한 고장 및 수리 비용은 임차인이 전액 부담한다.",
      riskLevel: "danger",
      title: "임대인 수선의무 부당 전가 조항",
      reason:
        "민법 제623조상 보일러, 상하수도 배관 등 건물의 주요 설비 노후 수선은 임대인의 고유 의무입니다. 이를 세입자에게 전가하는 특약은 매우 불리합니다.",
      suggestedRevision:
        "보일러, 배관, 누수 등 주요 설비의 노후·자연 고장에 대한 수선 비용은 임대인이 부담하며, 소모품(전구, 건전지 등) 교체만 임차인이 부담한다.",
      relatedTerms: ["원상복구"],
    });
  }

  if (text.includes("1일") || text.includes("기한이익상실") || text.includes("매매 시")) {
    clauses.push({
      id: "c-termination",
      originalClause:
        "임대인의 통보로 중도 해지하거나 1일 연체 시 기한이익상실로 즉시 퇴거한다.",
      riskLevel: "danger",
      title: "임대인 일방 해지 및 2기 미만 연체 해지 조항",
      reason:
        "주택임대차보호법상 임차인의 거주 기간(최소 2년)은 법으로 보장되며, 차임 연체 해지도 2기(2달 치) 이상 연체 시에만 가능합니다. 강행법규에 반해 임차인에게 불리한 약정은 무효 소지가 큽니다.",
      suggestedRevision:
        "주택임대차보호법 제4조 및 민법 제640조에 따라 임대차 기간을 보장하며, 임차인이 2기 이상의 차임을 연체한 경우에 한해 해지할 수 있다. 또한 대항력·확정일자 효력을 보장한다.",
      relatedTerms: ["기한이익상실", "대항력", "확정일자"],
    });
  }

  if (text.includes("포괄임금")) {
    clauses.push({
      id: "c-wage",
      originalClause:
        "연장·야간·휴일근로 수당이 모두 포함된 포괄임금제로 산정한다.",
      riskLevel: "caution",
      title: "시간 산정 불명확 포괄임금제 조항",
      reason:
        "근로시간 측정이 가능한 일반 직종에 구체적 고정 연장시간 명시 없이 포괄임금제를 적용하면, 실제 초과근로 수당 미지급 및 최저임금 위반 분쟁이 빈번히 발생합니다.",
      suggestedRevision:
        "기본급(주 40시간 기준)과 월 고정 연장근로시간(예: 월 15시간)에 해당하는 수당을 항목별로 명확히 구분하여 기재하고, 초과 근무 시 별도 가산수당을 지급한다.",
      relatedTerms: ["포괄임금제"],
    });
  }

  if (text.includes("수습기간") && (text.includes("80%") || text.includes("6개월"))) {
    clauses.push({
      id: "c-probation",
      originalClause:
        "계약 기간이 6개월인 경우에도 수습기간 중 약정 급여의 80%만 지급한다.",
      riskLevel: "danger",
      title: "최저임금법 위반 소지가 있는 수습 감액 조항",
      reason:
        "수습기간 급여 감액(최저임금의 최대 90%까지, 최대 3개월)은 근로계약 기간이 '1년 이상'인 경우에만 허용됩니다. 1년 미만 계약이나 80% 감액은 위법 소지가 높습니다.",
      suggestedRevision:
        "수습기간은 최대 3개월 이내로 두며, 1년 이상 근로계약 체결 시에 한해 최저임금법 기준(90% 이상)을 준수하여 지급한다.",
      relatedTerms: ["수습기간"],
    });
  }

  if (text.includes("위약벌") || text.includes("배상하여야")) {
    clauses.push({
      id: "c-penalty",
      originalClause:
        "사전 통보 없이 퇴사 시 실제 손해와 별개로 위약벌 금 200만원을 배상한다.",
      riskLevel: "danger",
      title: "근로기준법 제20조 위반(위약 예정 금지) 조항",
      reason:
        "근로기준법 제20조는 근로계약 불이행에 대한 위약금 또는 손해배상액을 미리 정하는 계약을 엄격히 금지하고 있습니다. 위약벌 조항 역시 강행규정 위반으로 무효일 가능성이 높습니다.",
      suggestedRevision:
        "해당 위약벌·손해배상 예정 조항은 전면 삭제하고, '퇴사 시 원활한 업무 인수인계를 위해 14~30일 전 사직 의사를 통보하도록 노력한다'는 선언적 문구로 대체한다.",
      relatedTerms: ["위약벌"],
    });
  }

  if (text.includes("지체상금") || text.includes("한도 없이")) {
    clauses.push({
      id: "c-delay",
      originalClause:
        "갑의 피드백 지연과 무관하게 지체 1일당 총 대금의 2% 지체상금을 한도 없이 지급한다.",
      riskLevel: "danger",
      title: "과다 지체상금 및 발주자 귀책 면책 조항",
      reason:
        "통상적인 용역 지체상금은 일 0.1~0.3%(상한 10%) 수준입니다. 일 2% 및 상한 없음은 일한 대가보다 벌금이 커지는 치명적 독소조항입니다.",
      suggestedRevision:
        "을의 귀책사유로 인한 지체에 한하여 지체 1일당 계약금액의 0.1%(최대 10% 한도)로 하며, 갑의 자료 제공·검수 지연 기간은 지체일수에서 제외한다.",
      relatedTerms: ["지체상금", "위약벌"],
    });
  }

  if (clauses.length === 0) {
    clauses.push({
      id: "c-general-safe",
      originalClause: text.slice(0, 120) + (text.length > 120 ? "..." : ""),
      riskLevel: "caution",
      title: "핵심 권리·해지 조건 추가 점검 권장",
      reason:
        "입력하신 문구에서 즉각적인 고위험 키워드는 발견되지 않았으나, 계약 해지 사유, 지급 기한, 분쟁 발생 시 관할 법원 조항이 누락되지 않았는지 확인이 필요합니다.",
      suggestedRevision:
        "계약 금액, 지급 기한, 계약 해지 시 환불·정산 기준, 그리고 상대방 귀책사유 시 손해배상 책임을 명확한 숫자와 날짜로 기재해 두세요.",
      relatedTerms: category === "lease" ? ["대항력", "확정일자"] : category === "labor" ? ["포괄임금제", "수습기간"] : ["기한이익상실"],
    });
  }

  const hasDanger = clauses.some((c) => c.riskLevel === "danger");
  const overallRisk = hasDanger ? "danger" : clauses.some((c) => c.riskLevel === "caution") ? "caution" : "safe";
  const riskScore = hasDanger ? 82 : overallRisk === "caution" ? 45 : 15;

  return {
    id: `rev-${Date.now()}`,
    category,
    createdAt: new Date().toISOString(),
    overallRisk,
    riskScore,
    summary: hasDanger
      ? `총 ${clauses.length}건의 조항 중 법정 기준을 위반하거나 일방적으로 불리한 고위험 독소조항이 탐지되었습니다. 서명 전 아래 수정 제안 문구로 협의를 권장합니다.`
      : "전반적으로 치명적인 독소조항은 적으나, 세부 기준과 권리 보호 문구를 명확히 보완하는 것이 안전합니다.",
    clauses,
    actionChecklist:
      category === "lease"
        ? [
            "계약 당일 등기부등본 을구(근저당권) 및 임대인 세금 완납 여부 재확인",
            "수정 제안 특약을 계약서 특약란에 직접 타이핑 또는 자필 기재",
            "잔금 지급 당일 전입신고(대항력)와 확정일자 동시 발급",
          ]
        : category === "labor"
        ? [
            "기본급과 각종 수당의 산정 기준(시간/금액) 명확화 요청",
            "서명 직후 근로계약서 교부본(사본 1부) 반드시 수령",
            "출퇴근 시간 기록 및 업무 지시 내역 개인 보관",
          ]
        : [
            "대금 지급 기한과 지체상금 상한선(10% 이내) 명시",
            "상대방 귀책사유에 따른 중도 해지 시 기성고(진행분) 정산 조항 추가",
            "구두 합의 사항은 반드시 문자·이메일 등 서면 기록 남기기",
          ],
    source: "mock",
  };
}

export function generateMockLawsuitDraft(input: LawsuitDraftInput): LawsuitDraftOutput {
  const caseTitles: Record<LawsuitDraftInput["caseType"], string> = {
    deposit: "임대차보증금 반환 청구의 소 (초안)",
    wage: "임금(퇴직금) 등 청구의 소 (초안)",
    loan: "대여금 반환 청구의 소 (초안)",
    goods: "물품(용역) 대금 청구의 소 (초안)",
    other: "손해배상(부당이득) 청구의 소 (초안)",
  };

  const amount = input.claimAmount.trim() || "금 OOO원";
  const plaintiff = input.plaintiffName.trim() || "원고(성명 미기재)";
  const defendant = input.defendantName.trim() || "피고(성명 미기재)";
  const dateText = input.incidentDate.trim() || "2026년 OO월 OO일";

  const claimPurpose = `1. 피고(${defendant})는 원고(${plaintiff})에게 ${amount} 및 이에 대하여 이 사건 소장 부본 송달 다음 날부터 다 갚는 날까지 연 12%의 비율로 계산한 돈을 지급하라.
2. 소송비용은 피고가 부담한다.
3. 제1항은 가집행할 수 있다.
라는 판결을 구합니다.`;

  const claimCause = `[1. 당사자 관계 및 사건 개요]
원고는 ${dateText}경 피고와 관련하여 본건 법률관계(${caseTitles[input.caseType].replace(" (초안)", "")})를 체결하였습니다.

[2. 구체적 사실관계]
${input.factsChronology.trim() || "(입력하신 시간순 사실관계가 이곳에 정리됩니다.)"}

[3. 피고의 이행 지체 및 원고의 청구]
그럼에도 불구하고 피고는 약정된 기한이 도과한 현재까지 원고에게 지급하여야 할 ${amount}을 정당한 사유 없이 지급하지 않고 있습니다. 이에 원고는 피고로부터 위 금원 및 소송촉진 등에 관한 특례법에서 정한 연 12%의 지연손해금을 지급받기 위하여 이 사건 소를 제기하기에 이르렀습니다.`;

  const evidenceMap: Record<LawsuitDraftInput["caseType"], string[]> = {
    deposit: [
      "갑 제1호증: 임대차계약서 사본 (확정일자 날인 포함)",
      "갑 제2호증: 보증금 이체확인증 (계좌이체 내역)",
      "갑 제3호증: 계약 해지 통보 내용증명 또는 문자·카톡 내역",
      "갑 제4호증: 주민등록초본(전입신고 내역) 및 부동산 등기부등본",
    ],
    wage: [
      "갑 제1호증: 근로계약서 사본",
      "갑 제2호증: 급여명세서 및 급여 통장 입금 내역서",
      "갑 제3호증: 출퇴근 기록, 업무 지시 카톡·이메일 내역",
      "갑 제4호증: 관할 노동청 체불임금 등 사업주 확인서 (발급 시)",
    ],
    loan: [
      "갑 제1호증: 차용증 또는 금전소비대차계약서 (있는 경우)",
      "갑 제2호증: 대여금 계좌이체 내역서 (은행 발급)",
      "갑 제3호증: 변제 독촉 및 피고가 채무를 인정한 문자·카톡·녹취록",
    ],
    goods: [
      "갑 제1호증: 물품공급계약서 또는 용역계약서·견적서",
      "갑 제2호증: 세금계산서 및 거래명세서",
      "갑 제3호증: 납품 완료 확인서 또는 검수 완료 이메일·메시지",
    ],
    other: [
      "갑 제1호증: 당사자 간 체결한 계약서·약정서 일체",
      "갑 제2호증: 피해 또는 대금 지급을 입증할 계좌이체 내역",
      "갑 제3호증: 상대방과의 협의·독촉 문자 및 내용증명 사본",
    ],
  };

  return {
    id: `law-${Date.now()}`,
    caseType: input.caseType,
    createdAt: new Date().toISOString(),
    title: caseTitles[input.caseType],
    claimPurpose,
    claimCause,
    evidenceChecklist: evidenceMap[input.caseType],
    noticeTips: [
      "실제 전자소송(ecfs.scourt.go.kr) 접수 전, 본 초안의 가명을 당사자 실명·주민등록번호(또는 주소)로 정확히 치환하세요.",
      "청구 금액이 3,000만 원 이하인 경우 소액사건으로 분류되어 비교적 신속하게 진행되며, 이행권고결정이 활용됩니다.",
      "소 제기 전 우체국 '내용증명'으로 마지막 변제 최고를 해두면 입증 자료(갑 호증)로 매우 유리합니다.",
    ],
    source: "mock",
  };
}
