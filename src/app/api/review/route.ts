import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateMockContractReview } from "@/data/samples";
import type { ContractCategory, ContractReviewResult } from "@/types/legal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category: ContractCategory = body.category || "lease";
    const text: string = (body.text || "").trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "검토할 계약서 또는 특약 내용을 10자 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `당신은 대한민국의 민사·임대차·근로기준법 전문 법률 정보 분석 AI입니다.
사용자가 입력한 [${category === "lease" ? "전세·월세 계약서" : category === "labor" ? "근로계약서·약관" : "일반 계약서"}] 조항을 분석하여 독소조항과 분쟁 소지를 점검하세요.
단, 변호사법 제109조 위반을 피하기 위해 단정적 법률 자문 대신 '참고용 정보 분석 및 방어 문구 제안' 어조를 유지하세요.

입력 계약 내용:
"""
${text.slice(0, 4000)}
"""

반드시 아래 JSON 스키마로만 응답하세요:
{
  "overallRisk": "safe" | "caution" | "danger",
  "riskScore": 0~100 사이 정수,
  "summary": "전체 검토 요약 (2~3문장)",
  "clauses": [
    {
      "id": "c-1",
      "originalClause": "문제가 되거나 핵심인 원문 문구",
      "riskLevel": "safe" | "caution" | "danger",
      "title": "이슈 제목",
      "reason": "분쟁 소지 및 불리한 이유 (관련 법령 기준 언급)",
      "suggestedRevision": "임차인·근로자·을이 방어할 수 있는 대체 수정 특약 문구",
      "relatedTerms": ["대항력", "원상복구" 등 관련 핵심 법률용어 최대 3개]
    }
  ],
  "actionChecklist": ["서명 전 확인해야 할 행동 지침 3가지"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const rawJson = response.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const result: ContractReviewResult = {
            id: `rev-${Date.now()}`,
            category,
            createdAt: new Date().toISOString(),
            overallRisk: parsed.overallRisk || "caution",
            riskScore: typeof parsed.riskScore === "number" ? parsed.riskScore : 50,
            summary: parsed.summary || "계약서 검토 분석이 완료되었습니다.",
            clauses: Array.isArray(parsed.clauses) ? parsed.clauses : [],
            actionChecklist: Array.isArray(parsed.actionChecklist) ? parsed.actionChecklist : [],
            source: "ai",
          };
          return NextResponse.json(result);
        }
      } catch (aiErr) {
        console.error("[Gemini Review Error] Falling back to mock:", aiErr);
      }
    }

    // API 키가 없거나 오류 시 정교한 Mock 폴백 제공
    const mockResult = generateMockContractReview(category, text);
    return NextResponse.json(mockResult);
  } catch {
    return NextResponse.json(
      { error: "요청을 처리하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
