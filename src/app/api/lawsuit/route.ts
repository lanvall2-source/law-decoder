import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateMockLawsuitDraft } from "@/data/samples";
import type { LawsuitDraftInput, LawsuitDraftOutput } from "@/types/legal";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LawsuitDraftInput;

    if (!body.factsChronology || body.factsChronology.trim().length < 10) {
      return NextResponse.json(
        { error: "핵심 사실관계를 10자 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `당신은 대한민국 민사 소장 및 내용증명 문서 구조화를 돕는 AI 도우미입니다.
사용자가 입력한 정보를 바탕으로 법원 전자소송 양식 흐름에 맞춘 참고용 [청구취지 / 청구원인 / 입증방법 체크리스트] 초안을 생성하세요.
개인정보 보호를 위해 입력된 가명 그대로 작성하세요.

사건유형: ${body.caseType}
원고(가명): ${body.plaintiffName || "원고"}
피고(가명): ${body.defendantName || "피고"}
청구금액: ${body.claimAmount || "금 OOO원"}
발생일자: ${body.incidentDate || "미상"}
사실관계: ${body.factsChronology.slice(0, 3000)}

반드시 아래 JSON 스키마로만 응답하세요:
{
  "title": "사건명 (초안)",
  "claimPurpose": "청구취지 문구 (1, 2, 3항 포함)",
  "claimCause": "청구원인 문구 (당사자 관계, 구체적 사실관계, 지연손해금 청구 근거 포함)",
  "evidenceChecklist": ["갑 제1호증: ...", "갑 제2호증: ..."],
  "noticeTips": ["실제 접수 전 유의사항 3가지"]
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
          const result: LawsuitDraftOutput = {
            id: `law-${Date.now()}`,
            caseType: body.caseType,
            createdAt: new Date().toISOString(),
            title: parsed.title || "민사 소장 초안",
            claimPurpose: parsed.claimPurpose || "",
            claimCause: parsed.claimCause || "",
            evidenceChecklist: Array.isArray(parsed.evidenceChecklist) ? parsed.evidenceChecklist : [],
            noticeTips: Array.isArray(parsed.noticeTips) ? parsed.noticeTips : [],
            source: "ai",
          };
          return NextResponse.json(result);
        }
      } catch (aiErr) {
        console.error("[Gemini Lawsuit Error] Falling back to mock:", aiErr);
      }
    }

    const mockOutput = generateMockLawsuitDraft(body);
    return NextResponse.json(mockOutput);
  } catch {
    return NextResponse.json(
      { error: "소장 초안 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
