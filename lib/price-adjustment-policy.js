export const PRICE_EVALUATION_INTERVAL_MS = 24 * 60 * 60 * 1000;

export function calculatePriceEvaluation({
  currentPrice,
  minimumPrice,
  newWatchCount,
}) {
  if (!Number.isInteger(currentPrice) || currentPrice <= 0) {
    throw new TypeError("현재 가격은 0보다 큰 정수여야 합니다.");
  }

  if (
    !Number.isInteger(minimumPrice) ||
    minimumPrice <= 0 ||
    minimumPrice > currentPrice
  ) {
    throw new TypeError("최저 가격은 현재 가격 이하의 양의 정수여야 합니다.");
  }

  if (!Number.isInteger(newWatchCount) || newWatchCount < 0) {
    throw new TypeError("신규 관심 수는 0 이상의 정수여야 합니다.");
  }

  if (newWatchCount > 0) {
    return {
      newPrice: currentPrice,
      status: "KEEP",
      reason: `최근 24시간 동안 신규 관심 ${newWatchCount}건이 추가되어 가격 유지`,
    };
  }

  if (currentPrice === minimumPrice) {
    return {
      newPrice: currentPrice,
      status: "KEEP",
      reason: "최저 판매 가격에 도달하여 가격 유지",
    };
  }

  const discountedPrice = Math.round(currentPrice * 0.97);
  const newPrice = Math.max(minimumPrice, discountedPrice);

  return {
    newPrice,
    status: "DOWN",
    reason:
      newPrice === minimumPrice
        ? "신규 관심이 없어 3% 인하하되 최저 판매 가격으로 조정"
        : "신규 관심이 없어 가격을 3% 인하",
  };
}
