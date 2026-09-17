import { mongoClient } from "../lib/mongodb.js";
import { adjustProductPrices } from "../lib/price-adjustments.js";

try {
  const startedAt = new Date();
  const summary = await adjustProductPrices(startedAt);

  console.log(`[${startedAt.toISOString()}] 자동 가격 평가를 완료했습니다.`);
  console.log(`판매중 상품: ${summary.checked}건`);
  console.log(`평가 대상: ${summary.due}건`);
  console.log(`가격 상승: ${summary.increased}건`);
  console.log(`가격 인하: ${summary.decreased}건`);
  console.log(`가격 유지: ${summary.kept}건`);
} catch (error) {
  console.error("자동 가격 평가에 실패했습니다.", error);
  process.exitCode = 1;
} finally {
  await mongoClient.close();
}
