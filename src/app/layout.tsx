import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://law-decoder.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "계약서·생활법률 해독기 | 전세·근로계약서 AI 검토 & 셀프 소장 도우미",
    template: "%s | 계약서·생활법률 해독기",
  },
  description:
    "회원가입 없이 바로 쓰는 전세·월세 계약서 독소조항 AI 점검, 근로계약서 불공정 약관 검토, 법제처 법률용어 쉬운 3줄 번역, 셀프 민사 소장 초안 작성 도우미.",
  keywords: [
    "계약서 검토",
    "전세계약서 특약",
    "근로계약서 검토",
    "독소조항 찾기",
    "법률용어 번역",
    "대항력 확정일자",
    "셀프 소장 작성",
    "내용증명 양식",
    "생활법률 AI",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "계약서·생활법률 해독기",
    title: "계약서·생활법률 해독기 | AI 계약서 독소조항 점검 & 법률 번역기",
    description:
      "부동산 전세·월세 특약부터 근로계약서, 셀프 민사 소장 초안까지 로그인 없이 무료로 점검하세요.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
        alt: "계약서·생활법률 해독기",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: "MXxK7Skf_b4dZ_lDgqkenVyyTW97jUhCA5c1kDphQow",
    other: {
      "naver-site-verification": "4def0cefd93d9ee1d9342dc256258a0612b2f28c",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
