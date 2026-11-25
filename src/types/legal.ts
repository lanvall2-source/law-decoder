export type ContractCategory = "lease" | "labor" | "general";

export type RiskLevel = "safe" | "caution" | "danger";

export interface ContractClauseRisk {
  id: string;
  originalClause: string;
  riskLevel: RiskLevel;
  title: string;
  reason: string;
  suggestedRevision: string;
  relatedTerms: string[]; // term slugs or keywords
}

export interface ContractReviewResult {
  id: string;
  category: ContractCategory;
  createdAt: string;
  overallRisk: RiskLevel;
  riskScore: number; // 0 (안전) ~ 100 (매우 위험)
  summary: string;
  clauses: ContractClauseRisk[];
  actionChecklist: string[];
  source: "ai" | "mock";
}

export interface LegalTerm {
  slug: string;
  term: string;
  hanja?: string;
  category: "부동산·임대차" | "근로·노동" | "민사·계약";
  officialDefinition: string; // 법제처 법령용어 API 원문 또는 표준 정의
  easySummary: [string, string, string]; // 초등학생도 이해하는 3줄 요약
  contractExample: string;
  precaution: string;
  faqs: { question: string; answer: string }[];
  source?: "law-api" | "curated";
}

export type LawsuitCaseType = "deposit" | "wage" | "loan" | "goods" | "other";

export interface LawsuitDraftInput {
  caseType: LawsuitCaseType;
  plaintiffName: string; // 가명 안내
  defendantName: string; // 가명 안내
  claimAmount: string;
  incidentDate: string;
  factsChronology: string;
}

export interface LawsuitDraftOutput {
  id: string;
  caseType: LawsuitCaseType;
  createdAt: string;
  title: string;
  claimPurpose: string; // 청구취지
  claimCause: string; // 청구원인
  evidenceChecklist: string[]; // 입증방법 체크리스트
  noticeTips: string[];
  source: "ai" | "mock";
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  targetCategory: ContractCategory;
  checklist: string[];
  sections: {
    heading: string;
    body: string;
  }[];
  faqs: { question: string; answer: string }[];
}

export interface LocalStorageState {
  recentReviews: ContractReviewResult[];
  savedTerms: string[]; // slugs
  lawsuitDrafts: LawsuitDraftOutput[];
}
