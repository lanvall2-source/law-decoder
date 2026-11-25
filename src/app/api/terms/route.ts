import { NextRequest, NextResponse } from "next/server";
import { CURATED_TERMS } from "@/data/terms";
import type { LegalTerm } from "@/types/legal";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") || "").trim();
  const pageNo = Number(searchParams.get("pageNo") || "1");
  const numOfRows = Number(searchParams.get("numOfRows") || "10");

  if (!query) {
    return NextResponse.json({
      terms: CURATED_TERMS,
      total: CURATED_TERMS.length,
      source: "curated",
    });
  }

  // 1. 로컬 큐레이션 용어 우선 매칭
  const matchedCurated = CURATED_TERMS.filter(
    (t) =>
      t.term.includes(query) ||
      t.officialDefinition.includes(query) ||
      t.easySummary.some((line) => line.includes(query))
  );

  // 2. 법제처 법령용어 API (MinistryofLegislation_LawTerms_List) 연동
  const lawApiOc = process.env.LAW_API_OC; // 법제처 Open API OC (이메일 ID)
  if (lawApiOc) {
    try {
      const apiUrl = new URL("https://www.law.go.kr/DRF/lawSearch.do");
      apiUrl.searchParams.set("OC", lawApiOc);
      apiUrl.searchParams.set("target", "lstrm");
      apiUrl.searchParams.set("type", "JSON");
      apiUrl.searchParams.set("query", query);
      apiUrl.searchParams.set("page", String(pageNo));
      apiUrl.searchParams.set("display", String(numOfRows));

      const res = await fetch(apiUrl.toString(), {
        next: { revalidate: 86400 },
      });

      if (res.ok) {
        const data = await res.json();
        const rawList = data?.LstrmSearch?.lstrm;
        const list = Array.isArray(rawList) ? rawList : rawList ? [rawList] : [];

        const apiTerms: LegalTerm[] = list.map((item: Record<string, string>, idx: number) => {
          const termName = item["법령용어명_한글"] || item["법령용어명"] || query;
          const def = item["법령용어정의"] || "법제처 법령용어 사전 공식 등재 용어입니다.";
          const curatedMatch = CURATED_TERMS.find((c) => c.term === termName);

          return (
            curatedMatch || {
              slug: `api-${encodeURIComponent(termName)}-${idx}`,
              term: termName,
              hanja: item["법령용어명_한자"] || undefined,
              category: "민사·계약",
              officialDefinition: def,
              easySummary: [
                `'${termName}'은(는) 법령 및 계약서에서 권리와 의무를 규정할 때 쓰이는 공식 법률 용어입니다.`,
                def.length > 90 ? def.slice(0, 90) + "..." : def,
                "계약서에 해당 단어가 포함되어 있다면 정확한 적용 조건과 예외 사항을 반드시 확인하세요.",
              ],
              contractExample: `계약서 내 '${termName}' 관련 조항의 범위와 책임 주체를 명확히 기재하는 것이 좋습니다.`,
              precaution: "개별 계약의 특약 사항에 따라 법적 해석이 달라질 수 있으므로 문맥을 함께 확인하세요.",
              faqs: [
                {
                  question: `${termName}의 법적 의미는 무엇인가요?`,
                  answer: def,
                },
              ],
              source: "law-api",
            }
          );
        });

        if (apiTerms.length > 0) {
          return NextResponse.json({
            terms: apiTerms,
            total: apiTerms.length,
            source: "law-api",
          });
        }
      }
    } catch (err) {
      console.error("[Law API Error] Falling back to curated terms:", err);
    }
  }

  // 3. API 키가 없거나 API 결과가 비어있을 때 폴백
  if (matchedCurated.length > 0) {
    return NextResponse.json({
      terms: matchedCurated,
      total: matchedCurated.length,
      source: "curated",
    });
  }

  // 검색어에 대한 동적 간이 번역 폴백
  const fallbackTerm: LegalTerm = {
    slug: `search-${encodeURIComponent(query)}`,
    term: query,
    category: "민사·계약",
    officialDefinition: `'${query}'에 대한 법제처 오픈 API 실시간 조회(LAW_API_OC 미설정) 대신 제공되는 참고 안내입니다. 실전 계약서에서는 해당 조항이 당사자의 권리·의무를 일방적으로 제한하지 않는지 검토가 필요합니다.`,
    easySummary: [
      `'${query}'(은)는 계약 당사자 간의 권리·의무나 책임 범위를 정할 때 자주 등장하는 표현입니다.`,
      "법률 용어는 일상 단어와 의미가 다를 수 있으므로, 적용 조건과 예외 기준을 함께 읽어야 합니다.",
      "AI 계약서 해독기에서 전체 문장을 붙여넣으면 해당 단어가 포함된 조항의 유불리를 바로 점검해 드립니다.",
    ],
    contractExample: `예시: "'${query}'에 관한 구체적인 기준과 금액 한도는 쌍방 서면 합의에 따른다."`,
    precaution: "단어의 해석이 모호할 경우 분쟁이 발생하므로 구체적인 숫자와 기한으로 풀어서 적는 것이 안전합니다.",
    faqs: [
      {
        question: `계약서에 '${query}'라는 표현이 있으면 어떻게 확인하나요?`,
        answer: "메인 계약서 해독기 메뉴에 해당 조항 전체를 붙여넣으면 불리한 독소조항 여부를 분석해 드립니다.",
      },
    ],
    source: "curated",
  };

  return NextResponse.json({
    terms: [fallbackTerm],
    total: 1,
    source: "mock",
  });
}
