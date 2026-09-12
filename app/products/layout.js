// 현재 아무 역할도 하지 않는 빈 레이아웃으로 공통 ui가 생기면 그때 만들면 됨.

// Teacher: AGENTS.md는 빈 Layout을 금지합니다. 현재 children만 반환하는 파일을 제거했을 때와 공통 UI가 생겨 유지할 때의 차이를 확인하고, 중첩 layout이 URL별로 적용되는 순서를 설명해 보기.
export default function ProductsLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
