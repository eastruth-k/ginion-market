// Teacher: global.css에는 색상·카드·차트용 자체 스타일이 있습니다. AGENTS.md의 SimpleDotCss와 최소 layout CSS 원칙에 비춰 승인된 범위를 확인하고, 수업 예제에서 필요한 스타일만 남기는 안을 논의해 보기.
import "./global.css"
import Header from "@/components/Header"

export const metadata = {
  title: "대파마켓",
  description: "가격은 기다리면 썰립니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header/>
        {children}
        </body>
    </html>
  );
}
