import "./global.css"


export const metadata = {
  title: "대파마켓",
  description: "가격은 기다리면 썰립니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
