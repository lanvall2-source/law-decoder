import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "계약서·생활법률 해독기",
    short_name: "법률해독기",
    description:
      "전세·근로계약서 독소조항 AI 점검, 법제처 법률용어 쉬운 3줄 번역, 셀프 소장 초안 도우미",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0F172A",
    lang: "ko",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
