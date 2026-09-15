const sidoNames = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  세종: "세종특별자치시",
  경기: "경기도",
  강원: "강원특별자치도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전북특별자치도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};

const fullSidoNames = new Set(Object.values(sidoNames));

export function createRegionAddress({ sido, sigungu, bname }) {
  const normalizedSido = sidoNames[sido] ?? sido;
  const parts = [normalizedSido, sigungu, bname]
    .map((part) => part?.trim())
    .filter(Boolean);

  if (!normalizedSido || parts.length < 2) return "";

  return parts.join(" ").replace(/\s+/g, " ");
}

export function isValidRegionAddress(address) {
  if (typeof address !== "string") return false;

  const normalizedAddress = address.trim().replace(/\s+/g, " ");
  const sido = normalizedAddress.split(" ")[0];

  return (
    normalizedAddress.length >= 4 &&
    normalizedAddress.length <= 80 &&
    fullSidoNames.has(sido) &&
    /^[가-힣0-9·\-\s]+$/.test(normalizedAddress)
  );
}
